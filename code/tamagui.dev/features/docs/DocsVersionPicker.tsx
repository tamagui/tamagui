import { Check, ChevronDown } from '@tamagui/lucide-icons-2'
import { type Href, router, usePathname, useSearchParams } from 'one'
import React from 'react'
import { createPortal } from 'react-dom'
import { Paragraph, Select, XStack, YStack } from 'tamagui'
import {
  docsProductVersions,
  docsSyntaxes,
  docsSyntaxLabels,
  getDocsVersionHref,
  getDocsVersionState,
  type DocsProductVersion,
  type DocsSyntax,
  type DocsVersionFrontmatter,
} from './docsVersion'

export function DocsVersionPicker({
  frontmatter,
  initialSearch,
}: {
  frontmatter?: DocsVersionFrontmatter
  initialSearch?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hydrated, setHydrated] = React.useState(false)
  const [searchString, setSearchString] = React.useState(initialSearch ?? '')
  const [pendingSearch, setPendingSearch] = React.useState<string | null>(null)

  React.useEffect(() => {
    setHydrated(true)
    setSearchString(window.location.search.slice(1))
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    const currentSearch = window.location.search.slice(1)
    if (pendingSearch === null) {
      setSearchString(currentSearch)
    } else if (pendingSearch === currentSearch) {
      setPendingSearch(null)
    }
  }, [hydrated, pathname, pendingSearch, searchParams])

  const state = getDocsVersionState({
    pathname,
    search: new URLSearchParams(searchString),
    frontmatter,
  })

  const isDocsPath =
    state.canonicalPath.startsWith('/docs/') || state.canonicalPath.startsWith('/ui/')

  if (!isDocsPath) return null

  const navigate = (href: string) => {
    const nextSearch = new URL(href, window.location.origin).search.slice(1)
    setPendingSearch(nextSearch)
    setSearchString(nextSearch)
    router.push(href as Href)
  }

  const setVersion = (productVersion: string) => {
    navigate(
      getDocsVersionHref({
        state,
        productVersion: productVersion as DocsProductVersion,
      })
    )
  }

  const setSyntax = (syntax: string) => {
    navigate(getDocsVersionHref({ state, syntax: syntax as DocsSyntax }))
  }

  return (
    <YStack gap="2" width="100%">
      <XStack gap="1" items="center" width="100%">
        <PickerSelect
          label="Version"
          testID="docs-version"
          value={state.productVersion}
          items={docsProductVersions.map((version) => ({
            value: version,
            label: version,
          }))}
          onValueChange={setVersion}
        />

        <PickerSelect
          label="Syntax"
          testID="docs-syntax"
          value={state.syntax}
          items={docsSyntaxes.map((syntax) => ({
            value: syntax,
            label: docsSyntaxLabels[syntax],
          }))}
          onValueChange={setSyntax}
        />
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

export function DocsVersionPickerPortal(
  props: React.ComponentProps<typeof DocsVersionPicker>
) {
  const [target, setTarget] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    setTarget(document.getElementById('docs-version-picker-slot'))
  }, [])

  return target ? createPortal(<DocsVersionPicker {...props} />, target) : null
}

export function PickerSelect({
  label,
  value,
  items,
  onValueChange,
  testID,
}: {
  label: string
  value: string
  items: { value: string; label: string }[]
  onValueChange: (value: string) => void
  testID?: string
}) {
  return (
    <Select
      value={value}
      renderValue={(selectedValue) =>
        `${label}: ${items.find((item) => item.value === selectedValue)?.label ?? value}`
      }
      onValueChange={onValueChange}
      disablePreventBodyScroll
      zIndex={200000}
    >
      <Select.Trigger
        testID={testID}
        flex={1}
        height={28}
        paddingHorizontal="1"
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
