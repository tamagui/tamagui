import { LinearGradient } from '@tamagui/linear-gradient'
import { Copy, Download } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { useEffect } from 'react'
import {
  Button,
  Circle,
  Fieldset,
  Label,
  Paragraph,
  ScrollView,
  SizableText,
  Switch,
  Tabs,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import { themeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { toastController } from '../../../ToastProvider'
import { FieldsetWithLabel } from '../../views/FieldsetWithLabel'

const platforms = ['vanilla'] as const

type Platform = (typeof platforms)[number]

type FileType = {
  filename: string
  content: string
  maxHeight?: number
  downloadable?: boolean
}

type SubStep =
  | { type: 'text'; content: string }
  | { type: 'command'; content: string }
  | {
      type: 'files'
      files: Array<FileType>
    }

type Step = {
  steps: Array<SubStep>
  name: string
}

export class StepExportStore {
  includeComponentThemes = true

  platformData: Record<
    Platform,
    {
      name: string
      description?: string
      steps: Array<Step>
    }
  > | null = null

  setIncludeComponentThemes(newVal: boolean) {
    this.includeComponentThemes = newVal
    this.updateSteps()
  }

  includeSizeTokens = true

  setIncludeSizeTokens(newVal: boolean) {
    this.includeSizeTokens = newVal
    this.updateSteps()
  }

  getThemeBuilderConfig() {
    return themeBuilderStore.getCode({
      includeComponentThemes: this.includeComponentThemes,
      includeSizeTokens: this.includeSizeTokens,
    })
  }

  async updateSteps() {
    const config = await this.getThemeBuilderConfig()
    if (!config) return

    this.platformData = {
      vanilla: {
        name: 'Vanilla',
        description: 'Basic steps for any project',
        steps: [
          {
            name: 'Add theme',
            steps: [
              {
                type: 'text',
                content: 'Copy into a themes.ts file:',
              },
              {
                type: 'files',
                files: [
                  {
                    filename: 'themes.ts',
                    content: config,
                    maxHeight: 350,
                    downloadable: true,
                  },
                ],
              },
            ],
          },

          {
            name: 'Update your tamagui config',
            steps: [
              {
                type: 'files',
                files: [
                  {
                    filename: 'tamagui.config.ts',
                    content: `import { themes } from './themes'
import { defaultConfig } from '@tamagui/config/v4'

export const config = createTamagui({
  themes,
  ...defaultConfig,
})
`,
                  },
                ],
              },
            ],
          },

          {
            name: 'Done!',
            steps: [
              {
                type: 'text',
                content: `That's it! Tamagui used to require more configuration to optimize your themes in production, but we now automate that optimization for you.`,
              },
            ],
          },
        ],
      },
    } satisfies typeof this.platformData
  }
}

export const StepExportCodeSidebar = () => {
  const store = useStore(StepExportStore)

  useEffect(() => {
    store.updateSteps()
  }, [])

  const platform = store.platformData?.vanilla
  if (!platform) {
    return null
  }

  return (
    <ScrollView py="$2" pt="$4">
      <YStack gap="$8" pt="$1" pb="$6" px="$3">
        <FieldsetWithLabel label="Options">
          <YStack gap="$1" p="$4">
            <Fieldset flexDirection="row" ai="center" gap="$3">
              <YStack>
                <Switch
                  id="include-component-themes-switch"
                  checked={store.includeComponentThemes}
                  onCheckedChange={(newChecked) =>
                    store.setIncludeComponentThemes(!!newChecked)
                  }
                  size="$2"
                >
                  <Switch.Thumb animation="quickest" />
                </Switch>
              </YStack>
              <Label size="$3" htmlFor="include-component-themes-switch">
                Include Component Themes
              </Label>
            </Fieldset>
          </YStack>
        </FieldsetWithLabel>

        {platform.steps.map((step, idx) => (
          <YStack key={idx} gap="$3">
            <XStack gap="$3" ai="center" ml="$3">
              <Circle bg="$background" size={20} jc="center" ai="center">
                <SizableText ta="center" fontFamily="$heading" size="$1" x={1}>
                  {idx + 1}
                </SizableText>
              </Circle>
              <SizableText fontFamily="$heading" size="$3" color="$color11" ls={1}>
                {step.name}
              </SizableText>
            </XStack>

            <YStack gap="$4">
              {step.steps.map((subStep, _idx) => {
                return (
                  <XStack key={_idx} ml="$4" mr="$3">
                    {subStep.type === 'text' && (
                      <Paragraph theme="alt1" size="$4">
                        {subStep.content}
                      </Paragraph>
                    )}
                    {subStep.type === 'command' && (
                      <Code filename="" content={subStep.content} />
                    )}
                    {subStep.type === 'files' && (
                      <Tabs
                        defaultValue={subStep.files[0].filename}
                        orientation="horizontal"
                        flexDirection="column"
                        gap="$2"
                        flex={1}
                      >
                        <Tabs.List
                          bg="$color4"
                          als="flex-start"
                          btrr="$3"
                          btlr="$3"
                          mx="$3"
                        >
                          {subStep.files.map((file, i) => (
                            <Tabs.Tab
                              key={i}
                              unstyled
                              px="$3"
                              pt="$2"
                              mb={-22}
                              pb="$4.5"
                              bg="$color2"
                              value={file.filename}
                            >
                              <SizableText color="$color8" size="$2">
                                {file.filename}
                              </SizableText>
                            </Tabs.Tab>
                          ))}
                        </Tabs.List>

                        {subStep.files.map((file, i) => (
                          <Tabs.Content key={i} value={file.filename}>
                            <Code {...file} />
                          </Tabs.Content>
                        ))}
                      </Tabs>
                    )}
                  </XStack>
                )
              })}
            </YStack>
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  )
}

const Code = ({ content, downloadable, maxHeight, filename }: FileType) => {
  return (
    <YStack f={1}>
      <ScrollView
        f={1}
        horizontal
        maxHeight={maxHeight}
        bg="$background"
        py="$3"
        px="$4"
        br="$4"
      >
        <Text
          fontFamily="$mono"
          fontSize="$2"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </ScrollView>
      {maxHeight && (
        <LinearGradient
          pos="absolute"
          left={0}
          right={0}
          bottom={0}
          height={maxHeight}
          colors={['$background', 'transparent']}
          start={[0, 1]}
          end={[0, 0]}
        />
      )}
      <XStack pos="absolute" right="$2.5" top={10} gap="$2" flexDirection="row-reverse">
        <Button
          onPress={() => {
            copyText(content)
          }}
          size="$2"
          icon={Copy}
        >
          Copy
        </Button>
        {downloadable && (
          <Theme name="green">
            <Button
              als="center"
              size="$2"
              icon={Download}
              onPress={() => {
                downloadFile(filename, content)
              }}
            >
              Download File
            </Button>
          </Theme>
        )}
      </XStack>
    </YStack>
  )
}

function downloadFile(filename, text) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    toastController.show('Copied!')
  })
}
