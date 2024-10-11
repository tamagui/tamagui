import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Label, XStack, YStack, useEvent } from 'tamagui'

import { Select } from '../../../components/Select'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import type { ThemeStepProps } from '../../types'
import type { BuildThemeItemFrameProps } from './BuildThemeItemFrame'
import { BuildThemeItemFrame } from './BuildThemeItemFrame'
import { StepThemeTemplate } from './StepThemeTemplate'

export type BuildThemeItemPropsBase = ThemeStepProps & Omit<BuildThemeItemFrameProps, 'children'>

export const BuildThemeItem = ({
  label,
  afterLabel,
  disabled,
  paletteNote,
  onDelete,
  enableEditLabel,
  isActive,
  tooltip,
  onPress,
  ...props
}: BuildThemeItemPropsBase & {
  paletteNote?: string
}) => {
  const store = useThemeBuilderStore()
  const templateNames = Object.keys(store.templates)
  const [expanded, setExpanded] = useState(false)

  return (
    <BuildThemeItemFrame
      isActive={isActive}
      tooltip={tooltip}
      enableEditLabel={enableEditLabel}
      onPress={onPress}
      onDelete={onDelete}
      onChangeLabel={(name) => {
        props.onUpdate({
          name,
        })
      }}
      label={label || ''}
      afterLabel={
        <>
          <XStack gap="$4">
            <Label size="$2">Template</Label>
            <Select
              size="$2"
              w={120}
              value={props.theme.template}
              elevation="$0.5"
              theme="alt1"
              onValueChange={useEvent(async (template) => {
                if (template === CREATE_NEW) {
                  const name = store.addTemplate({
                    ...store.templates[props.theme.template],
                  })
                  await store.updateTheme({
                    ...props.theme,
                    template: name,
                  })
                } else {
                  await store.updateTheme({
                    ...props.theme,
                    template,
                  })
                }
              })}
            >
              {templateNames.map((name, idx) => {
                const item = store.templates[name]
                return (
                  <Select.Item
                    index={idx}
                    key={`${item}${idx}`}
                    value={name}
                  >
                    {name}
                  </Select.Item>
                )
              })}

              <Select.Item
                index={templateNames.length}
                value={CREATE_NEW}
              >
                Create New...
              </Select.Item>
            </Select>
          </XStack>

          <Button
            size="$1"
            circular
            icon={!expanded ? ChevronDown : ChevronUp}
            onPress={() => setExpanded(!expanded)}
          />

          {afterLabel}
        </>
      }
    >
      <YStack
        {...(!expanded && {
          mah: 180,
          ov: 'hidden',
          o: 0.5,
        })}
      >
        {props.theme && <StepThemeTemplate buildTheme={props.theme} />}

        {!expanded && (
          <LinearGradient
            fullscreen
            colors={['$background0', '$background']}
            onPress={() => {
              setExpanded(true)
            }}
          />
        )}
      </YStack>
    </BuildThemeItemFrame>
  )
}

const CREATE_NEW = 'CREATE_NEW'
