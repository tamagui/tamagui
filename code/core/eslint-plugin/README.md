# `@tamagui/eslint-plugin`

ESLint diagnostics for Tamagui's flat style values. The rule delegates value
parsing, configured candidate validation, and v6 built-in names to
`@tamagui/style-grammar`.

```ts
// eslint.config.ts
import parser from '@typescript-eslint/parser'
import tamagui from '@tamagui/eslint-plugin'
import { createGrammarConfigView } from '@tamagui/style-grammar/tooling'
import config from './tamagui.config'

const grammarConfig = createGrammarConfigView(config)

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser },
    plugins: { tamagui },
    rules: {
      'tamagui/valid-flat-values': ['error', { config: grammarConfig }],
    },
  },
]
```

Oxlint 1.56 and newer can load the same rule as an external JavaScript plugin.
Point `specifier` at the installed package and pass the serializable grammar
configuration as the rule option:

```json
{
  "jsPlugins": [
    {
      "name": "tamagui",
      "specifier": "@tamagui/eslint-plugin"
    }
  ],
  "rules": {
    "tamagui/valid-flat-values": [
      "error",
      {
        "config": {
          "shorthands": {
            "bg": "backgroundColor"
          },
          "mediaNames": ["sm"],
          "themeNames": ["dark"],
          "tokenNames": {
            "color": ["red", "blue"],
            "space": ["4", "6"]
          }
        }
      }
    ]
  }
}
```

`valid-flat-values` checks static string values on imported Tamagui components
and `styled()` configs. It reports invalid clause grammar, configured
candidate/property mismatches, invalid payload shapes through the shared
payload validator, and obsolete v6 built-in names. It never fixes those
diagnostics. When a valid value differs only from style-grammar's canonical
print of the same parsed IR, the rule can safely collapse boundary whitespace
with ESLint's normal autofix.
