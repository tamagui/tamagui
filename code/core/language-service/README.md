# `@tamagui/language-service`

Shared flat-value tooling for editors, ESLint, and `tamagui check`.

The package reads the `.tamagui/tamagui.config.json` artifact emitted by the
compiler. Its entry points project the same grammar into completion,
diagnostic, hover, color, and project-checking APIs:

| entry | purpose |
| --- | --- |
| `@tamagui/language-service` | browser-safe core, document, and extractor APIs |
| `@tamagui/language-service/core` | tooling for one property and value |
| `@tamagui/language-service/document` | tooling mapped to source offsets |
| `@tamagui/language-service/extract-sucrase` | token-stream JSX extraction |
| `@tamagui/language-service/extract-estree` | ESTree JSX extraction |
| `@tamagui/language-service/check` | Node project checker used by `tamagui check` |

Editor integration is owned by the standalone Rust language server in
`@tamagui/lsp`. It speaks standard LSP and does not load TypeScript or install a
tsserver plugin. The VS Code extension is a thin client for the same binary used
by other editors.

```bash
npm install --save-dev @tamagui/lsp
```

For CI and pre-commit checks:

```bash
tamagui check
```
