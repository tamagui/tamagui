// Watches the compiler's config artifact so a rebuild is visible immediately.
//
// Three things this has to get right:
//
// 1. **Watch the directory, not the file.** The compiler writes the artifact by
//    replacing it (write-temp-then-rename, or truncate-then-write). A watch
//    registered on the original inode stops firing after the first replace, so
//    the server would serve a stale config forever after one rebuild. Watching
//    `.tamagui/` and filtering by filename survives replacement.
//
// 2. **Debounce.** A single compiler run can emit several events for one
//    logical write, and the artifact is 13.5 MB, so reloading per event wastes
//    real work. Events coalesce into one reload per quiet period.
//
// 3. **Never publish a partial read.** A reload that fails (the file is
//    mid-write, or the compiler wrote something invalid) leaves the previous
//    snapshot in place. A half-parsed config would silently disable diagnostics
//    across the whole project, which is worse than briefly serving a stale one.

use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::sync::mpsc::{Receiver, RecvTimeoutError, channel};
use std::thread;
use std::time::Duration;

use notify::{Event, EventKind, RecursiveMode, Watcher};
use tamagui_config::{ConfigHandle, LoadError};

/// how long the artifact must be quiet before a reload runs
const DEBOUNCE: Duration = Duration::from_millis(120);

/// What happened on a reload attempt, reported so the server can surface it and
/// republish diagnostics.
#[derive(Debug)]
pub enum ReloadOutcome {
    /// a new snapshot is live; carries its revision
    Reloaded { revision: u64 },
    /// the artifact changed but could not be loaded; the previous snapshot
    /// stays live
    Failed(LoadError),
}

/// Owns the watcher thread. Dropping it stops the thread.
pub struct ConfigWatcher {
    _watcher: notify::RecommendedWatcher,
    _thread: thread::JoinHandle<()>,
}

impl ConfigWatcher {
    /// Watch `artifact` and republish into `handle` on every change.
    ///
    /// `on_reload` runs on the watcher thread after the swap, which is where
    /// the server refreshes diagnostics for open documents.
    pub fn spawn(
        artifact: impl AsRef<Path>,
        handle: Arc<ConfigHandle>,
        on_reload: impl Fn(ReloadOutcome) + Send + 'static,
    ) -> notify::Result<Self> {
        let artifact = artifact.as_ref().to_path_buf();
        let directory = artifact
            .parent()
            .map(Path::to_path_buf)
            .unwrap_or_else(|| PathBuf::from("."));
        let filename = artifact.file_name().map(|n| n.to_os_string());

        // the directory may not exist yet: the compiler creates `.tamagui/` on
        // its first run. create it so the watch can be registered now rather
        // than requiring a restart after the first build.
        std::fs::create_dir_all(&directory).ok();

        let (tx, rx) = channel::<Event>();
        let mut watcher = notify::recommended_watcher(move |res: notify::Result<Event>| {
            if let Ok(event) = res {
                // send failure just means the server is shutting down
                let _ = tx.send(event);
            }
        })?;
        watcher.watch(&directory, RecursiveMode::NonRecursive)?;

        let thread = thread::spawn(move || {
            debounce_loop(rx, artifact, filename, handle, on_reload);
        });

        Ok(Self { _watcher: watcher, _thread: thread })
    }
}

fn debounce_loop(
    rx: Receiver<Event>,
    artifact: PathBuf,
    filename: Option<std::ffi::OsString>,
    handle: Arc<ConfigHandle>,
    on_reload: impl Fn(ReloadOutcome),
) {
    let touches_artifact = |event: &Event| -> bool {
        if !matches!(
            event.kind,
            EventKind::Create(_) | EventKind::Modify(_) | EventKind::Remove(_) | EventKind::Any
        ) {
            return false;
        }
        match &filename {
            None => true,
            Some(name) => event.paths.iter().any(|p| p.file_name() == Some(name)),
        }
    };

    loop {
        // block until something happens
        let Ok(first) = rx.recv() else { return };
        if !touches_artifact(&first) {
            continue;
        }

        // drain the burst: keep extending the window while events keep landing
        loop {
            match rx.recv_timeout(DEBOUNCE) {
                Ok(_) => continue,
                Err(RecvTimeoutError::Timeout) => break,
                Err(RecvTimeoutError::Disconnected) => return,
            }
        }

        match tamagui_config::load_from_path(&artifact) {
            Ok(snapshot) => {
                let revision = snapshot.revision;
                // the swap is the publication point: every reader from here on
                // sees the new config, and none of them blocked for it
                handle.store(snapshot);
                on_reload(ReloadOutcome::Reloaded { revision });
            }
            // a failed reload keeps the previous snapshot live on purpose
            Err(error) => on_reload(ReloadOutcome::Failed(error)),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::mpsc::sync_channel;

    const CONFIG_A: &str = r#"{"tamaguiConfig":{"themes":{"light":{"background":"rgba(1, 1, 1, 1)"}}}}"#;
    const CONFIG_B: &str = r#"{"tamaguiConfig":{"themes":{"light":{"background":"rgba(2, 2, 2, 1)"},"dark":{"background":"rgba(3, 3, 3, 1)"}}}}"#;

    fn temp_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("tamagui-lsp-test-{name}-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn a_rewrite_publishes_a_new_snapshot() {
        let dir = temp_dir("rewrite");
        let artifact = dir.join("tamagui.config.json");
        std::fs::write(&artifact, CONFIG_A).unwrap();

        let handle = Arc::new(ConfigHandle::new(
            tamagui_config::load_from_path(&artifact).unwrap(),
        ));
        assert_eq!(handle.load().themes.theme_count(), 1);

        let (tx, rx) = sync_channel::<()>(8);
        let _watcher = ConfigWatcher::spawn(&artifact, handle.clone(), move |outcome| {
            if matches!(outcome, ReloadOutcome::Reloaded { .. }) {
                let _ = tx.try_send(());
            }
        })
        .unwrap();

        // replace the way a compiler does: write a temp file then rename over
        let temp = dir.join("tamagui.config.json.tmp");
        std::fs::write(&temp, CONFIG_B).unwrap();
        std::fs::rename(&temp, &artifact).unwrap();

        rx.recv_timeout(Duration::from_secs(10))
            .expect("watcher should have reloaded after a rename-replace");

        // the whole point: readers now see the new config with no restart
        assert_eq!(handle.load().themes.theme_count(), 2);
        assert!(handle.load().themes.value_by_name("dark", "background").is_some());

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn an_invalid_rewrite_keeps_the_previous_snapshot_live() {
        let dir = temp_dir("invalid");
        let artifact = dir.join("tamagui.config.json");
        std::fs::write(&artifact, CONFIG_A).unwrap();

        let handle = Arc::new(ConfigHandle::new(
            tamagui_config::load_from_path(&artifact).unwrap(),
        ));
        let revision_before = handle.revision();

        let (tx, rx) = sync_channel::<()>(8);
        let _watcher = ConfigWatcher::spawn(&artifact, handle.clone(), move |outcome| {
            if matches!(outcome, ReloadOutcome::Failed(_)) {
                let _ = tx.try_send(());
            }
        })
        .unwrap();

        std::fs::write(&artifact, "{ this is not json").unwrap();

        rx.recv_timeout(Duration::from_secs(10))
            .expect("watcher should have reported a failed reload");

        // serving a stale config beats serving an empty one, which would
        // silently drop every diagnostic in the project
        assert_eq!(handle.revision(), revision_before);
        assert_eq!(handle.load().themes.theme_count(), 1);

        std::fs::remove_dir_all(&dir).ok();
    }
}
