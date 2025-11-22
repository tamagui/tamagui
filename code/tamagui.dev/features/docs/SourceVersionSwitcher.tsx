import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { router, useParams } from 'one'
import React from 'react'
import { Adapt, Select, Sheet, YStack } from 'tamagui'

export function SourceVersionSwitcher({ versions }: { versions: string[] }) {
  const params = useParams<{ sourceVersion?: string }>()

  // Default to latest version (first in array) if no param set
  const [val, setVal] = React.useState(() => {
    const sourceVersion =
      typeof params.sourceVersion === 'string' ? params.sourceVersion : undefined
    return sourceVersion || versions[0]
  })

  React.useEffect(() => {
    const sourceVersion =
      typeof params.sourceVersion === 'string' ? params.sourceVersion : undefined
    if (sourceVersion && sourceVersion !== val) {
      setVal(sourceVersion)
    }
  }, [params.sourceVersion, val])

  const switchVersion = (version: string) => {
    setVal(version)
    router.setParams({
      sourceVersion: version,
    })
  }

  // Don't render if only one version
  if (versions.length <= 1) {
    return null
  }

  return (
    <Select value={val} onValueChange={switchVersion} disablePreventBodyScroll>
      <Select.Trigger size="$2" iconAfter={ChevronDown} borderRadius={8}>
        <Select.Value placeholder={versions[0]} />
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

        <Select.Viewport minWidth={150}>
          <Select.Group>
            <Select.Label>Source Version</Select.Label>
            {React.useMemo(
              () =>
                versions.map((version, i) => {
                  return (
                    <Select.Item index={i} key={version} value={version}>
                      <Select.ItemText>{version}</Select.ItemText>
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
