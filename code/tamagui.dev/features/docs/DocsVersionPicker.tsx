import { Check, ChevronDown } from '@tamagui/lucide-icons-2'
import { type Href, router, usePathname, useSearchParams } from 'one'
import { Paragraph, Select, XStack, YStack } from 'tamagui'
import { Link } from '~/components/Link'
import { RovingTabs } from '~/components/RovingTabs'
import {
  docsProductVersions,
  docsSyntaxes,
  docsSyntaxLabels,
  getDocsSyntax,
  getDocsSyntaxPath,
  getDocsVersionHref,
  getDocsVersionState,
  type DocsSyntax,
  type DocsVersionFrontmatter,
} from './docsVersion'

export function DocsSyntaxPicker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const syntax = getDocsSyntax(pathname)

  const getSyntaxHref = (nextSyntax: DocsSyntax) => {
    const nextPath = getDocsSyntaxPath(pathname, nextSyntax)
    const nextSearch = new URLSearchParams(searchParams.toString())
    // One exposes dynamic route params through useSearchParams as well. They are
    // loader inputs, not URL query params, and must not leak into public links.
    nextSearch.delete('slug')
    nextSearch.delete('subpath')
    const query = nextSearch.toString()
    return `${nextPath}${query ? `?${query}` : ''}`
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
        href: getSyntaxHref(value),
      }))}
      value={syntax}
      onValueChange={setSyntax}
      textSize="1"
    />
  )
}

export function DocsVersionLinks({
  frontmatter,
}: {
  frontmatter?: DocsVersionFrontmatter
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const versionSearch = new URLSearchParams(searchParams.toString())
  versionSearch.delete('slug')
  versionSearch.delete('subpath')

  const state = getDocsVersionState({
    pathname,
    search: versionSearch,
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
            href={getDocsVersionHref({ state, productVersion: version })}
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
            {items.map((item, index) => (
              <Select.Item
                key={item.value}
                index={index}
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
