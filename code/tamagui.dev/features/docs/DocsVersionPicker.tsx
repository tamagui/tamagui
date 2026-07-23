import { Check, ChevronDown } from '@tamagui/lucide-icons-2'
import { type Href, router, usePathname, useSearchParams } from 'one'
import React from 'react'
import { createPortal } from 'react-dom'
import { Select, XStack } from 'tamagui'
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
import { cookieCodeMode, writeSyntaxCookie } from './syntaxCookie'

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

  const cookieMode =
    hydrated && typeof document !== 'undefined'
      ? cookieCodeMode(document.cookie)
      : 'styled'

  const state = React.useMemo(() => {
    const next = getDocsVersionState({
      pathname,
      search: new URLSearchParams(searchString),
      frontmatter,
    })
    // sticky cookie applies when the url doesn't say otherwise
    if (cookieMode !== 'styled' && !new URLSearchParams(searchString).get('syntax')) {
      next.syntax = cookieMode
    }
    return next
  }, [frontmatter, pathname, searchString, cookieMode])

  // a non-styled mode (unstyled/tailwind) needs a sticky ?syntax= on the url so
  // the loader re-runs its transform and each mode gets a distinct cache key.
  // styled is the default and stays param-free.
  React.useEffect(() => {
    if (!hydrated || state.syntax === 'styled') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('syntax')) return
    params.set('syntax', state.syntax)
    window.location.replace(
      `${window.location.pathname}?${params.toString()}${window.location.hash}`
    )
  }, [hydrated, pathname, state.syntax])

  React.useEffect(() => {
    if (state.syntax === 'styled') return
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return
      }
      const anchor = (event.target as HTMLElement).closest?.('a')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return
      }
      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/')) return
      const url = new URL(href, window.location.origin)
      if (url.searchParams.get('syntax')) return
      url.searchParams.set('syntax', state.syntax)
      event.preventDefault()
      event.stopPropagation()
      router.push(`${url.pathname}${url.search}${url.hash}` as Href)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [state.syntax])

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
    writeSyntaxCookie(syntax as DocsSyntax)
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

  return (
    <XStack gap="$2" items="center">
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
        testID="docs-syntax"
        value={state.syntax}
        items={docsSyntaxes.map((syntax) => ({
          value: syntax,
          label: docsSyntaxLabels[syntax],
        }))}
        onValueChange={setSyntax}
      />
    </XStack>
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

function PickerSelect({
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
      onValueChange={onValueChange}
      disablePreventBodyScroll
      zIndex={200000}
    >
      <Select.Trigger
        testID={testID}
        height={28}
        paddingHorizontal="$2"
        gap="$1"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$4"
        minW={label === 'Version' ? 72 : 100}
      >
        <Select.Value placeholder={label} fontSize="$1" />
        <Select.Icon marginLeft="auto">
          <ChevronDown size={12} color="$color9" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Content>
        <Select.Viewport
          minW={140}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$3"
          bg="$background"
          padding="$1"
          boxShadow="0 12px 28px rgba(0, 0, 0, 0.18)"
        >
          <Select.Group>
            <Select.Label fontSize="$2" color="$color9">
              {label}
            </Select.Label>
            {items.map((item, index) => (
              <Select.Item
                index={index}
                key={item.value}
                value={item.value}
                testID={testID ? `${testID}-${item.value}` : undefined}
              >
                <Select.ItemText fontSize="$2">{item.label}</Select.ItemText>
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
