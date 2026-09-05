# Tailwind v4 precedence probe

**READ** Package versions: `tailwindcss@4.3.3`, `@tailwindcss/cli@4.3.3`, `tailwind-merge@3.6.0`, `playwright@1.62.1`. Runtime: Node `v25.9.0`, Playwright Chromium `151.0.7922.34`.

**READ** Build commands: `npx @tailwindcss/cli -i input-default.css -o output-default.css` and `npx @tailwindcss/cli -i input-class.css -o output-class.css`. The class strategy uses `@custom-variant dark (&:where(.dark, .dark *));`.

**READ** Runtime method: each class list was tested in both attribute orders. Playwright set the viewport, color scheme, `.dark` ancestor, hover, focus, and mouse-down state as listed, then read `getComputedStyle(el).backgroundColor`. The runtime stylesheet overrides only the three generated palette variables to red `rgb(255, 0, 0)`, blue `rgb(0, 0, 255)`, and green `rgb(0, 128, 0)` so the winning Tailwind declaration serializes as the requested unambiguous RGB value. The generated utility rules and their ordering are unchanged.

**READ** Specificity notation is `(IDs, classes/attributes/pseudo-classes, types/pseudo-elements)`. Media conditions do not change specificity. Arguments inside `:where(...)` contribute zero specificity.

| Status | Case | Classes, both attribute orders | Active conditions | Computed winner | Emitted selectors in file order, with specificity | Why |
|---|---:|---|---|---|---|---|
| **READ** | 1 | `bg-red-500 hover:bg-blue-500`<br>`hover:bg-blue-500 bg-red-500` | hovered, viewport 900px | blue, `"rgb(0, 0, 255)"` in both orders | default lines 172, 176; CSSOM order 38: `.bg-red-500` `(0,1,0)`; order 39: `.hover\:bg-blue-500:hover` `(0,2,0)`, in `@media (hover: hover)` | Hover has higher specificity. |
| **READ** | 2 | `hover:bg-blue-500 focus:bg-green-500`<br>`focus:bg-green-500 hover:bg-blue-500` | hovered and focused, viewport 900px | green, `"rgb(0, 128, 0)"` in both orders | default lines 176, 180; CSSOM order 39: `.hover\:bg-blue-500:hover` `(0,2,0)`, in `@media (hover: hover)`; order 40: `.focus\:bg-green-500:focus` `(0,2,0)` | Specificity ties, so the later focus rule wins. |
| **READ** | 3 | `hover:bg-blue-500 active:bg-green-500`<br>`active:bg-green-500 hover:bg-blue-500` | hovered and active during mouse-down, viewport 900px | green, `"rgb(0, 128, 0)"` in both orders | default lines 176, 183; CSSOM order 39: `.hover\:bg-blue-500:hover` `(0,2,0)`, in `@media (hover: hover)`; order 41: `.active\:bg-green-500:active` `(0,2,0)` | Specificity ties, so the later active rule wins. |
| **READ** | 4, default dark | `sm:bg-blue-500 dark:bg-green-500`<br>`dark:bg-green-500 sm:bg-blue-500` | 800px, `prefers-color-scheme: dark` | green, `"rgb(0, 128, 0)"` in both orders | default lines 193, 220; CSSOM order 44: `.sm\:bg-blue-500` `(0,1,0)`, in `(width >= 40rem)`; order 49: `.dark\:bg-green-500` `(0,1,0)`, in `(prefers-color-scheme: dark)` | Specificity ties, so dark wins because Tailwind emits it later than sm. |
| **READ** | 4, class dark | `sm:bg-blue-500 dark:bg-green-500`<br>`dark:bg-green-500 sm:bg-blue-500` | 800px, `.dark` on `html` | green, `"rgb(0, 128, 0)"` in both orders | class lines 193, 219; CSSOM order 44: `.sm\:bg-blue-500` `(0,1,0)`, in `(width >= 40rem)`; order 49: `.dark\:bg-green-500:where(.dark, .dark *)` `(0,1,0)` | `:where` adds zero specificity. The tie goes to the later dark rule. |
| **READ** | 5 | `sm:hover:bg-blue-500 md:bg-green-500`<br>`md:bg-green-500 sm:hover:bg-blue-500` | 900px, hovered | blue, `"rgb(0, 0, 255)"` in both orders | default lines 206, 215; CSSOM order 46: `.sm\:hover\:bg-blue-500:hover` `(0,2,0)`, in `(width >= 40rem)` then `(hover: hover)`; order 48: `.md\:bg-green-500` `(0,1,0)`, in `(width >= 48rem)` | sm:hover wins on higher specificity even though md is later. |
| **READ** | 6, default dark | `sm:dark:bg-blue-500 md:bg-green-500`<br>`md:bg-green-500 sm:dark:bg-blue-500` | 900px, `prefers-color-scheme: dark` | blue, `"rgb(0, 0, 255)"` in both orders | default lines 215, 231; CSSOM order 48: `.md\:bg-green-500` `(0,1,0)`, in `(width >= 48rem)`; order 51: `.sm\:dark\:bg-blue-500` `(0,1,0)`, in `(width >= 40rem)` then `(prefers-color-scheme: dark)` | Specificity ties, so sm:dark wins because Tailwind emits it after md. |
| **READ** | 6, class dark | `sm:dark:bg-blue-500 md:bg-green-500`<br>`md:bg-green-500 sm:dark:bg-blue-500` | 900px, `.dark` on `html` | blue, `"rgb(0, 0, 255)"` in both orders | class lines 215, 226; CSSOM order 48: `.md\:bg-green-500` `(0,1,0)`, in `(width >= 48rem)`; order 51: `.sm\:dark\:bg-blue-500:where(.dark, .dark *)` `(0,1,0)`, in `(width >= 40rem)` | `:where` adds zero specificity. The tie goes to the later sm:dark rule. |
| **READ** | 7 | `sm:bg-blue-500 md:bg-green-500`<br>`md:bg-green-500 sm:bg-blue-500` | 900px | green, `"rgb(0, 128, 0)"` in both orders | default lines 193, 215; CSSOM order 44: `.sm\:bg-blue-500` `(0,1,0)`, in `(width >= 40rem)`; order 48: `.md\:bg-green-500` `(0,1,0)`, in `(width >= 48rem)` | Specificity ties, so the later md rule wins. |
| **READ** | 8, default dark | `dark:sm:bg-blue-500` and `sm:dark:bg-blue-500`, each tested independently | 800px, `prefers-color-scheme: dark` | blue, `"rgb(0, 0, 255)"` for both | default lines 224, 231; CSSOM order 50: `.dark\:sm\:bg-blue-500` `(0,1,0)`, in dark then sm media; order 51: `.sm\:dark\:bg-blue-500` `(0,1,0)`, in sm then dark media | The selectors and media nesting order differ, but the active condition intersection and behavior are the same. |
| **READ** | 8, class dark | `dark:sm:bg-blue-500` and `sm:dark:bg-blue-500`, each tested independently | 800px, `.dark` on `html` | blue, `"rgb(0, 0, 255)"` for both | class lines 223, 226; CSSOM order 50: `.dark\:sm\:bg-blue-500:where(.dark, .dark *)` `(0,1,0)`; order 51: `.sm\:dark\:bg-blue-500:where(.dark, .dark *)` `(0,1,0)`; both in `(width >= 40rem)` | The escaped class selectors differ. Their conditions and specificity are equivalent, so behavior is the same when tested separately. |

