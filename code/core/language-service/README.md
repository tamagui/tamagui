# `@tamagui/language-service`

TypeScript language-service completions for Tamagui flat style values. The
plugin reads the `.tamagui/tamagui.config.json` file emitted from the active
Tamagui runtime config, then delegates its vocabulary, parsing, and
property-family validation to `@tamagui/style-grammar`.

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "@tamagui/language-service" }]
  }
}
```

VS Code must also be able to resolve the plugin package. Select the workspace
TypeScript version, or add this machine setting and restart the TypeScript
server:

```json
{
  "js/ts.tsserver.pluginPaths": ["node_modules"]
}
```

`js/ts.tsserver.pluginPaths` is machine-scoped, so VS Code ignores it in a
workspace `.vscode/settings.json` file.

VS Code also disables automatic suggestions inside strings by default. Enable
them for TSX if completion should open after typing a space in a value:

```json
{
  "[typescriptreact]": {
    "editor.quickSuggestions": {
      "strings": "on"
    }
  }
}
```

If the generated config lives elsewhere, set `configPath` relative to the
TypeScript project:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@tamagui/language-service",
        "configPath": ".tamagui/tamagui.config.json"
      }
    ]
  }
}
```

The plugin completes configured values and modifiers in base values and
conditional clause payloads on components carrying Tamagui's `staticConfig`
type marker and configurations passed to the core Tamagui `styled()` export.
TypeScript's contextual prop type remains the authority for whether the host
accepts that property and value.

Modifier suggestions are sorted as state, group, media, container, root theme,
then platform. `hover:` and `press:` lead the state group. Nested themes remain
valid `<Theme>` targets but are not flat-value modifiers, so an active
`dark_blue` theme matches `dark:` and never adds a `dark_blue:` suggestion.

It does not carry a fallback vocabulary. A missing or invalid generated config
produces no Tamagui completions, so the editor cannot suggest names the runtime
config does not define. The generated config is watched and its vocabulary is
reloaded without restarting tsserver.
