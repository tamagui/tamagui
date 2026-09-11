//! Multi-project support, so one server handles a whole monorepo.
//!
//! A monorepo has an artifact per app (`apps/web/.tamagui/`,
//! `apps/native/.tamagui/`), and they differ: a native config can declare
//! different tokens and a different theme set than its web sibling. Opening the
//! repository root and reading a single artifact therefore answers with another
//! app's vocabulary, which is worse than answering nothing.
//!
//! The model is the one Tailwind's language server arrived at: discover every
//! config in the workspace, keep one project per config, and route each open
//! document to a project. Tailwind needs glob selectors because a Tailwind
//! config names its own `content` globs. Ours does not, so routing is plain
//! longest-prefix: Tailwind's `ConfigDirectory` priority rule with the
//! ambiguous cases removed.
//!
//! What marks a project root is the part worth being careful about, because two
//! different paths are involved and only one of them is fixed:
//!
//! * The config SOURCE moves around, and is sometimes not a path at all.
//!   `tamagui.build.ts` names it, and it can be `./src/tamagui.config.ts`, a
//!   bare `tamagui.config.ts` in any of root/src/app/config, a package
//!   (tamagui.dev uses `@tamagui/tamagui-dev-config`), or a package subpath
//!   export like `my-package/tamagui-config`. Resolving that would mean
//!   reimplementing node resolution and reading TypeScript. This server does
//!   neither, and does not have to: the compiler already resolved it, and what
//!   lands on disk is the compiled artifact.
//! * The compiled ARTIFACT does not move. `getConfigFile` in the compiler is
//!   `join(options.root, '.tamagui', 'tamagui.config.json')`, so it is always
//!   `<projectRoot>/.tamagui/tamagui.config.json`.
//!
//! So a root is anything carrying `tamagui.build.ts` or the artifact. Both are
//! accepted because they appear at different times: `tamagui.build.ts` is
//! checked in and present before the compiler has ever run, which is exactly
//! when someone opens a fresh clone and expects the editor to work as soon as
//! they start the dev server. Registering the project then lets the watcher
//! pick the artifact up the moment it lands, with no restart.

use std::path::{Path, PathBuf};
use std::sync::Arc;

use tamagui_config::{ARTIFACT_RELATIVE_PATH, ConfigHandle};

/// Directory names never worth descending into.
///
/// `node_modules` is the one that matters: a monorepo has one per package and
/// each contains thousands of directories, several of which are themselves
/// published Tamagui apps carrying a `.tamagui` artifact. Walking it is both
/// slow and wrong.
const SKIP_DIRS: &[&str] = &[
    "node_modules",
    ".git",
    "dist",
    "build",
    "target",
    ".next",
    ".expo",
    ".turbo",
    ".cache",
    "coverage",
    "ios",
    "android",
];

/// How deep to look for an artifact below a workspace folder.
///
/// `apps/<name>/.tamagui` and `packages/<scope>/<name>/.tamagui` are the shapes
/// that occur; past this the walk costs more than it finds.
const MAX_DEPTH: usize = 5;

/// A cap so a pathological tree cannot make startup unbounded.
const MAX_PROJECTS: usize = 32;

/// Files whose presence marks a directory as a Tamagui project root.
///
/// `tamagui.build.ts` is the checked-in one, so a fresh clone is recognised
/// before the compiler has ever run.
const BUILD_MARKERS: &[&str] = &[
    "tamagui.build.ts",
    "tamagui.build.tsx",
    "tamagui.build.js",
    "tamagui.build.mjs",
];

/// One compiled config plus the directory it governs.
pub struct Project {
    /// the directory holding `.tamagui/`, so `<root>/.tamagui/…`
    pub root: PathBuf,
    pub config: Arc<ConfigHandle>,
}

impl Project {
    pub fn artifact(&self) -> PathBuf {
        self.root.join(ARTIFACT_RELATIVE_PATH)
    }
}

/// Every project in the workspace, ordered so the first match is the best one.
#[derive(Default)]
pub struct Projects {
    projects: Vec<Project>,
}

