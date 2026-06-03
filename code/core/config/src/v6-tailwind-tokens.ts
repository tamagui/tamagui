// Tailwind value tokens for v6 (resolved by name in styleMode:'tailwind').
// numeric spacing/sizing (p-4, w-24) is handled by the parser's ×4 scale; these cover the
// NON-numeric tailwind values: the color palette and named border radii.
//
// tokens are defined with the `$` prefix (matching the rest of the config) so the tailwind
// parser's resolveTokenValue("indigo-500") → "$indigo-500" lookup hits them.

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

// Tailwind color palette (v3). starting with the set the conformance cases use; expand toward
// the full palette as cases grow (this is mechanical — the resolver already handles any name).
export const tailwindColors = {
  '$white': '#ffffff',
  '$black': '#000000',
  '$transparent': 'transparent',
  '$slate-100': '#f1f5f9',
  '$slate-500': '#64748b',
  '$slate-900': '#0f172a',
  '$red-500': '#ef4444',
  '$green-500': '#22c55e',
  '$blue-500': '#3b82f6',
  '$sky-400': '#38bdf8',
  '$indigo-500': '#6366f1',
}
