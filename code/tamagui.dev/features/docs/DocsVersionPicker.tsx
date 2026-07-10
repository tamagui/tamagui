import { Check, ChevronDown } from '@tamagui/lucide-icons-2'
import { type Href, router, usePathname, useSearchParams } from 'one'
import React from 'react'
import { Select, XStack, YStack, Paragraph } from 'tamagui'
import {
  docsProductVersions,
  docsSyntaxes,
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
  const searchString = hydrated ? searchParams.toString() : (initialSearch ?? '')

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  const state = React.useMemo(() => {
    return getDocsVersionState({
      pathname,
      search: new URLSearchParams(searchString),
      frontmatter,
    })
  }, [frontmatter, pathname, searchString])

  const isDocsPath =
    state.canonicalPath.startsWith('/docs/') || state.canonicalPath.startsWith('/ui/')

  if (!isDocsPath) return null

  const setVersion = (productVersion: string) => {
    router.push(
      getDocsVersionHref({
        state,
        productVersion: productVersion as DocsProductVersion,
      }) as Href
    )
  }

  const setSyntax = (syntax: string) => {
    const href = getDocsVersionHref({
      state,
      syntax: syntax as DocsSyntax,
    })

    if (typeof window !== 'undefined') {
      window.location.href = href
      return
    }

    router.push(href as Href)
  }

  const showArchiveNote = !state.isComponentDoc && !state.hasArchivedContent

  return (
    <YStack gap="$2" mb="$5">
      <XStack gap="$2" flexWrap="wrap" items="center">
        <PickerSelect
          label="Version"
          value={state.productVersion}
          items={docsProductVersions.map((version) => ({
            value: version,
            label: version,
          }))}
          onValueChange={setVersion}
        />

        <PickerSelect
          label="Syntax"
          value={state.syntax}
          items={docsSyntaxes.map((syntax) => ({
            value: syntax,
            label: syntax === 'tailwind' ? 'Tailwind' : 'Tamagui',
          }))}
          onValueChange={setSyntax}
        />
      </XStack>

      {showArchiveNote && (
        <Paragraph size="$2" color="$color9" maxW={680}>
          Archived {state.productVersion} prose for this page was not preserved as a
          versioned file, so the latest available page is shown.
        </Paragraph>
      )}
    </YStack>
  )
}

function PickerSelect({
  label,
  value,
  items,
  onValueChange,
}: {
  label: string
  value: string
  items: { value: string; label: string }[]
  onValueChange: (value: string) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disablePreventBodyScroll
      zIndex={200000}
    >
      <Select.Trigger size="$2" iconAfter={ChevronDown} borderRadius="$3" minW={116}>
        <Select.Value placeholder={label} />
      </Select.Trigger>

      <Select.Content>
        <Select.Viewport
          minW={160}
          borderWidth={1}
          borderColor="$borderColor"
          elevation="$3"
          borderRadius="$3"
          bg="$background"
        >
          <Select.Group>
            <Select.Label>{label}</Select.Label>
            {items.map((item, index) => (
              <Select.Item index={index} key={item.value} value={item.value}>
                <Select.ItemText>{item.label}</Select.ItemText>
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