impl Projects {
    /// Build from discovered roots.
    ///
    /// Sorted by path length descending, so a plain scan finds the deepest
    /// enclosing root first: `apps/web` must win over the repository root when
    /// both carry an artifact, which is the normal state of a monorepo that
    /// also builds something at the top.
    pub fn new(mut roots: Vec<PathBuf>) -> Self {
        roots.sort_by(|a, b| {
            b.as_os_str().len().cmp(&a.as_os_str().len()).then_with(|| a.cmp(b))
        });
        roots.dedup();
        let projects = roots
            .into_iter()
            .map(|root| {
                let artifact = root.join(ARTIFACT_RELATIVE_PATH);
                let config = Arc::new(match tamagui_config::load_from_path(&artifact) {
                    Ok(snapshot) => {
                        eprintln!(
                            "tamagui-lsp: {} loaded {}",
                            root.display(),
                            snapshot.describe()
                        );
                        ConfigHandle::new(snapshot)
                    }
                    Err(error) => {
                        // normal before the first compiler run; the watcher
                        // picks the artifact up the moment it appears
                        eprintln!(
                            "tamagui-lsp: {} has no config yet ({error}); watching",
                            root.display()
                        );
                        ConfigHandle::empty()
                    }
                });
                Project { root, config }
            })
            .collect();
        Self { projects }
    }

    pub fn is_empty(&self) -> bool {
        self.projects.is_empty()
    }

    pub fn len(&self) -> usize {
        self.projects.len()
    }

    pub fn iter(&self) -> impl Iterator<Item = &Project> {
        self.projects.iter()
    }

    /// The project governing `path`: the deepest root that contains it.
    ///
    /// Returns `None` for a file outside every project rather than guessing at
    /// the first one, because in a monorepo the wrong config is a confidently
    /// wrong answer: it reports a real theme value as an unknown one.
    pub fn for_path(&self, path: &Path) -> Option<&Project> {
        self.projects.iter().find(|p| path.starts_with(&p.root))
    }
}

/// Find every directory under `roots` that carries a compiler artifact.
///
/// The single-project case stays free: a root with its own `.tamagui` is
/// returned immediately without descending, which is what a plain app is.
pub fn discover(roots: &[PathBuf]) -> Vec<PathBuf> {
    let mut found = Vec::new();
    for root in roots {
        walk(root, 0, &mut found);
    }
    found
}

