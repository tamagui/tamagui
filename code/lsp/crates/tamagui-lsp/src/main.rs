// The `tamagui-lsp` binary. One server, every editor.
//
// Transport is `lsp-server` (rust-analyzer's): a synchronous stdio loop with no
// async runtime. That choice is deliberate. LSP requires notifications to be
// processed IN ORDER, and a single loop gives that for free, where an async
// framework has to reimpose it. It also keeps startup cheap, which is a
// user-visible cost every time an editor opens a project.

use std::path::PathBuf;

use lsp_server::{Connection, ExtractError, Message, Notification, Request, RequestId, Response};
use lsp_types::notification::{
    DidChangeTextDocument, DidCloseTextDocument, DidOpenTextDocument, Notification as _,
    PublishDiagnostics,
};
use lsp_types::request::{
    ColorPresentationRequest, Completion, DocumentColor, HoverRequest, Request as _, Shutdown,
};
use lsp_types::*;

use tamagui_lsp::{
    ConfigWatcher, PositionEncoding, Projects, Range as DocRange, ReloadOutcome, Workspace,
    file_uri_to_path, projects,
};

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
    let roots = workspace_roots(&params);

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

    let found = projects::discover(&roots);
    if found.is_empty() {
        // the folder that was opened is still the best guess: it makes a
        // project whose artifact does not exist yet, which the watcher fills in
        // as soon as the compiler runs
        eprintln!("tamagui-lsp: no tamagui project found under any workspace folder");
    }
    let projects =
        Projects::new(if found.is_empty() { roots.clone() } else { found });
    eprintln!("tamagui-lsp: {} project(s)", projects.len());

    // instant config pickup: each watcher swaps its own project's snapshot,
    // then asks the loop to refresh diagnostics for whatever is open.
    let mut watchers = Vec::with_capacity(projects.len());
    for project in projects.iter() {
        let artifact = project.artifact();
        let sender = connection.sender.clone();
        let label = project.root.clone();
        let watcher = ConfigWatcher::spawn(&artifact, project.config.clone(), move |outcome| {
            match outcome {
                ReloadOutcome::Reloaded { revision } => {
                    eprintln!(
                        "tamagui-lsp: {} config reloaded (revision {revision})",
                        label.display()
                    );
                    // an empty notification the loop treats as "revalidate everything"
                    let _ = sender.send(Message::Notification(Notification {
                        method: REVALIDATE.into(),
                        params: serde_json::Value::Null,
                    }));
                }
                ReloadOutcome::Failed(error) => {
                    eprintln!(
                        "tamagui-lsp: {} config reload failed, keeping previous snapshot: {error}",
                        label.display()
                    );
                }
            }
        })
        .map_err(|e| format!("watching {}: {e}", artifact.display()))?;
        watchers.push(watcher);
    }

    let mut workspace = Workspace::new(projects);
    workspace.set_encoding(encoding);

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

/// Every folder the editor opened.
///
/// All of them, not just the first: VS Code multi-root workspaces and
/// `nvim`'s workspace folders both hand over several, and taking only the first
/// silently drops the rest.
fn workspace_roots(params: &InitializeParams) -> Vec<PathBuf> {
    #[allow(deprecated)]
    let folders: Vec<PathBuf> = params
        .workspace_folders
        .as_ref()
        .map(|folders| {
            folders.iter().filter_map(|f| file_uri_to_path(f.uri.as_str())).collect()
        })
        .unwrap_or_default();
    if !folders.is_empty() {
        return folders;
    }
    #[allow(deprecated)]
    let single = params
        .root_uri
        .as_ref()
        .and_then(|u| file_uri_to_path(u.as_str()))
        .unwrap_or_else(|| std::env::current_dir().unwrap_or_default());
    vec![single]
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
        ColorPresentationRequest::METHOD => cast::<ColorPresentationRequest>(request)
            .map(|(id, params)| reply(id, state.color_presentation(params))),
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
