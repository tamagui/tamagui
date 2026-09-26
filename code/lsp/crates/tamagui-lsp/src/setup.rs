//! `tamagui-lsp setup <editor>` — the one command that plugs the server into
//! any editor.
//!
//! LSP is already the abstraction that makes one server work everywhere, but it
//! abstracts the PROTOCOL, not the installation. Every editor still wants its
//! own file, in its own language, naming a command. That last mile is where
//! this actually breaks for people, and in a predictable way: the published
//! instructions say `tamagui-lsp`, npm installs it to `node_modules/.bin`, and
//! nothing outside an npm script has that on `PATH`. The editor reports no
//! server and the user has no way to tell that from a broken server.
//!
//! So the config is emitted by the binary rather than written down, and it
//! names [`std::env::current_exe`]. A path the running process resolved for
//! itself cannot be wrong about where it is.

use std::path::PathBuf;

pub struct Editor {
    pub key: &'static str,
    pub name: &'static str,
    /// where the snippet goes, shown above the output
    pub target: &'static str,
    render: fn(&str) -> String,
}

/// JSON-quote a path. Windows paths carry backslashes, and a raw `C:\Users\…`
/// in a JSON config is an invalid escape that the editor reports as a parse
/// error somewhere unrelated to us.
fn json_string(path: &str) -> String {
    let mut out = String::with_capacity(path.len() + 2);
    out.push('"');
    for c in path.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            _ => out.push(c),
        }
    }
    out.push('"');
    out
}

/// Lua single-quoted string: same problem, different escape set.
fn lua_string(path: &str) -> String {
    format!("'{}'", path.replace('\\', "\\\\").replace('\'', "\\'"))
}

pub const EDITORS: &[Editor] = &[
    Editor {
        key: "neovim",
        name: "Neovim",
        target: "init.lua",
        render: |exe| {
            format!(
                "vim.lsp.config.tamagui = {{\n  \
                 cmd = {{ {} }},\n  \
                 filetypes = {{ 'typescriptreact', 'javascriptreact', 'typescript', 'javascript' }},\n  \
                 root_markers = {{ 'tamagui.build.ts', 'tamagui.config.ts', 'package.json' }},\n\
                 }}\n\
                 vim.lsp.enable('tamagui')\n",
                lua_string(exe)
            )
        },
    },
    Editor {
        key: "helix",
        name: "Helix",
        target: "languages.toml",
        render: |exe| {
            format!(
                "[language-server.tamagui]\n\
                 command = {}\n\n\
                 [[language]]\n\
                 name = \"tsx\"\n\
                 language-servers = [\"typescript-language-server\", \"tamagui\"]\n\n\
                 [[language]]\n\
                 name = \"jsx\"\n\
                 language-servers = [\"typescript-language-server\", \"tamagui\"]\n",
                json_string(exe)
            )
        },
    },
    Editor {
        key: "zed",
        name: "Zed",
        target: "settings.json",
        render: |exe| {
            format!(
                "{{\n  \"lsp\": {{\n    \"tamagui\": {{\n      \
                 \"binary\": {{ \"path\": {}, \"arguments\": [] }}\n    }}\n  }}\n}}\n",
                json_string(exe)
            )
        },
    },
    Editor {
        key: "sublime",
        name: "Sublime Text (LSP package)",
        target: "LSP.sublime-settings",
        render: |exe| {
            format!(
                "{{\n  \"clients\": {{\n    \"tamagui\": {{\n      \
                 \"enabled\": true,\n      \
                 \"command\": [{}],\n      \
                 \"selector\": \"source.tsx | source.jsx | source.ts | source.js\"\n    \
                 }}\n  }}\n}}\n",
                json_string(exe)
            )
        },
    },
    Editor {
        key: "emacs",
        name: "Emacs (eglot)",
        target: "init.el",
        render: |exe| {
            format!(
                "(add-to-list 'eglot-server-programs\n             \
                 '((tsx-ts-mode typescript-ts-mode js-ts-mode) . ({})))\n",
                json_string(exe)
            )
        },
    },
    Editor {
        key: "jetbrains",
        name: "JetBrains (LSP4IJ)",
        target: "Settings > Language Servers > New",
        render: |exe| {
            format!(
                "Command:   {exe}\n\
                 Mappings:  file name patterns *.tsx, *.jsx, *.ts, *.js\n\n\
                 LSP4IJ: https://plugins.jetbrains.com/plugin/23257-lsp4ij\n"
            )
        },
    },
];

