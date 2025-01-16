import { Check } from '@tamagui/lucide-icons'
import { Checkbox, H4, Label, Paragraph, Spacer, XStack, YStack } from 'tamagui'

import { useRootStore } from '../../../state/useGlobalState'
import { StudioNotice } from '~/features/studio/StudioNotice'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

export function StepSchemes() {
  const rootStore = useRootStore()
  const store = useThemeBuilderStore()

  return (
    <YStack f={1} my="$4" gap="$4">
      <H4>Dark and light schemes</H4>

      <Paragraph size="$5" theme="alt1">
        At the base of your themes we recommend a light and dark theme, but you can choose
        just one.
      </Paragraph>

      <XStack gap="$3">
        <Option
          onChange={(val) => {
            store.setSelectedScheme('light', val)
            // if turning off light, set root store to dark
            if (!val) {
              rootStore.theme = 'dark'
            }
          }}
          label="Light"
          value="light"
          id="light"
          active={store.schemes.light}
        />
        <Option
          onChange={(val) => {
            // if turning off dark, set root store to light
            store.setSelectedScheme('dark', val)
            if (!val) {
              rootStore.theme = 'light'
            }
          }}
          label="Dark"
          value="dark"
          id="dark"
          active={store.schemes.dark}
        />
      </XStack>

      <Spacer flex />

      <StudioNotice>
        Tamagui auto-generates media queries on the web using prefers-color-scheme.
      </StudioNotice>
    </YStack>
  )
}

const Option = ({
  id,
  active,
  onChange,
  value,
  label,
  description,
}: {
  id: string
  description?: string
  label: string
  value?: any
  active?: boolean
  onChange: (next: boolean) => void
}) => {
  return (
    <Label
      f={1}
      htmlFor={id}
      p="$3"
      height="unset"
      display="flex"
      borderWidth={1}
      theme={active ? 'blue' : null}
      backgroundColor={active ? '$color3' : '$color2'}
      borderColor={active ? '$color6' : '$color7'}
      borderRadius="$5"
      space="$4"
      ai="center"
      hoverStyle={{
        borderColor: active ? '$color6' : '$color8',
      }}
    >
      <Checkbox
        checked={active}
        onCheckedChange={onChange}
        id={id}
        size="$6"
        value={value}
      >
        <Checkbox.Indicator
        // backgroundColor={active ? '$color8' : '$color1'}
        >
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <YStack gap="$2" f={1}>
        <Paragraph size="$5">{label}</Paragraph>
        {!!description && (
          <Paragraph size="$3" lh="$1" theme="alt2">
            {description}
          </Paragraph>
        )}
      </YStack>
    </Label>
  )
}
