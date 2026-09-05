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
mod setup;
mod sites;

fn main() -> Result<(), Box<dyn std::error::Error + Sync + Send>> {
    // argv is checked before stdio is claimed: an editor launches this with no
    // arguments, and anything else is a person at a terminal who wants an
    // answer rather than a JSON-RPC stream.
    let args: Vec<String> = std::env::args().skip(1).collect();
    match args.first().map(String::as_str) {
        Some("setup") => {
            return if setup::run(args.get(1).map(String::as_str)) {
                Ok(())
            } else {
                std::process::exit(1)
            };
        }
        Some("--version" | "-V") => {
            println!("tamagui-lsp {}", env!("CARGO_PKG_VERSION"));
            return Ok(());
        }
        Some("--help" | "-h") => {
            println!("tamagui-lsp {}\n", env!("CARGO_PKG_VERSION"));
            println!("The Tamagui language server. Speaks LSP over stdio.\n");
            println!("With no arguments it serves; an editor launches it that way.\n");
            println!("  setup [editor]   print the config for an editor");
            println!("  --version        print the version");
            return Ok(());
        }
        _ => {}
    }

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

    let projects = Projects::new(match &roots {
        Roots::Declared(roots) => {
            let found = projects::discover(roots);
            if found.is_empty() {
                // the folders that were opened are still the best guess: they
                // make projects whose artifacts do not exist yet, which the
                // watcher fills in as soon as the compiler runs
                eprintln!("tamagui-lsp: no tamagui project found under any workspace folder");
                roots.clone()
            } else {
                found
            }
        }
        // the client named no workspace, so this is the process working
        // directory, which for an editor launched from a launcher is routinely
        // `$HOME`. Searching it would walk an unrelated tree five levels deep,
        // so take it as the one project and let the watcher do the rest.
        Roots::Assumed(cwd) => {
            eprintln!(
                "tamagui-lsp: client declared no workspace; assuming {}",
                cwd.display()
            );
            vec![cwd.clone()]
        }
    });
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

/// What the client told us about the workspace, and how sure we are.
///
/// The distinction matters because it decides whether to go looking for other
/// projects. A client that named a workspace is inviting a search of it; a
/// client that named nothing is not, and the working directory of an editor
/// process is frequently `$HOME`.
enum Roots {
    /// the client named the workspace, so discovery may search it
    Declared(Vec<PathBuf>),
    /// nothing was declared and this is the process working directory
    Assumed(PathBuf),
}

/// Every folder the editor opened.
///
/// LSP has accumulated three ways to say this and clients in the wild use all
/// of them, so all three are read, newest first:
///
/// * `workspaceFolders` — every folder, not just the first. VS Code multi-root
///   and Neovim both send several and taking one silently drops the rest.
/// * `rootUri` — the single-folder form.
/// * `rootPath` — deprecated in LSP 3.0 and still the only thing some minimal
///   clients send. It is a plain path rather than a URI. Ignoring it used to
///   land those clients on the working-directory branch below, which is how a
///   correctly configured editor ends up finding no project.
fn workspace_roots(params: &InitializeParams) -> Roots {
    #[allow(deprecated)]
    let folders: Vec<PathBuf> = params
        .workspace_folders
        .as_ref()
        .map(|folders| {
            folders.iter().filter_map(|f| file_uri_to_path(f.uri.as_str())).collect()
        })
        .unwrap_or_default();
    if !folders.is_empty() {
        return Roots::Declared(folders);
    }
    #[allow(deprecated)]
    let declared = params
        .root_uri
        .as_ref()
        .and_then(|u| file_uri_to_path(u.as_str()))
        .or_else(|| params.root_path.as_ref().map(PathBuf::from));
    match declared {
        Some(root) => Roots::Declared(vec![root]),
        None => Roots::Assumed(std::env::current_dir().unwrap_or_default()),
    }
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

    /// The three shapes real clients send. Each is what that family actually
    /// puts on the wire, so a regression here is an editor that silently finds
    /// no project rather than a failing assertion somewhere abstract.
    fn init_params(json: serde_json::Value) -> InitializeParams {
        serde_json::from_value(json).expect("valid InitializeParams")
    }

    fn declared(roots: Roots) -> Vec<PathBuf> {
        match roots {
            Roots::Declared(paths) => paths,
            Roots::Assumed(path) => panic!("expected declared roots, got assumed {path:?}"),
        }
    }

    #[test]
    fn reads_workspace_folders_the_way_vscode_and_neovim_send_them() {
        let roots = workspace_roots(&init_params(serde_json::json!({
            "capabilities": {},
            "workspaceFolders": [
                { "uri": "file:///repo/apps/web", "name": "web" },
                { "uri": "file:///repo/apps/native", "name": "native" }
            ]
        })));
        // both, not just the first: a multi-root workspace loses half its
        // projects otherwise
        assert_eq!(
            declared(roots),
            vec![PathBuf::from("/repo/apps/web"), PathBuf::from("/repo/apps/native")]
        );
    }

    #[test]
    fn reads_root_uri_when_that_is_all_the_client_sends() {
        let roots = workspace_roots(&init_params(serde_json::json!({
            "capabilities": {},
            "rootUri": "file:///repo"
        })));
        assert_eq!(declared(roots), vec![PathBuf::from("/repo")]);
    }

    #[test]
    fn reads_the_deprecated_root_path_rather_than_giving_up() {
        // some minimal clients still send only this. it is a plain path, not a
        // URI, and treating its absence as "no workspace" sends a correctly
        // configured editor down the working-directory branch.
        let roots = workspace_roots(&init_params(serde_json::json!({
            "capabilities": {},
            "rootPath": "/repo"
        })));
        assert_eq!(declared(roots), vec![PathBuf::from("/repo")]);
    }

    #[test]
    fn a_client_that_declares_nothing_is_not_a_licence_to_search() {
        let roots = workspace_roots(&init_params(serde_json::json!({ "capabilities": {} })));
        // the working directory of an editor launched from a launcher is
        // routinely $HOME; searching it five levels deep is not acceptable
        assert!(matches!(roots, Roots::Assumed(_)));
    }

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