/// Absolute path to this executable, for pasting into a config.
fn exe_path() -> PathBuf {
    std::env::current_exe().unwrap_or_else(|_| PathBuf::from("tamagui-lsp"))
}

/// Handle `setup [editor]`. Returns false when the argument names no editor,
/// so the caller can exit non-zero.
pub fn run(editor: Option<&str>) -> bool {
    let exe = exe_path();
    let exe = exe.to_string_lossy();

    let Some(key) = editor else {
        println!("Usage: tamagui-lsp setup <editor>\n");
        println!("Prints the configuration for that editor, with this binary's");
        println!("absolute path already filled in:\n");
        println!("  {exe}\n");
        println!("Editors:");
        for editor in EDITORS {
            println!("  {:<10} {}", editor.key, editor.name);
        }
        println!("\nVS Code needs none of this; install the Tamagui extension.");
        return true;
    };

    let key = key.to_ascii_lowercase();
    let Some(editor) = EDITORS.iter().find(|e| e.key == key) else {
        eprintln!("tamagui-lsp: unknown editor `{key}`");
        eprintln!(
            "Known: {}",
            EDITORS.iter().map(|e| e.key).collect::<Vec<_>>().join(", ")
        );
        return false;
    };

    println!("# {} — add to {}", editor.name, editor.target);
    println!();
    print!("{}", (editor.render)(&exe));
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_editor_embeds_the_real_binary_path() {
        // the whole point: a config naming the bare command breaks for a
        // devDependency install, because node_modules/.bin is not on PATH
        let exe = "/repo/node_modules/@tamagui/lsp-darwin-arm64/tamagui-lsp";
        for editor in EDITORS {
            let rendered = (editor.render)(exe);
            assert!(
                rendered.contains(exe),
                "{} did not embed the binary path: {rendered}",
                editor.key
            );
        }
    }

    #[test]
    fn a_windows_path_round_trips_through_lua_escaping() {
        // `C:\Users` pasted raw into a lua string is `\U`, an escape lua
        // rejects. the doubled form is what must come out.
        let exe = r"C:\Users\n8\node_modules\.bin\tamagui-lsp.exe";
        let neovim = EDITORS.iter().find(|e| e.key == "neovim").unwrap();
        let rendered = (neovim.render)(exe);
        assert!(
            rendered.contains(r"'C:\\Users\\n8\\node_modules\\.bin\\tamagui-lsp.exe'"),
            "neovim did not escape the path: {rendered}"
        );
    }

    #[test]
    fn json_editors_emit_json_that_parses_back_to_the_same_path() {
        let exe = r"C:\Users\n8\tamagui-lsp.exe";
        // zed nests the path one level deeper than sublime, so each names where
        // its own value lives rather than sharing a guess
        type Extract = fn(&serde_json::Value) -> Option<&str>;
        let cases: &[(&str, Extract)] = &[
            ("zed", |v| v["lsp"]["tamagui"]["binary"]["path"].as_str()),
            ("sublime", |v| v["clients"]["tamagui"]["command"][0].as_str()),
        ];
        for (key, extract) in cases {
            let editor = EDITORS.iter().find(|e| e.key == *key).unwrap();
            let rendered = (editor.render)(exe);
            let parsed: serde_json::Value = serde_json::from_str(&rendered)
                .unwrap_or_else(|e| panic!("{key} emitted invalid json: {e}\n{rendered}"));
            assert_eq!(
                extract(&parsed),
                Some(exe),
                "{key} lost or mangled the path: {rendered}"
            );
        }
    }

    #[test]
    fn editor_keys_are_unique() {
        let mut keys: Vec<&str> = EDITORS.iter().map(|e| e.key).collect();
        keys.sort_unstable();
        let count = keys.len();
        keys.dedup();
        assert_eq!(keys.len(), count, "duplicate editor key");
    }
}
