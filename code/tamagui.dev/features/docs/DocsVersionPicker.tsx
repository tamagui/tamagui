import { Check, ChevronDown } from '@tamagui/lucide-icons-2'
import { type Href, router, usePathname } from 'one'
import { useEffect, useState } from 'react'
import { Paragraph, Select, XStack, YStack } from 'tamagui'
import { Link } from '~/components/Link'
import { RovingTabs } from '~/components/RovingTabs'
import { codeSyntaxChangeEvent } from './MDXTabs'
import {
  docsProductVersions,
  docsSyntaxes,
  docsSyntaxDescriptions,
  docsSyntaxLabels,
  getDocsSyntax,
  getDocsSyntaxPath,
  getDocsVersionHref,
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

// the 3-mode syntax switch. renders inline (no portal) from the pathname alone,
// so the server and the hydrated client output the same tabs.
export function DocsSyntaxPicker() {
  const pathname = usePathname()
  const query = useDocsQuery()
  const syntax = getDocsSyntax(pathname)

  const getSyntaxHref = (nextSyntax: DocsSyntax) => {
    const nextPath = getDocsSyntaxPath(pathname, nextSyntax)
    return query ? `${nextPath}?${query}` : nextPath
  }

  const setSyntax = (nextSyntax: string) => {
    router.push(getSyntaxHref(nextSyntax as DocsSyntax) as Href)
  }

  return (
    <RovingTabs
      ariaLabel="Docs syntax"
      testID="docs-syntax"
      items={docsSyntaxes.map((value) => ({
        value,
        label: docsSyntaxLabels[value],
        title: docsSyntaxDescriptions[value],
        href: getSyntaxHref(value),
      }))}
      value={syntax}
      onValueChange={setSyntax}
      textSize="1"
      panelId="docs-syntax-panel"
    />
  )
}

// product-version links. real <a> elements (modified-clicks work, no JS
// needed). the loader-provided search keeps the first render (server +
// hydrating client) correct; the live query syncs after that.
export function DocsVersionLinks({
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

  const isDocsPath =
    state.canonicalPath.startsWith('/docs/') || state.canonicalPath.startsWith('/ui/')

  if (!isDocsPath) return null

  return (
    <YStack gap="2" width="100%">
      <XStack gap="3" items="center">
        {docsProductVersions.map((version) => (
          <Link
            asChild
            key={version}
            href={getDocsVersionHref({ state, productVersion: version }) as Href}
          >
            <Paragraph
              render="a"
              size="2"
              color={version === state.productVersion ? 'color-10' : 'color-7'}
              cursor="pointer"
              textDecorationLine="none"
              aria-current={version === state.productVersion ? 'page' : undefined}
            >
              {version}
            </Paragraph>
          </Link>
        ))}
      </XStack>

      {!state.isComponentDoc && !state.hasArchivedContent && (
        <Paragraph data-testid="docs-version-fallback" size="1" color="color-9">
          The latest available page is shown because archived {state.productVersion} prose
          was not preserved for this route.
        </Paragraph>
      )}
    </YStack>
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
        paddingHorizontal="2"
        gap="1"
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
          padding="1"
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
