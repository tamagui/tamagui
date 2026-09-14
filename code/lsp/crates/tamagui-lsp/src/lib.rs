//! The Tamagui language server.
//!
//! One binary, every editor. See `plans/v3-lsp-rust.md` for why this is an LSP
//! server rather than the tsserver plugin it replaces, and for the measurements
//! that decided the data structures.
//!
//! The two properties the owner asked for, and where they live:
//!
//! * **incremental** — [`documents`] holds each open file in a rope and splices
//!   range edits in O(log n), converting LSP's UTF-16 positions correctly.
//! * **instant config pickup** — [`watcher`] reloads the compiler artifact and
//!   publishes it through an `ArcSwap`, so a rebuild is visible to every
//!   in-flight and future request without any reader taking a lock.

use std::path::PathBuf;
use std::sync::Arc;

use rustc_hash::FxHashMap;
use tamagui_config::ConfigHandle;

pub mod documents;
pub mod projects;
pub mod watcher;

pub use documents::{Document, EditError, Position, PositionEncoding, Range};
pub use projects::{Project, Projects};
pub use watcher::{ConfigWatcher, ReloadOutcome};

/// Open documents plus the live config of every project in the workspace.
///
/// Documents are owned exclusively by the request loop (LSP requires
/// notifications to be processed in order, so `didChange` is never concurrent
/// with itself), while each config is shared and read lock-free.
#[derive(Default)]
pub struct Workspace {
    documents: FxHashMap<String, Document>,
    projects: Projects,
    encoding: PositionEncoding,
}

impl Workspace {
    pub fn new(projects: Projects) -> Self {
        Self {
            documents: FxHashMap::default(),
            projects,
            encoding: PositionEncoding::Utf16,
        }
    }

    pub fn projects(&self) -> &Projects {
        &self.projects
    }

    /// The project a document belongs to.
    ///
    /// `None` means the file sits outside every project. Answering from some
    /// other project's config would be worse than answering nothing: in a
    /// monorepo the native app's theme set differs from the web app's, so the
    /// wrong config reports real theme values as unknown ones.
    pub fn project_for(&self, uri: &str) -> Option<&projects::Project> {
        let path = file_uri_to_path(uri)?;
        self.projects.for_path(&path)
    }

    /// The live config governing a document.
    pub fn config_for(&self, uri: &str) -> Option<&Arc<ConfigHandle>> {
        self.project_for(uri).map(|p| &p.config)
    }

    pub fn set_encoding(&mut self, encoding: PositionEncoding) {
        self.encoding = encoding;
    }

    pub fn encoding(&self) -> PositionEncoding {
        self.encoding
    }

    pub fn open(&mut self, uri: impl Into<String>, text: &str, version: i32) {
        self.documents
            .insert(uri.into(), Document::new(text, version, self.encoding));
    }

    pub fn close(&mut self, uri: &str) {
        self.documents.remove(uri);
    }

    pub fn get(&self, uri: &str) -> Option<&Document> {
        self.documents.get(uri)
    }

    pub fn open_uris(&self) -> impl Iterator<Item = &str> {
        self.documents.keys().map(|k| &**k)
    }

    /// Apply one incremental change to an open document.
    ///
    /// A change for a document the server never opened is an error rather than
    /// an implicit open: silently creating it would let the server drift from
    /// the editor with no way to notice.
    pub fn change(
        &mut self,
        uri: &str,
        range: Option<Range>,
        text: &str,
        version: i32,
    ) -> Result<(), ChangeError> {
        let document = self.documents.get_mut(uri).ok_or(ChangeError::NotOpen)?;
        document.apply_change(range, text, version).map_err(ChangeError::Edit)
    }
}

#[derive(Debug)]
pub enum ChangeError {
    NotOpen,
    Edit(EditError),
}

impl std::fmt::Display for ChangeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotOpen => write!(f, "a change arrived for a document that was never opened"),
            Self::Edit(e) => write!(f, "{e}"),
        }
    }
}

impl std::error::Error for ChangeError {}

/// `file:///a/b%20c` -> `/a/b c`. lsp-types 0.97 models a URI with fluent-uri,
/// which has no filesystem conversion, so percent-decoding is ours to do.
pub fn file_uri_to_path(uri: &str) -> Option<PathBuf> {
    let rest = uri.strip_prefix("file://")?;
    // skip an empty authority, keeping the leading slash of the path
    let rest = rest.strip_prefix("localhost").unwrap_or(rest);
    let bytes = rest.as_bytes();
    // decode to BYTES, not chars: `é` is percent-encoded as `%C3%A9`, so
    // pushing each decoded byte as a `char` would widen it to `Ã©`. reading the
    // hex digits from the byte slice rather than slicing the `&str` also keeps
    // a stray `%` in front of a multi-byte character from panicking on a
    // non-boundary slice.
    let mut out = Vec::with_capacity(bytes.len());
    let hex = |b: u8| (b as char).to_digit(16);
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%'
            && i + 2 < bytes.len()
            && let (Some(hi), Some(lo)) = (hex(bytes[i + 1]), hex(bytes[i + 2]))
        {
            out.push((hi * 16 + lo) as u8);
            i += 3;
            continue;
        }
        out.push(bytes[i]);
        i += 1;
    }
    Some(PathBuf::from(String::from_utf8(out).ok()?))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tracks_open_documents_through_edits() {
        let mut ws = Workspace::new(Projects::default());
        ws.open("file:///a.tsx", "<View bg=\"\" />", 1);
        let pos = Position { line: 0, character: 10 };
        ws.change("file:///a.tsx", Some(Range { start: pos, end: pos }), "red", 2)
            .unwrap();
        assert_eq!(ws.get("file:///a.tsx").unwrap().to_string(), "<View bg=\"red\" />");
        ws.close("file:///a.tsx");
        assert!(ws.get("file:///a.tsx").is_none());
    }

    #[test]
    fn a_change_to_an_unopened_document_is_an_error() {
        let mut ws = Workspace::new(Projects::default());
        let pos = Position { line: 0, character: 0 };
        assert!(matches!(
            ws.change("file:///ghost.tsx", Some(Range { start: pos, end: pos }), "x", 1),
            Err(ChangeError::NotOpen)
        ));
    }
}
