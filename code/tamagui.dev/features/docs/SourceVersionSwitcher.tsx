import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { type Href, router, useParams, usePathname } from 'one'
import React from 'react'
import { Adapt, Select, Sheet, YStack } from 'tamagui'

export function SourceVersionSwitcher({
  versions,
  componentName,
}: {
  versions: string[]
  componentName: string
}) {
  const pathname = usePathname()
  const params = useParams<{ subpath?: string | string[] }>()

  // Get current version from pathname
  const currentVersion = React.useMemo(() => {
    if (!params.subpath) return versions[0]

    // params.subpath is an array like ["button", "1.28.0"] or ["button"]
    const subpathArray = Array.isArray(params.subpath) ? params.subpath : [params.subpath]

    // If there's a second element, it's the version
    return subpathArray.length > 1 ? subpathArray[1] : versions[0]
  }, [params.subpath, versions])

  const switchVersion = (version: string) => {
    // Navigate to /ui/{componentName}/{version}
    const newPath =
      version === versions[0] ? `/ui/${componentName}` : `/ui/${componentName}/${version}`
    router.push(newPath as Href)
  }

  // Don't render if only one version
  if (versions.length <= 1) {
    return null
  }

  return (
    <Select value={currentVersion} onValueChange={switchVersion} disablePreventBodyScroll>
      <Select.Trigger size="$2" iconAfter={ChevronDown} borderRadius={8}>
        <Select.Value placeholder={versions[0]} fontFamily="$mono" />
      </Select.Trigger>

      <Adapt when="maxMd" platform="touch">
        <Sheet modal dismissOnSnapToBottom transition="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            transition="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            rounded="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          minW={200}
          borderWidth={1}
          borderColor="$borderColor"
          elevation="$3"
          borderRadius="$4"
        >
          <Select.Group>
            <Select.Label>Source Version</Select.Label>
            {React.useMemo(
              () =>
                versions.map((version, i) => {
                  return (
                    <Select.Item index={i} key={version} value={version}>
                      <Select.ItemText fontFamily="$mono">{version}</Select.ItemText>
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
          height="$3"
        >
          <YStack z={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            rounded="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}
