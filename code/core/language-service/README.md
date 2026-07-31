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

It does not carry a fallback vocabulary. A missing or invalid generated config
produces no Tamagui completions, so the editor cannot suggest names the runtime
config does not define. The generated config is watched and its vocabulary is
reloaded without restarting tsserver.
