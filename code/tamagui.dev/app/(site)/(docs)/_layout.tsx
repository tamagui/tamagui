import { Slot } from 'one'
import type { CSSProperties } from 'react'
import { useBentoStore } from '~/features/bento/BentoStore'
import { DocsSyntaxLayout } from '~/features/docs/DocsSyntaxLayout'

export default function DocsLayout() {
  const { disableCustomTheme, themeSuiteUID } = useBentoStore()
  const customThemeActive = !!themeSuiteUID && !disableCustomTheme

  return (
    <div
      className={customThemeActive ? 'docs-theme-accents' : undefined}
      style={
        {
          display: 'contents',
          // Keep these as CSS variable references. Reading `.val` from useTheme()
          // produced undefined values during SSR and var(...) after hydration.
          '--docs-accent-background': 'var(--accent-background)',
          '--docs-accent-color': 'var(--accent-color)',
        } as CSSProperties
      }
    >
      <style>{`
        :root:root .docs-theme-accents article .t_Link {
          color: var(--docs-accent-color);
          text-decoration-color: var(--docs-accent-background);
        }

        .docs-theme-accents .sidebar-indicator,
        .docs-theme-accents article .tm-button {
          background-color: var(--docs-accent-background);
        }

        .docs-theme-accents :is(a, button):focus-visible {
          outline-color: var(--docs-accent-background) !important;
        }

        .docs-theme-accents .docs-quicknav-active {
          stroke: var(--docs-accent-background);
        }

        .docs-theme-accents article pre {
          border: 1px solid var(--docs-accent-background);
        }
      `}</style>
      <DocsSyntaxLayout>
        <Slot />
      </DocsSyntaxLayout>
    </div>
  )
}
