import { ChevronDown } from '@tamagui/local-icons'
import React, { useMemo } from 'react'
import { SizableText, XStack, type XStackProps } from 'tamagui'
import { useSiteMode, type SiteStyling, type SiteSyntax, type SiteVersion } from './useSiteMode'

interface SelectOption<T extends string> {
  value: T
  label: string
}

function HeaderSelect<T extends string>({
  value,
  onValueChange,
  options,
  dotColor,
  disabled,
  testID,
  'aria-label': ariaLabel,
}: {
  value: T
  onValueChange: (val: T) => void
  options: SelectOption<T>[]
  dotColor?: string
  disabled?: boolean
  testID?: string
  'aria-label'?: string
}) {
  const currentOption = options.find((o) => o.value === value)
  const currentLabel = currentOption ? currentOption.label : value

  return (
    <XStack
      position="relative"
      items="center"
      height={26}
      px="2 max-sm:0-5"
      gap="1 max-sm:0-5"
      rounded="6"
      borderWidth={1}
      borderColor="border-color"
      bg="color-1 hover:color-2"
      opacity={disabled ? 0.35 : 0.9}
      cursor={disabled ? 'default' : 'pointer'}
      pointerEvents={disabled ? 'none' : 'auto'}
      transition="all 150ms ease"
      flexShrink={0}
      data-testid={testID}
      aria-label={ariaLabel || currentLabel}
    >
      {dotColor && (
        <XStack
          width={6}
          height={6}
          rounded="10"
          backgroundColor={dotColor as any}
          boxShadow={`0 0 4px ${dotColor}`}
        />
      )}

      <SizableText
        size="1"
        fontFamily="mono"
        color="color-12"
        userSelect="none"
        letterSpacing={-0.2}
      >
        {currentLabel}
      </SizableText>

      <ChevronDown size={10} color="color-8" />

      {!disabled && (
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value as T)}
          aria-label={ariaLabel || currentLabel}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
            fontSize: '12px',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </XStack>
  )
}

const versionOptions: SelectOption<SiteVersion>[] = [
  { value: 'v3', label: 'v3' },
  { value: 'v2', label: 'v2' },
]

const stylingOptions: SelectOption<SiteStyling>[] = [
  { value: 'tamagui', label: 'Tamagui' },
  { value: 'tailwind', label: 'Tailwind' },
]

const syntaxOptions: SelectOption<SiteSyntax>[] = [
  { value: 'string', label: 'String' },
  { value: 'object', label: 'Object' },
]

export function SiteModeSelects(props: XStackProps) {
  const {
    version,
    styling,
    syntax,
    themeId,
    setVersion,
    setStyling,
    setSyntax,
    setTheme,
    freeThemes,
  } = useSiteMode()

  const activeTheme = useMemo(() => {
    if (!themeId || themeId === 'default') return null
    return freeThemes.find((t) => String(t.id) === String(themeId))
  }, [themeId, freeThemes])

  const themeOptions: SelectOption<string>[] = useMemo(() => {
    return [
      { value: 'default', label: 'Default' },
      ...freeThemes.map((t) => ({
        value: String(t.id),
        label: t.label,
      })),
    ]
  }, [freeThemes])

  return (
    <XStack
      items="center"
      gap="1-5 max-sm:0-5"
      maxW="100%"
      flexShrink={1}
      overflow="scroll"
      className="no-scrollbar"
      {...props}
    >
      {/* 1. Version: v3 / v2 */}
      <HeaderSelect
        value={version}
        onValueChange={setVersion}
        options={versionOptions}
        testID="header-select-version"
        aria-label="Version selection"
      />

      {/* 2. Styling: Tamagui / Tailwind */}
      <HeaderSelect
        value={styling}
        onValueChange={setStyling}
        options={stylingOptions}
        disabled={version === 'v2'}
        testID="header-select-styling"
        aria-label="Styling selection"
      />

      {/* 3. Syntax: String / Object (Tamagui mode only) */}
      {styling === 'tamagui' && (
        <HeaderSelect
          value={syntax}
          onValueChange={setSyntax}
          options={syntaxOptions}
          testID="header-select-syntax"
          aria-label="Syntax selection"
        />
      )}

      {/* 4. Theme: Default / Ocean / etc. */}
      <HeaderSelect
        value={String(themeId)}
        onValueChange={setTheme}
        options={themeOptions}
        dotColor={activeTheme ? activeTheme.accentColor : undefined}
        testID="header-select-theme"
        aria-label="Theme selection"
      />
    </XStack>
  )
}
