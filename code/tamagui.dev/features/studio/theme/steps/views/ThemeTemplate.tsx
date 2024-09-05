import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, ScrollView, XStack, YStack } from 'tamagui'

import { Select } from '../../../components/Select'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import type { BuildTheme } from '../../types'
import { FieldsetWithLabel } from '../../views/FieldsetWithLabel'
import { StepThemeTemplate } from './StepThemeTemplate'

export const ThemeTemplate = ({ theme }: { theme: BuildTheme }) => {
  const [showMore, setShowMore] = useState(false)
  const [selected, setSelected] = useState('base')
  const stepStore = useThemeBuilderStore()
  const hide = !stepStore.showTemplate

  return (
    <YStack mah={hide ? 50 : 600} pt="$4" mt="$-4">
      <FieldsetWithLabel
        label="Template"
        tooltip={
          <>
            Tamagui takes your palette from the themes you've defined above and then uses
            a template to generate your final theme.
          </>
        }
        afterLabel={
          <XStack gap="$2" ai="center">
            <Select
              value={selected}
              onValueChange={setSelected}
              size="$2"
              w={100}
              f={1}
              defaultValue="base"
            >
              <Select.Item index={0} value="base">
                Base
              </Select.Item>
              <Select.Item index={0} value="component">
                Component
              </Select.Item>
            </Select>

            <Button
              size="$2"
              themeInverse={showMore}
              onPress={() => {
                setShowMore(!showMore)
                stepStore.showTemplate = false
              }}
            >
              Customize
            </Button>

            <Button
              onPress={() => {
                stepStore.showTemplate = !stepStore.showTemplate
              }}
              size="$1"
              circular
              icon={hide ? ChevronUp : ChevronDown}
            />
          </XStack>
        }
      >
        <ScrollView mah={500} m="$-5" p="$5" mt="$0">
          {theme && <StepThemeTemplate buildTheme={theme} />}
        </ScrollView>
      </FieldsetWithLabel>
    </YStack>
  )
}
