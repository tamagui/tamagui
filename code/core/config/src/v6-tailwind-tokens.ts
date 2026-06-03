// Tailwind value tokens for v6 (resolved by name in styleMode:'tailwind').
// numeric spacing/sizing (p-4, w-24) is handled by the parser's ×4 scale; these cover the
// NON-numeric tailwind values: the color palette and named border radii.
//
// tokens are defined with the `$` prefix (matching the rest of the config) so the tailwind
// parser's resolveTokenValue("indigo-500") → "$indigo-500" lookup hits them.

// full Tailwind v3 color palette, generated from tailwindcss/colors (gen-palette.ts)
export { tailwindColors } from './v6-tailwind-palette'

// Tailwind border-radius scale (rem → px at 16px root)
export const tailwindRadius = {
  '$none': 0,
  '$sm': 2,
  '$md': 6,
  '$lg': 8,
  '$xl': 12,
  '$2xl': 16,
  '$3xl': 24,
  '$full': 9999,
}
