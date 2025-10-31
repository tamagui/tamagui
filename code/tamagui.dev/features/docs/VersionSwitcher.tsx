import React, { ElementType } from 'react'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'

import type { FontSizeTokens, SelectProps } from '@tamagui/ui'
import { Adapt, Label, Select, Sheet, XStack, YStack, getFontSize } from '@tamagui/ui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { type Href, usePathname, useRouter } from 'one'

export function VersionSwitcher({
  versions,
}: {
  versions: { name: string }[]
}) {
  return (
    <YStack gap="$4">
      <XStack w={'100%'} ai="center" gap="$4">
        <VersionSwitcherItem versions={versions} />
      </XStack>
    </YStack>
  )
}

export function VersionSwitcherItem({
  versions,
}: {
  versions: { name: string }[]
}) {
  const router = useRouter()

  const pathname = usePathname()
  const [val, setVal] = React.useState(
    () => pathname.split('/').pop() ?? versions[0].name
  )

  const switchVersion = (version: string) => {
    setVal(version)
    const noSlash = pathname.replace(/\/$/, '')
    const rootPath = noSlash.replace(/\/\d+\.\d+\.\d+$/, '')
    if (version === versions[0].name) return
    const newPathname = `${rootPath}/${version}`
    router.push(newPathname as Href)
  }

  return (
    <Select value={val} onValueChange={switchVersion} disablePreventBodyScroll>
      <Select.Trigger maxWidth={220} iconAfter={ChevronDown} borderRadius={8}>
        <Select.Value placeholder="2.0.0" />
      </Select.Trigger>

      <Adapt when="maxMd" platform="touch">
        <Sheet modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>Versions</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {React.useMemo(
              () =>
                versions.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [versions]
            )}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}