## Emission summary

| Status | Strategy | Exact relevant order |
|---|---|---|
| **READ** | default dark | order 38 `.bg-red-500`; 39 `.hover\:bg-blue-500:hover`; 40 `.focus\:bg-green-500:focus`; 41 `.active\:bg-green-500:active`; 44 `.sm\:bg-blue-500`; 46 `.sm\:hover\:bg-blue-500:hover`; 48 `.md\:bg-green-500`; 49 `.dark\:bg-green-500`; 50 `.dark\:sm\:bg-blue-500`; 51 `.sm\:dark\:bg-blue-500` |
| **READ** | class dark | Orders are identical. Dark selectors at 49 to 51 append `:where(.dark, .dark *)`; dark has no `prefers-color-scheme` wrapper. |

## tailwind-merge 3.6.0

| Status | Call | Exact output | Reading |
|---|---|---|---|
| **READ** | `twMerge('flex-row', 'sm:flex-col')` | `"flex-row sm:flex-col"` | Base and sm variants remain separate conflict groups. |
| **READ** | `twMerge('sm:flex-col', 'sm:flex-row')` | `"sm:flex-row"` | Same variant and property conflict, so the later argument wins. |
| **READ** | `twMerge('bg-red-500 sm:bg-blue-500', 'bg-green-500')` | `"sm:bg-blue-500 bg-green-500"` | The later base background replaces only the earlier base background. |
| **READ** | `twMerge('sm:hover:bg-red-500', 'hover:sm:bg-blue-500')` | `"hover:sm:bg-blue-500"` | Differently ordered `sm` and `hover` stacks are normalized to the same conflict key, so the later one replaces the earlier one. |

## Repeat evidence and artifacts

**READ** The entire Playwright matrix was run twice after the RGB token override. `first-run.json` and `runtime-results.json` are byte-identical with SHA-256 `f2dbd1692088c054610e8e91cad5017237e4ad4485753ef73e5f52ad5513041e`.

**READ** Raw generated stylesheets: `output-default.css` and `output-class.css`. Raw CSSOM extraction: `css-rules.json`. Raw runtime matrix: `runtime-results.json`. Exact tailwind-merge stdout: `twmerge-output.txt`. Reproduction scripts: `probe.mjs` and `twmerge.mjs`.

**READ** Measured rule: HTML class attribute order did not affect any result. Among simultaneously active declarations, normal CSS cascade decides: higher selector specificity wins first, then Tailwind's generated stylesheet order breaks a specificity tie. Tailwind's variant sort determines that stylesheet order, including cases where a narrower breakpoint does not predict the winner.
