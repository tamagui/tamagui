// The `tamagui-lsp` binary. One server, every editor.
//
// Transport is `lsp-server` (rust-analyzer's): a synchronous stdio loop with no
// async runtime. That choice is deliberate. LSP requires notifications to be
// processed IN ORDER, and a single loop gives that for free, where an async
// framework has to reimpose it. It also keeps startup cheap, which is a
// user-visible cost every time an editor opens a project.

use std::path::PathBuf;
use std::sync::Arc;

use lsp_server::{Connection, ExtractError, Message, Notification, Request, RequestId, Response};
use lsp_types::notification::{
    DidChangeTextDocument, DidCloseTextDocument, DidOpenTextDocument, Notification as _,
    PublishDiagnostics,
};
use lsp_types::request::{
    Completion, DocumentColor, HoverRequest, Request as _, Shutdown,
};
use lsp_types::*;
use tamagui_config::ConfigHandle;

use tamagui_lsp::{ConfigWatcher, PositionEncoding, Range as DocRange, ReloadOutcome, Workspace};

mod features;
mod sites;

fn main() -> Result<(), Box<dyn std::error::Error + Sync + Send>> {
    eprintln!("tamagui-lsp {}", env!("CARGO_PKG_VERSION"));

    let (connection, io_threads) = Connection::stdio();
    let capabilities = serde_json::to_value(server_capabilities())?;
    let params = connection.initialize(capabilities)?;
    let params: InitializeParams = serde_json::from_value(params)?;

    run(connection, params)?;
    io_threads.join()?;
    eprintln!("tamagui-lsp: shut down");
    Ok(())
}

fn server_capabilities() -> ServerCapabilities {
    ServerCapabilities {
        // incremental: the whole point of holding documents in a rope
        text_document_sync: Some(TextDocumentSyncCapability::Kind(
            TextDocumentSyncKind::INCREMENTAL,
        )),
        completion_provider: Some(CompletionOptions {
            // `:` opens a clause payload, `-` continues a kebab-case token
            // name, and a space starts a new clause. these are the characters
            // after which an editor should re-ask without the user typing more.
            trigger_characters: Some(vec![":".into(), "-".into(), " ".into(), "\"".into()]),
            ..Default::default()
        }),
        hover_provider: Some(HoverProviderCapability::Simple(true)),
        color_provider: Some(ColorProviderCapability::Simple(true)),
        ..Default::default()
    }
}

fn run(
    connection: Connection,
    params: InitializeParams,
) -> Result<(), Box<dyn std::error::Error + Sync + Send>> {
    let root = workspace_root(&params);
    let artifact = root.join(tamagui_config::ARTIFACT_RELATIVE_PATH);

    // negotiating utf-8 removes the position conversion entirely. most clients
    // only offer utf-16, so this is an optimisation, never a requirement.
    let encoding = params
        .capabilities
        .general
        .as_ref()
        .and_then(|g| g.position_encodings.as_ref())
        .filter(|e| e.contains(&PositionEncodingKind::UTF8))
        .map(|_| PositionEncoding::Utf8)
        .unwrap_or(PositionEncoding::Utf16);

    let config = Arc::new(match tamagui_config::load_from_path(&artifact) {
        Ok(snapshot) => {
            eprintln!("tamagui-lsp: loaded {}", snapshot.describe());
            ConfigHandle::new(snapshot)
        }
        Err(error) => {
            // starting without a config is normal: the compiler may not have
            // run yet. the watcher picks it up the moment it appears, so this
            // is a log line and not a failure.
            eprintln!("tamagui-lsp: no config yet ({error}); watching {}", artifact.display());
            ConfigHandle::empty()
        }
    });

    let mut workspace = Workspace::new(config.clone());
    workspace.set_encoding(encoding);

    // instant config pickup: the watcher swaps the snapshot, then asks the loop
    // to refresh diagnostics for whatever is open.
    let sender = connection.sender.clone();
    let _watcher = ConfigWatcher::spawn(&artifact, config.clone(), move |outcome| match outcome {
        ReloadOutcome::Reloaded { revision } => {
            eprintln!("tamagui-lsp: config reloaded (revision {revision})");
            // an empty notification the loop treats as "revalidate everything"
            let _ = sender.send(Message::Notification(Notification {
                method: REVALIDATE.into(),
                params: serde_json::Value::Null,
            }));
        }
        ReloadOutcome::Failed(error) => {
            eprintln!("tamagui-lsp: config reload failed, keeping previous snapshot: {error}");
        }
    })
    .map_err(|e| format!("watching {}: {e}", artifact.display()))?;

    let mut state = features::State::new(workspace);

    for message in &connection.receiver {
        match message {
            Message::Request(request) => {
                if connection.handle_shutdown(&request)? {
                    return Ok(());
                }
                handle_request(&connection, &mut state, request)?;
            }
            Message::Notification(notification) => {
                handle_notification(&connection, &mut state, notification)?;
            }
            Message::Response(_) => {}
        }
    }
    Ok(())
}

