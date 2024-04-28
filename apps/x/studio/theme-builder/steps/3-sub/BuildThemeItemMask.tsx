import { Plus, X } from '@tamagui/lucide-icons'
import { Button, XStack, YStack } from 'tamagui'

import { Select } from '../../../components/Select'
import { NumberInput } from '../../../NumberInput'
import { NoticeParagraph } from '../../../StudioNotice'
import { useThemeBuilderStore } from '../../ThemeBuilderStore'
import type { BuildMask, BuildThemeMask } from '../../types'
import type { BuildThemeItemPropsBase } from '../views/BuildThemeItem'
import { BuildThemeItemFrame } from '../views/BuildThemeItemFrame'

export const BuildThemeItemMask = ({
  theme,
  ...props
}: Omit<BuildThemeItemPropsBase, 'theme' | 'label'> & { theme: BuildThemeMask }) => {
  const errors = theme.errors
  const store = useThemeBuilderStore()
  const isActive = store.selectedSubTheme === theme.id

  return (
    <BuildThemeItemFrame
      label={theme.name}
      isActive={isActive}
      onPress={() => store.setSelectedSubTheme(theme.id)}
      enableEditLabel
      onChangeLabel={(name) => {
        props.onUpdate({
          name,
        })
      }}
      {...props}
    >
      <YStack f={1} jc="center">
        <YStack gap="$1.5">
          {theme.masks?.map((mask, idx) => {
            const disabledRemove = !theme?.masks || theme.masks.length <= 1
            return (
              <XStack gap="$3" key={mask.id}>
                <Select
                  width={220}
                  id={`mask-type-${mask.id}`}
                  size="$3"
                  value={mask.type}
                  onValueChange={(newType) =>
                    store.updateMask(theme.id, mask.id, {
                      type: newType,
                    } as Partial<BuildMask>)
                  }
                >
                  <Select.Item index={0} value="inverse">
                    Inverse
                  </Select.Item>
                  <Select.Item index={1} value="strengthen">
                    Strengthen
                  </Select.Item>
                  <Select.Item index={2} value="soften">
                    Soften
                  </Select.Item>
                </Select>

                <XStack>
                  {mask.type === 'strengthen' && (
                    <NumberInput
                      ta="center"
                      min={0}
                      max={5}
                      value={mask.strength}
                      onValueChange={(newValue) =>
                        store.updateMask(theme.id, mask.id, { strength: newValue })
                      }
                      size="$2"
                      width={40}
                      id={`${mask.type}-strengthen_by-${mask.id}`}
                    />
                  )}
                  {mask.type === 'soften' && (
                    <NumberInput
                      ta="center"
                      min={0}
                      max={5}
                      value={mask.strength}
                      onValueChange={(newValue) =>
                        store.updateMask(theme.id, mask.id, { strength: newValue })
                      }
                      size="$3"
                      width={40}
                      id={`${mask.type}-soften_by-${mask.id}`}
                    />
                  )}
                </XStack>

                <Button
                  als="flex-end"
                  icon={X}
                  size="$2"
                  mr="$1.5"
                  theme="alt1"
                  chromeless
                  circular
                  disabled={disabledRemove}
                  opacity={disabledRemove ? 0.4 : 1}
                  onPress={() => {
                    store.removeMask(theme.id, mask.id)
                  }}
                />
              </XStack>
            )
          })}
        </YStack>
      </YStack>
      <Button
        mt="$2"
        als="flex-start"
        theme="alt1"
        size="$3"
        onPress={() => store.addMask(theme.id, { type: 'inverse' })}
        icon={Plus}
      >
        Add Mask
      </Button>
      <YStack theme="red_alt2" px="$2">
        {errors?.map((error) => (
          <NoticeParagraph key={error}>{error}</NoticeParagraph>
        ))}
      </YStack>
    </BuildThemeItemFrame>
  )
}
