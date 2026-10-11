---
name: tamagui-theme-generator
description: Generate custom Tamagui themes, color palettes, and preview URLs. Use when creating or refining a color scheme, authoring light/dark palettes with brand accents, or previewing generated themes in the browser.
metadata:
  version: 3.0.0
---

# Tamagui Theme Generator Skill

Tamagui themes generate from palettes with light and dark scales. An AI agent can design a cohesive palette for any brand, preview it live on the Tamagui theme builder, and output production-ready TypeScript config.

## 1. Palette Architecture

Each theme defines two core palettes:
- `base`: Neutral background and text ramp (11 tones from surface to contrast type)
- `accent`: Brand / tint highlight ramp

Each palette is defined by anchors specifying `hue` (0-360), `sat` (0-1), and `lum` (0-1) for both `light` and `dark` schemes:

```json
{
  "name": "Neon Sapphire",
  "schemes": { "light": true, "dark": true },
  "palettes": {
    "base": {
      "name": "base",
      "anchors": [
        {
          "index": 0,
          "hue": { "light": 220, "dark": 220 },
          "sat": { "light": 0.15, "dark": 0.2 },
          "lum": { "light": 0.98, "dark": 0.08 }
        },
        {
          "index": 10,
          "hue": { "light": 220, "dark": 220 },
          "sat": { "light": 0.25, "dark": 0.15 },
          "lum": { "light": 0.1, "dark": 0.96 }
        }
      ]
    },
    "accent": {
      "name": "accent",
      "anchors": [
        {
          "index": 0,
          "hue": { "light": 210, "dark": 210 },
          "sat": { "light": 0.9, "dark": 0.95 },
          "lum": { "light": 0.95, "dark": 0.15 }
        },
        {
          "index": 10,
          "hue": { "light": 210, "dark": 210 },
          "sat": { "light": 0.95, "dark": 0.9 },
          "lum": { "light": 0.35, "dark": 0.85 }
        }
      ]
    }
  }
}
```

## 2. Live Preview via URL

To preview your generated theme in the browser:
1. Serialize the theme configuration JSON.
2. Base64-encode the string.
3. Open or link to:
   `https://tamagui.dev/theme#theme=<base64-encoded-json>`

The Tamagui Theme Builder decodes `#theme=` client-side, dynamically builds the CSS stylesheets, and renders all UI components (cards, charts, inputs, buttons, calendar) in the custom theme.

## 3. CLI Preview Command

If using the Tamagui CLI in your terminal:
```bash
# Save to theme.json and preview
npx tamagui preview-theme ./theme.json

# Or preview inline JSON
npx tamagui preview-theme --theme '{"name":"Sunset",...}'

# Print URL without launching browser
npx tamagui preview-theme ./theme.json --print
```

## 4. Exporting to Tamagui Config

Add the generated theme to your `tamagui.config.ts`:
```ts
import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v6'
import { themes } from './themes'

export const config = createTamagui({
  ...defaultConfig,
  themes,
})
```
