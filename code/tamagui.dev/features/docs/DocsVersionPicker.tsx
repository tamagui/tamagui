import { Check, ChevronDown } from '~/components/icons'
import { type Href, router, usePathname } from 'one'
import { useEffect, useState } from 'react'
import { Paragraph, Select } from 'tamagui'
import { RovingTabs } from '~/components/RovingTabs'
import { codeSyntaxChangeEvent } from './MDXTabs'
import {
  docsStyledLabelBesideCopyPaste,
  docsSyntaxDescriptions,
  docsSyntaxLabels,
  getCanonicalDocsPath,
  getDocsSyntaxPath,
  getDocsVersionState,
  type DocsSyntax,
  type DocsVersionFrontmatter,
} from './docsVersion'

// The live URL query (?version=, ?syntax=typed). One's useSearchParams only
// carries route params, never the query string, and reading window.location in
// render would split SSR from hydration — so the first render (server +
// hydrating client) uses the initial value and an effect syncs the live query
// after that. Runs after every render so query-only navigations (version links
// change only ?version=) are picked up; setting identical state bails out.
function useDocsQuery(initialSearch = '') {
  const [query, setQuery] = useState(initialSearch)
  useEffect(() => {
    const sync = () => setQuery(window.location.search.slice(1))
    sync()
    window.addEventListener('popstate', sync)
    // the String/Typed code tabs rewrite ?syntax= without navigating
    window.addEventListener(codeSyntaxChangeEvent, sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(codeSyntaxChangeEvent, sync)
    }
  })
  return query
}

// the syntax switch. renders inline (no portal) from the pathname and loader
// data, so the server and the hydrated client output the same tabs.
export function DocsSyntaxPicker({
  syntax,
  syntaxes,
}: {
  syntax: DocsSyntax
  syntaxes: DocsSyntax[]
}) {
  const pathname = usePathname()
  const query = useDocsQuery()
  const hasCopyPaste = syntaxes.includes('unstyled')
  // a component without a skin to copy shows its styled examples at /ui/<name>
  const styledAtCanonical =
    !hasCopyPaste && getCanonicalDocsPath(pathname).startsWith('/ui/')

  const getSyntaxHref = (nextSyntax: DocsSyntax) => {
    const nextPath = getDocsSyntaxPath(
      pathname,
      nextSyntax === 'styled' && styledAtCanonical ? 'unstyled' : nextSyntax
    )
    return query ? `${nextPath}?${query}` : nextPath
  }

  const setSyntax = (nextSyntax: string) => {
    router.push(getSyntaxHref(nextSyntax as DocsSyntax) as Href)
  }

  return (
    <RovingTabs
      ariaLabel="Docs syntax"
      testID="docs-syntax"
      items={syntaxes.map((value) => ({
        value,
        label:
          value === 'styled' && hasCopyPaste
            ? docsStyledLabelBesideCopyPaste
            : docsSyntaxLabels[value],
        title: docsSyntaxDescriptions[value],
        href: getSyntaxHref(value),
      }))}
      value={syntax}
      onValueChange={setSyntax}
      panelId="docs-syntax-panel"
    />
  )
}

// the header picker switches product versions. a non-v3 docs page whose
// archived prose was not kept falls back to the latest page and says so here.
// the loader-provided search keeps the first render (server + hydrating
// client) correct; the live query syncs after that.
export function DocsVersionFallback({
  frontmatter,
  initialSearch,
}: {
  frontmatter?: DocsVersionFrontmatter
  initialSearch?: string
}) {
  const pathname = usePathname()
  const query = useDocsQuery(initialSearch)

  const state = getDocsVersionState({
    pathname,
    search: new URLSearchParams(query),
    frontmatter,
  })

  if (state.isComponentDoc || state.hasArchivedContent) return null

  return (
    <Paragraph data-testid="docs-version-fallback" size="2" color="color-9" mb="4">
      The latest available page is shown because archived {state.productVersion} prose was
      not preserved for this route.
    </Paragraph>
  )
}

export function PickerSelect({
  label,
  value,
  items,
  onValueChange,
  testID,
  showLabel,
}: {
  label: string
  value: string
  items: { value: string; label: string }[]
  onValueChange: (value: string) => void
  testID?: string
  showLabel?: boolean
}) {
  return (
    <Select
      value={value}
      renderValue={(selectedValue) =>
        `${showLabel ? `${label}: ` : ``}${items.find((item) => item.value === selectedValue)?.label ?? value}`
      }
      onValueChange={onValueChange}
      disablePreventBodyScroll
      zIndex={200000}
    >
      <Select.Trigger
        testID={testID}
        aria-label={label}
        flex={1}
        height={28}
        paddingHorizontal="1-5"
        gap="0-5"
        backgroundColor="color-1"
        borderWidth={1}
        borderColor="border-color"
        borderRadius="4"
        minW={label === 'Version' ? 80 : label === 'Syntax' ? 108 : 120}
      >
        <Select.Value placeholder={label} fontSize="1" />
        <Select.Icon marginLeft="auto">
          <ChevronDown size={12} color="color-9" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Content>
        <Select.Viewport
          minW={140}
          borderWidth={1}
          borderColor="border-color"
          borderRadius="3"
          bg="background"
          padding="0-5"
          boxShadow="0 12px 28px rgba(0, 0, 0, 0.18)"
        >
          <Select.Group>
            <Select.Label fontSize="2" color="color-9">
              {label}
            </Select.Label>
            {items.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                testID={testID ? `${testID}-${item.value}` : undefined}
              >
                <Select.ItemText fontSize="2">{item.label}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  )
}