/// internal notification the watcher thread uses to wake the loop
const REVALIDATE: &str = "tamagui/revalidate";

fn workspace_root(params: &InitializeParams) -> PathBuf {
    #[allow(deprecated)]
    params
        .workspace_folders
        .as_ref()
        .and_then(|folders| folders.first())
        .and_then(|folder| file_uri_to_path(folder.uri.as_str()))
        .or_else(|| params.root_uri.as_ref().and_then(|u| file_uri_to_path(u.as_str())))
        .unwrap_or_else(|| std::env::current_dir().unwrap_or_default())
}

/// `file:///a/b%20c` -> `/a/b c`. lsp-types 0.97 models a URI with fluent-uri,
/// which has no filesystem conversion, so percent-decoding is ours to do.
fn file_uri_to_path(uri: &str) -> Option<PathBuf> {
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

fn handle_request(
    connection: &Connection,
    state: &mut features::State,
    request: Request,
) -> Result<(), Box<dyn std::error::Error + Sync + Send>> {
    let id = request.id.clone();
    let response = match request.method.as_str() {
        Completion::METHOD => cast::<Completion>(request)
            .map(|(id, params)| reply(id, state.completion(params))),
        HoverRequest::METHOD => {
            cast::<HoverRequest>(request).map(|(id, params)| reply(id, state.hover(params)))
        }
        DocumentColor::METHOD => cast::<DocumentColor>(request)
            .map(|(id, params)| reply(id, state.document_colors(params))),
        Shutdown::METHOD => Ok(Response::new_ok(id, serde_json::Value::Null)),
        // an unknown method gets an empty success rather than an error: editors
        // send optional requests speculatively and an error reads as a crash
        _ => Ok(Response::new_ok(id, serde_json::Value::Null)),
    };
    if let Ok(response) = response {
        connection.sender.send(Message::Response(response))?;
    }
    Ok(())
}

fn handle_notification(
    connection: &Connection,
    state: &mut features::State,
    notification: Notification,
) -> Result<(), Box<dyn std::error::Error + Sync + Send>> {
    match notification.method.as_str() {
        DidOpenTextDocument::METHOD => {
            let params: DidOpenTextDocumentParams =
                serde_json::from_value(notification.params)?;
            let uri = params.text_document.uri.to_string();
            state.workspace.open(
                uri.clone(),
                &params.text_document.text,
                params.text_document.version,
            );
            publish(connection, state, &uri)?;
        }
        DidChangeTextDocument::METHOD => {
            let params: DidChangeTextDocumentParams =
                serde_json::from_value(notification.params)?;
            let uri = params.text_document.uri.to_string();
            for change in params.content_changes {
                let range = change.range.map(|r| DocRange {
                    start: tamagui_lsp::Position {
                        line: r.start.line,
                        character: r.start.character,
                    },
                    end: tamagui_lsp::Position {
                        line: r.end.line,
                        character: r.end.character,
                    },
                });
                if let Err(error) = state.workspace.change(
                    &uri,
                    range,
                    &change.text,
                    params.text_document.version,
                ) {
                    // a rejected edit means the server's copy has drifted from
                    // the editor's. say so loudly rather than serving results
                    // computed against a wrong buffer.
                    eprintln!("tamagui-lsp: {uri}: {error}");
                }
            }
            publish(connection, state, &uri)?;
        }
        DidCloseTextDocument::METHOD => {
            let params: DidCloseTextDocumentParams =
                serde_json::from_value(notification.params)?;
            let uri = params.text_document.uri.to_string();
            state.workspace.close(&uri);
            // clear this file's diagnostics, or the editor keeps showing them
            send_diagnostics(connection, &uri, Vec::new())?;
        }
        REVALIDATE => {
            state.invalidate_vocabulary();
            let open: Vec<String> =
                state.workspace.open_uris().map(str::to_string).collect();
            for uri in open {
                publish(connection, state, &uri)?;
            }
        }
        _ => {}
    }
    Ok(())
}

fn publish(
    connection: &Connection,
    state: &mut features::State,
    uri: &str,
) -> Result<(), Box<dyn std::error::Error + Sync + Send>> {
    let diagnostics = state.diagnostics(uri);
    send_diagnostics(connection, uri, diagnostics)
}

fn send_diagnostics(
    connection: &Connection,
    uri: &str,
    diagnostics: Vec<Diagnostic>,
) -> Result<(), Box<dyn std::error::Error + Sync + Send>> {
    let Ok(parsed) = uri.parse::<Uri>() else { return Ok(()) };
    let params = PublishDiagnosticsParams { uri: parsed, diagnostics, version: None };
    connection.sender.send(Message::Notification(Notification {
        method: PublishDiagnostics::METHOD.into(),
        params: serde_json::to_value(params)?,
    }))?;
    Ok(())
}

fn cast<R>(request: Request) -> Result<(RequestId, R::Params), ExtractError<Request>>
where
    R: lsp_types::request::Request,
    R::Params: serde::de::DeserializeOwned,
{
    request.extract(R::METHOD)
}

fn reply<T: serde::Serialize>(id: RequestId, value: T) -> Response {
    match serde_json::to_value(value) {
        Ok(value) => Response::new_ok(id, value),
        Err(error) => Response::new_err(id, -32603, error.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decodes_file_uris_including_non_ascii_paths() {
        assert_eq!(
            file_uri_to_path("file:///Users/n8/dev/app"),
            Some(PathBuf::from("/Users/n8/dev/app"))
        );
        // a space is the encoding every editor produces on a real project path
        assert_eq!(
            file_uri_to_path("file:///Users/n8/My%20Projects/app"),
            Some(PathBuf::from("/Users/n8/My Projects/app"))
        );
        // multi-byte characters arrive as several percent-escapes and have to
        // be reassembled as bytes; decoding each as a char yields `cafÃ©`
        assert_eq!(
            file_uri_to_path("file:///Users/n8/caf%C3%A9"),
            Some(PathBuf::from("/Users/n8/café"))
        );
        assert_eq!(
            file_uri_to_path("file:///%E6%97%A5%E6%9C%AC/app"),
            Some(PathBuf::from("/日本/app"))
        );
        // an empty authority is dropped, keeping the leading slash
        assert_eq!(
            file_uri_to_path("file://localhost/srv/app"),
            Some(PathBuf::from("/srv/app"))
        );
    }

    #[test]
    fn malformed_escapes_survive_instead_of_panicking() {
        // a bare `%` is not an escape, and one sitting in front of a multi-byte
        // character used to slice through a char boundary and panic
        assert_eq!(
            file_uri_to_path("file:///tmp/100%25"),
            Some(PathBuf::from("/tmp/100%"))
        );
        assert_eq!(file_uri_to_path("file:///tmp/%é"), Some(PathBuf::from("/tmp/%é")));
        assert_eq!(file_uri_to_path("file:///tmp/%zz"), Some(PathBuf::from("/tmp/%zz")));
        assert_eq!(file_uri_to_path("file:///tmp/%"), Some(PathBuf::from("/tmp/%")));
        // a non-file scheme is not ours to resolve
        assert_eq!(file_uri_to_path("untitled:Untitled-1"), None);
    }
}
