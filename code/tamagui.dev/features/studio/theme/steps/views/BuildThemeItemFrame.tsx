import { XStack, YStack } from 'tamagui'
import { Select, SelectItem } from '../../../components/Select'
import type { FieldsetWithLabelProps } from '../../views/FieldsetWithLabel'
import { FieldsetWithLabel } from '../../views/FieldsetWithLabel'
import { useThemeBuilderStore } from '../../store/ThemeBuilderStore'

export type BuildThemeItemFrameProps = FieldsetWithLabelProps & {
  onDelete?: () => void | Promise<void>
  disabled?: boolean
}

export const BuildThemeItemFrame = ({
  children,
  afterLabel,
  onDelete,
  disabled,
  ...props
}: BuildThemeItemFrameProps) => {
  const themeBuilder = useThemeBuilderStore()
  const isAccent = props.label === 'accent'

  return (
    <FieldsetWithLabel
      {...props}
      afterLabel={
        <XStack gap="$2" ai="center">
          {afterLabel}

          {isAccent && (
            <Select
              size="$2"
              defaultValue={themeBuilder.accentSetting}
              onValueChange={(value) => {
                themeBuilder.setAccentSetting(value as any)
              }}
            >
              <SelectItem value="off" index={0}>
                Off
              </SelectItem>
              <SelectItem value="inverse" index={1}>
                Inverse
              </SelectItem>
              <SelectItem value="color" index={2}>
                Color
              </SelectItem>
            </Select>
          )}
        </XStack>
      }
    >
      <YStack
        {...(Boolean(
          disabled || (isAccent && themeBuilder.accentSetting !== 'color')
        ) && {
          o: 0.25,
          pe: 'none',
        })}
        gap="$4"
      >
        {children}
      </YStack>
    </FieldsetWithLabel>
  )
}
