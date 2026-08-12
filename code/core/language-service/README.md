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

VS Code's TypeScript provider does not register `:` as a completion trigger.
The companion Tamagui Language Service extension retriggers suggestions after a
modifier colon and delegates the resulting request back to this plugin.

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
After a modifier colon, the plugin offers both property values and another
modifier, so `margin="4 sm:h"` completes to `margin="4 sm:hover:"`.
State continuations such as `hover:` and `press:` sort first, followed by the
other modifier categories and configured property values. A finished chain such
as `margin="4 web:sm:hover:"` still includes its payload tokens in that list.
Modifier completion traverses a trie derived from the generated config. The
canonical authoring order is platform, root theme, container, viewport media,
group state, then subject state. A trie node omits conditions already used,
aliases of used conditions, additional platforms or root themes, earlier
categories, and conditions beyond the emitter's five non-platform limit.
Runtime parsing remains order-insensitive for compatibility, but tooling only
authors the canonical shape. A completed payload resets traversal, so every new
space-delimited clause starts from the trie root at arbitrary program length.

Container conditions include their size: `@sm:` targets the nearest container
and `@sm/layout:` targets a named container. `@container:` is not a modifier.

It does not carry a fallback vocabulary. A missing or invalid generated config
produces no Tamagui completions, so the editor cannot suggest names the runtime
config does not define. The generated config is watched and its vocabulary is
reloaded without restarting tsserver.
