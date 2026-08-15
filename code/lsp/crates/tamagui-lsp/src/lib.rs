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

use std::sync::Arc;

use rustc_hash::FxHashMap;
use tamagui_config::ConfigHandle;

pub mod documents;
pub mod watcher;

pub use documents::{Document, EditError, Position, PositionEncoding, Range};
pub use watcher::{ConfigWatcher, ReloadOutcome};

/// Open documents plus the live config.
///
/// Documents are owned exclusively by the request loop (LSP requires
/// notifications to be processed in order, so `didChange` is never concurrent
/// with itself), while the config is shared and read lock-free.
#[derive(Default)]
pub struct Workspace {
    documents: FxHashMap<String, Document>,
    config: Arc<ConfigHandle>,
    encoding: PositionEncoding,
}

impl Workspace {
    pub fn new(config: Arc<ConfigHandle>) -> Self {
        Self { documents: FxHashMap::default(), config, encoding: PositionEncoding::Utf16 }
    }

    pub fn config(&self) -> &Arc<ConfigHandle> {
        &self.config
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tracks_open_documents_through_edits() {
        let mut ws = Workspace::new(Arc::new(ConfigHandle::empty()));
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
        let mut ws = Workspace::new(Arc::new(ConfigHandle::empty()));
        let pos = Position { line: 0, character: 0 };
        assert!(matches!(
            ws.change("file:///ghost.tsx", Some(Range { start: pos, end: pos }), "x", 1),
            Err(ChangeError::NotOpen)
        ));
    }
}
