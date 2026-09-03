import React, { ElementType } from 'react'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons-2'

import type { FontSizeTokens, SelectProps } from 'tamagui'
import { Adapt, Label, Select, Sheet, XStack, YStack, getFontSize } from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { type Href, usePathname, useRouter } from 'one'

export function VersionSwitcher({ versions }: { versions: { name: string }[] }) {
  return (
    <YStack gap="4">
      <XStack width="100%" items="center" gap="4">
        <VersionSwitcherItem versions={versions} />
      </XStack>
    </YStack>
  )
}

export function VersionSwitcherItem({ versions }: { versions: { name: string }[] }) {
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
    <Select
      value={val}
      onValueChange={switchVersion}
      disablePreventBodyScroll
      zIndex={200000}
    >
      <Select.Trigger
        maxWidth={220}
        height={36}
        paddingHorizontal="3"
        gap="2"
        backgroundColor="background"
        borderWidth={1}
        borderColor="border-color"
        borderRadius={8}
      >
        <Select.Value placeholder="2.0.0" />
        <Select.Icon marginLeft="auto">
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Adapt when="max-md" platform="touch">
        <Sheet modal dismissOnSnapToBottom transition="medium">
          <Sheet.Container>
            <Sheet.Background />
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Container>
          <Sheet.Overlay
            backgroundColor="shadow-color"
            transition="lazy"
            opacity="enter:0 exit:0"
          />
        </Sheet>
      </Adapt>

      <Select.Content>
        <Select.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="3"
        >
          <YStack z={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            position="absolute"
            inset={0}
            rounded="4"
            colors={['background', 'transparent']}
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // transition="quick"
          // opacity="enter:0 exit:0"
          // y="enter:-10px exit:10px"
          minW={200}
        >
          <Select.Group>
            <Select.Label>Versions</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {React.useMemo(
              () =>
                versions.map((item) => {
                  return (
                    <Select.Item key={item.name} value={item.name.toLowerCase()}>
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
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="3"
        >
          <YStack z={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            position="absolute"
            inset={0}
            rounded="4"
            colors={['transparent', 'background']}
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}
