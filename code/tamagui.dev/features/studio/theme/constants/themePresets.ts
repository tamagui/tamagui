import type { ThemeSuiteItemData } from '../types'

export const AGENT_THEME_SKILL_TEXT = `---
name: tamagui-theme-generator
description: Generate custom Tamagui themes, color palettes, and preview URLs. Use when creating or refining a color scheme, authoring light/dark palettes with brand accents, or previewing generated themes in the browser.
metadata:
  version: 3.0.0
---

# Tamagui Theme Generator Skill

Tamagui themes generate from palettes with light and dark scales. To generate a custom theme for Tamagui:

1. Create a theme configuration with "base" and "accent" palettes:
\`\`\`json
{
  "name": "Emerald Cyber",
  "schemes": { "light": true, "dark": true },
  "palettes": {
    "base": {
      "name": "base",
      "anchors": [
        {
          "index": 0,
          "hue": { "sync": true, "light": 160, "dark": 160 },
          "sat": { "sync": true, "light": 0.08, "dark": 0.12 },
          "lum": { "light": 0.99, "dark": 0.02 },
          "alpha": { "light": 1, "dark": 1 }
        },
        {
          "index": 8,
          "hue": { "syncLeft": true, "sync": true, "light": 160, "dark": 160 },
          "sat": { "syncLeft": true, "sync": true, "light": 0.08, "dark": 0.12 },
          "lum": { "light": 0.5, "dark": 0.5 },
          "alpha": { "light": 1, "dark": 1 }
        },
        {
          "index": 9,
          "hue": { "sync": true, "light": 160, "dark": 160 },
          "sat": { "sync": true, "light": 0.08, "dark": 0.12 },
          "lum": { "light": 0.15, "dark": 0.925 },
          "alpha": { "light": 1, "dark": 1 }
        },
        {
          "index": 10,
          "hue": { "syncLeft": true, "sync": true, "light": 160, "dark": 160 },
          "sat": { "syncLeft": true, "sync": true, "light": 0.08, "dark": 0.12 },
          "lum": { "light": 0.01, "dark": 0.99 },
          "alpha": { "light": 1, "dark": 1 }
        }
      ]
    },
    "accent": {
      "name": "accent",
      "anchors": [
        {
          "index": 0,
          "hue": { "sync": true, "light": 155, "dark": 155 },
          "sat": { "sync": true, "light": 0.9, "dark": 0.95 },
          "lum": { "light": 0.4, "dark": 0.35 },
          "alpha": { "light": 1, "dark": 1 }
        },
        {
          "index": 8,
          "hue": { "syncLeft": true, "sync": true, "light": 155, "dark": 155 },
          "sat": { "syncLeft": true, "sync": true, "light": 0.9, "dark": 0.95 },
          "lum": { "light": 0.65, "dark": 0.6 },
          "alpha": { "light": 1, "dark": 1 }
        },
        {
          "index": 9,
          "hue": { "sync": true, "light": 155, "dark": 155 },
          "sat": { "sync": true, "light": 0.9, "dark": 0.95 },
          "lum": { "light": 0.95, "dark": 0.9 },
          "alpha": { "light": 1, "dark": 1 }
        },
        {
          "index": 10,
          "hue": { "syncLeft": true, "sync": true, "light": 155, "dark": 155 },
          "sat": { "syncLeft": true, "sync": true, "light": 0.9, "dark": 0.95 },
          "lum": { "light": 0.95, "dark": 0.95 },
          "alpha": { "light": 1, "dark": 1 }
        }
      ]
    }
  }
}
\`\`\`

2. Generate a preview URL for the user to view in the browser:
Serialize the JSON, base64-encode it, and construct:
https://tamagui.dev/theme#theme=<base64-json>

3. Or run the Tamagui CLI to open the browser automatically:
npx tamagui preview-theme ./theme.json
`

function makePreset(
  name: string,
  baseHue: number,
  baseSat: number,
  accentHue: number,
  accentSat: number,
  colorDot: string
): ThemeSuiteItemData & { label: string; dot: string } {
  return {
    label: name,
    dot: colorDot,
    name,
    schemes: { light: true, dark: true },
    palettes: {
      base: {
        name: 'base',
        anchors: [
          {
            index: 0,
            hue: { sync: true, light: baseHue, dark: baseHue },
            sat: { sync: true, light: baseSat, dark: baseSat },
            lum: { light: 0.99, dark: 0.02 },
            alpha: { light: 1, dark: 1 },
          },
          {
            index: 8,
            hue: { syncLeft: true, sync: true, light: baseHue, dark: baseHue },
            sat: { syncLeft: true, sync: true, light: baseSat, dark: baseSat },
            lum: { light: 0.5, dark: 0.5 },
            alpha: { light: 1, dark: 1 },
          },
          {
            index: 9,
            hue: { sync: true, light: baseHue, dark: baseHue },
            sat: { sync: true, light: baseSat, dark: baseSat },
            lum: { light: 0.15, dark: 0.925 },
            alpha: { light: 1, dark: 1 },
          },
          {
            index: 10,
            hue: { syncLeft: true, sync: true, light: baseHue, dark: baseHue },
            sat: { syncLeft: true, sync: true, light: baseSat, dark: baseSat },
            lum: { light: 0.01, dark: 0.99 },
            alpha: { light: 1, dark: 1 },
          },
        ],
      },
      accent: {
        name: 'accent',
        anchors: [
          {
            index: 0,
            hue: { sync: true, light: accentHue, dark: accentHue },
            sat: { sync: true, light: accentSat, dark: accentSat },
            lum: { light: 0.4, dark: 0.35 },
            alpha: { light: 1, dark: 1 },
          },
          {
            index: 8,
            hue: { syncLeft: true, sync: true, light: accentHue, dark: accentHue },
            sat: { syncLeft: true, sync: true, light: accentSat, dark: accentSat },
            lum: { light: 0.65, dark: 0.6 },
            alpha: { light: 1, dark: 1 },
          },
          {
            index: 9,
            hue: { sync: true, light: accentHue, dark: accentHue },
            sat: { sync: true, light: accentSat, dark: accentSat },
            lum: { light: 0.95, dark: 0.9 },
            alpha: { light: 1, dark: 1 },
          },
          {
            index: 10,
            hue: { syncLeft: true, sync: true, light: accentHue, dark: accentHue },
            sat: { syncLeft: true, sync: true, light: accentSat, dark: accentSat },
            lum: { light: 0.95, dark: 0.95 },
            alpha: { light: 1, dark: 1 },
          },
        ],
      },
    },
  }
}

export const THEME_PRESETS = [
  makePreset('Violet', 0, 0.15, 250, 0.55, '#8b5cf6'),
  makePreset('Emerald', 160, 0.1, 155, 0.88, '#10b981'),
  makePreset('Sapphire', 220, 0.14, 212, 0.92, '#3b82f6'),
  makePreset('Sunset', 25, 0.15, 14, 0.95, '#f97316'),
  makePreset('Amethyst', 280, 0.12, 285, 0.88, '#a855f7'),
  makePreset('Rose', 340, 0.12, 345, 0.88, '#f43f5e'),
  makePreset('Monochrome', 0, 0.0, 0, 0.0, '#71717a'),
]
