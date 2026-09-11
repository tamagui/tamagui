# Tamagui Language Service for VS Code

This extension starts the `tamagui-lsp` binary and connects VS Code to it over
stdio. That is all it does.

Everything a user sees comes from the server: completions, hovers, diagnostics,
and the colour swatches next to theme values. The extension holds no syntax
heuristic, no Tamagui configuration, and no completion logic, so VS Code cannot
drift from Neovim, Helix, Zed, or any other editor talking to the same binary.

The server reads `.tamagui/tamagui.config.json`, the artifact the compiler
writes, and watches it for changes. It republishes on its own, so there is no
client-side invalidation to keep in sync. A project whose compiler has not run
yet, or whose config evaluation is failing, will have a stale artifact or none
at all, and the server's answers go stale with it.

`@tamagui/lsp` resolves the binary for the current platform. It is ESM-only and
an extension host is CJS, which is why the extension imports it dynamically. If
the launcher throws, it reports the actual fix (usually an `--omit=optional`
install, or an unsupported platform) and the extension surfaces that message
rather than a generic failure.