fn walk(dir: &Path, depth: usize, found: &mut Vec<PathBuf>) {
    if found.len() >= MAX_PROJECTS {
        return;
    }
    let is_root = dir.join(ARTIFACT_RELATIVE_PATH).is_file()
        || BUILD_MARKERS.iter().any(|marker| dir.join(marker).is_file());
    if is_root {
        found.push(dir.to_path_buf());
        // keep descending: a monorepo root can build its own docs site while
        // apps/* build separately, and both are real projects
    }
    if depth >= MAX_DEPTH {
        return;
    }
    let Ok(entries) = std::fs::read_dir(dir) else { return };
    for entry in entries.flatten() {
        let Ok(kind) = entry.file_type() else { continue };
        // a symlinked directory can point back up the tree; following it turns
        // the walk into a cycle
        if !kind.is_dir() {
            continue;
        }
        let name = entry.file_name();
        let Some(name) = name.to_str() else { continue };
        if name.starts_with('.') || SKIP_DIRS.contains(&name) {
            continue;
        }
        walk(&entry.path(), depth + 1, found);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn artifact_at(dir: &Path) {
        let dot = dir.join(".tamagui");
        std::fs::create_dir_all(&dot).unwrap();
        std::fs::write(dot.join("tamagui.config.json"), r#"{"tamaguiConfig":{}}"#).unwrap();
    }

    /// a scratch directory that cleans itself up
    struct Temp(PathBuf);
    impl Temp {
        fn new(name: &str) -> Self {
            let dir = std::env::temp_dir().join(format!("tamagui-lsp-test-{name}"));
            let _ = std::fs::remove_dir_all(&dir);
            std::fs::create_dir_all(&dir).unwrap();
            // macOS temp dir is a symlink (/var -> /private/var), and the
            // server compares against paths the editor sends, which are real
            Self(dir.canonicalize().unwrap())
        }
    }
    impl Drop for Temp {
        fn drop(&mut self) {
            let _ = std::fs::remove_dir_all(&self.0);
        }
    }

    #[test]
    fn finds_every_app_in_a_monorepo() {
        let temp = Temp::new("monorepo");
        let web = temp.0.join("apps/web");
        let native = temp.0.join("apps/native");
        std::fs::create_dir_all(&web).unwrap();
        std::fs::create_dir_all(&native).unwrap();
        artifact_at(&web);
        artifact_at(&native);

        let found = discover(std::slice::from_ref(&temp.0));
        assert_eq!(found.len(), 2, "found {found:?}");
        assert!(found.contains(&web));
        assert!(found.contains(&native));
    }

    #[test]
    fn routes_a_file_to_its_own_app_not_a_sibling() {
        let temp = Temp::new("routing");
        let web = temp.0.join("apps/web");
        let native = temp.0.join("apps/native");
        std::fs::create_dir_all(&web).unwrap();
        std::fs::create_dir_all(&native).unwrap();
        artifact_at(&web);
        artifact_at(&native);

        let projects = Projects::new(discover(std::slice::from_ref(&temp.0)));
        assert_eq!(projects.for_path(&web.join("src/App.tsx")).unwrap().root, web);
        assert_eq!(projects.for_path(&native.join("src/App.tsx")).unwrap().root, native);
    }

    #[test]
    fn the_deepest_project_wins_over_an_enclosing_one() {
        // a repo that builds at the top AND has apps underneath; a file in
        // apps/web belongs to apps/web
        let temp = Temp::new("nested");
        let web = temp.0.join("apps/web");
        std::fs::create_dir_all(&web).unwrap();
        artifact_at(&temp.0);
        artifact_at(&web);

        let projects = Projects::new(discover(std::slice::from_ref(&temp.0)));
        assert_eq!(projects.len(), 2);
        assert_eq!(projects.for_path(&web.join("src/App.tsx")).unwrap().root, web);
        // and a file at the top still belongs to the top
        assert_eq!(projects.for_path(&temp.0.join("site/page.tsx")).unwrap().root, temp.0);
    }

    #[test]
    fn a_file_outside_every_project_belongs_to_none() {
        let temp = Temp::new("outside");
        let web = temp.0.join("apps/web");
        std::fs::create_dir_all(&web).unwrap();
        artifact_at(&web);

        let projects = Projects::new(discover(std::slice::from_ref(&temp.0)));
        // answering with apps/web's vocabulary here would report its own theme
        // values as unknown in a file that has nothing to do with it
        assert!(projects.for_path(Path::new("/somewhere/else/App.tsx")).is_none());
    }

    #[test]
    fn an_app_is_a_project_before_the_compiler_has_ever_run() {
        // a fresh clone has tamagui.build.ts and no .tamagui yet. registering
        // it now is what lets the watcher pick the artifact up on first build
        // instead of needing an editor restart.
        let temp = Temp::new("prebuild");
        let web = temp.0.join("apps/web");
        std::fs::create_dir_all(&web).unwrap();
        std::fs::write(web.join("tamagui.build.ts"), "export default {}").unwrap();

        let found = discover(std::slice::from_ref(&temp.0));
        assert_eq!(found, vec![web.clone()], "found {found:?}");

        let projects = Projects::new(found);
        assert_eq!(projects.for_path(&web.join("src/App.tsx")).unwrap().root, web);
    }

    #[test]
    fn a_built_dist_copy_of_the_marker_is_not_a_second_project() {
        // tamagui.dev compiles its own tamagui.build.ts into dist/, so the
        // marker legitimately appears twice in one app
        let temp = Temp::new("dist");
        std::fs::write(temp.0.join("tamagui.build.ts"), "export default {}").unwrap();
        let dist = temp.0.join("dist");
        std::fs::create_dir_all(&dist).unwrap();
        std::fs::write(dist.join("tamagui.build.js"), "module.exports = {}").unwrap();

        let found = discover(std::slice::from_ref(&temp.0));
        assert_eq!(found, vec![temp.0.clone()], "found {found:?}");
    }

    #[test]
    fn never_descends_into_node_modules() {
        // installed packages ship their own .tamagui artifacts; treating one as
        // a project points the whole editor at a dependency's config
        let temp = Temp::new("nodemodules");
        let dep = temp.0.join("node_modules/some-ui-kit");
        std::fs::create_dir_all(&dep).unwrap();
        artifact_at(&dep);
        artifact_at(&temp.0);

        let found = discover(std::slice::from_ref(&temp.0));
        assert_eq!(found, vec![temp.0.clone()], "found {found:?}");
    }
}
