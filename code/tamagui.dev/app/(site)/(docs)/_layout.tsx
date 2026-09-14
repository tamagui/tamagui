import { Slot } from 'one'
import type { CSSProperties } from 'react'
import { useTheme } from 'tamagui'
import { useBentoStore } from '~/features/bento/BentoStore'
import { DocsSyntaxLayout } from '~/features/docs/DocsSyntaxLayout'

export default function DocsLayout() {
  const theme = useTheme()
  const { disableCustomTheme, themeSuiteUID } = useBentoStore()
  const customThemeActive = !!themeSuiteUID && !disableCustomTheme

  return (
    <div
      className={customThemeActive ? 'docs-theme-accents' : undefined}
      style={
        {
          display: 'contents',
          '--docs-accent-background': theme['accent-background'].val,
          '--docs-accent-color': theme['accent-color'].val,
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
