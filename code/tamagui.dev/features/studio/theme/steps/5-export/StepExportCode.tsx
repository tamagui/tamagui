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
  RadioGroup,
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

const platforms = ['vanilla', 'nextjs', 'expo', 'webpack', 'vite'] as const

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
  selectedPlatform: Platform = 'vanilla'

  platformData: Record<
    Platform,
    {
      name: string
      description?: string
      steps: Array<Step>
    }
  > | null = null
  selectedPlatformData: { name: string; steps: Array<Step> } | null = null

  includeComponentThemes = true

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

  setSelectedPlatform(value: Platform) {
    this.selectedPlatform = value
    this.updateSelectedPlatformData()
  }

  updateSelectedPlatformData() {
    this.selectedPlatformData = this.selectedPlatform
      ? (this.platformData?.[this.selectedPlatform] ?? null)
      : null
  }

  async updateSteps() {
    const config = await this.getThemeBuilderConfig()
    if (!config) return

    const addThemeStep = {
      name: 'Add theme',
      steps: [
        {
          type: 'text',
          content: 'Copy into a theme-builder.ts file:',
        },
        {
          type: 'files',
          files: [
            {
              filename: 'theme-builder.ts',
              content: config,
              maxHeight: 150,
              downloadable: true,
            },
          ],
        },
      ],
    } satisfies Step

    const updateConfigStep = {
      name: 'Update your Tamagui config',
      steps: [
        {
          type: 'text',
          content:
            'Finally update your tamagui.config.ts file to use the theme builder output file.',
        },
        {
          type: 'files',
          files: [
            {
              filename: 'tamagui.config.ts',
              content: `import * as themes from './src/themes'
import { tokens } from '@tamagui/config/v3'

const config = createTamagui({
  tokens,
  themes,
  // ...the rest of your config
})
`,
            },
          ],
        },
      ],
    } satisfies Step

    this.platformData = {
      expo: {
        name: 'React Native',
        description: 'react-native or Expo project.',
        steps: [
          addThemeStep,
          {
            name: 'Add the generate script',
            steps: [
              {
                type: 'text',
                content: 'Make sure the Tamagui CLI is installed in your project',
              },
              {
                type: 'command',
                content: 'yarn add @tamagui/cli',
              },
              {
                type: 'text',
                content: 'then, add the following script to your package.json:',
              },
              {
                type: 'files',
                files: [
                  {
                    filename: 'package.json',
                    content: `{
  "scripts": {
    "generate-themes": "tamagui generate-themes ./path/to/theme-builder.ts ./theme-output.ts"
  }
}`,
                  },
                ],
              },
            ],
          },
          {
            name: 'Generate the theme',
            steps: [
              {
                type: 'text',
                content: 'Run:',
              },
              {
                type: 'command',
                content: 'yarn generate-themes',
              },
              {
                type: 'text',
                content:
                  'And remember, you will need to re-run this script every time you change your theme builder code.',
              },
            ],
          },
          updateConfigStep,
        ],
      },

      vanilla: {
        name: 'Vanilla',
        description: 'Basic steps for any project',
        steps: [
          addThemeStep,
          {
            name: `Generate`,
            steps: [
              {
                content: `npx @tamagui/cli generate-themes theme-builder.ts themes.ts`,
                type: 'command',
              },
            ],
          },
          updateConfigStep,
        ],
      },

      nextjs: {
        name: 'Next.js',
        description: 'Used in monorepo or standalone.',
        steps: [
          addThemeStep,
          {
            name: 'Configure Next.js',
            steps: [
              {
                type: 'text',
                content: 'Open your Next.js config file and add the following:',
              },
              {
                type: 'files',
                files: [
                  {
                    filename: 'next.config.ts',
                    content: `withTamagui({
  themeBuilder: {
    input: 'src/theme-builder.ts',
    output: 'src/themes.ts',
  },
  outputCSS: process\.env\.NODE_ENV === 'production' ? './public/tamagui.css' : null,
  // ...
}),`,
                  },
                ],
              },
              {
                type: 'text',
                content:
                  'Now, the Next.js server will watch your theme builder file and update the output whenever it changes.',
              },
            ],
          },

          {
            name: 'Update your Tamagui config',
            steps: [
              {
                type: 'text',
                content:
                  'Finally, update your tamagui.config.ts file to use the theme builder output file.',
              },
              {
                type: 'files',
                files: [
                  {
                    filename: 'tamagui.config.ts',
                    content: `import * as themesIn from './src/themes'
import { tokens } from '@tamagui/config/v3'

// TAMAGUI_IS_SERVER is set by @tamagui/next-plugin
const themes =
  process.env.TAMAGUI_IS_SERVER || process.env.NODE_ENV !== 'production'
    ? themesIn
    : ({} as typeof themesIn)


const config = createTamagui({
  tokens,
  themes,
  // ...the rest of your config
})
`,
                  },
                ],
              },
            ],
          },
        ],
      },
      vite: {
        name: 'Vite',
        description: 'Project using Vite and the `@tamagui/vite-plugin` plugin.',
        steps: [
          addThemeStep,
          {
            name: 'Configure Vite',
            steps: [
              {
                type: 'text',
                content: 'Open your Vite config file and add the following:',
              },
              {
                type: 'files',
                files: [
                  {
                    filename: 'vite.config.ts',
                    content: `export default defineConfig({
  plugins: [
    tamaguiPlugin({
      themeBuilder: {
        input: 'src/theme-builder.ts',
        output: 'src/themes.ts',,
      },
      outputCSS: process\.env\.NODE_ENV === 'production' ? './public/tamagui.css' : null,
      // ...
    }),
    // ...
  ],
})
`,
                  },
                ],
              },
              {
                type: 'text',
                content:
                  'Now, Vite will watch your theme builder file and update the output whenever it changes.',
              },
            ],
          },
          updateConfigStep,
        ],
      },
      webpack: {
        name: 'Webpack',
        description: 'Project using Webpack and the `tamagui-loader` plugin.',
        steps: [
          addThemeStep,
          {
            name: 'Configure Webpack',
            steps: [
              {
                type: 'text',
                content: 'Open your Webpack config file and add the following:',
              },
              {
                type: 'files',
                files: [
                  {
                    filename: 'webpack.config.js',
                    content: `module.exports = {
  plugins: [
    new TamaguiPlugin({
      themeBuilder: {
        input: 'src/theme-builder.ts',
        output: 'src/themes.ts',,
      },
      outputCSS: process\.env\.NODE_ENV === 'production' ? './public/tamagui.css' : null,
      // ...
    }),
    // ...
  ],
}
`,
                  },
                ],
              },
              {
                type: 'text',
                content:
                  'Now, Webpack will watch your theme builder file and update the output whenever it changes.',
              },
            ],
          },
          updateConfigStep,
        ],
      },
    } satisfies typeof this.platformData
    this.updateSelectedPlatformData()
  }
}

export const StepExportCode = () => {
  const store = useStore(StepExportStore)

  useEffect(() => {
    store.updateSteps()
  }, [])

  return (
    <YStack py="$4" gap="$3" px="$4">
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

      <YStack f={1}>
        {!!store.platformData && (
          <RadioGroup
            mt="$4"
            gap="$2"
            value={store.selectedPlatform ?? undefined}
            onValueChange={(val) => {
              store.setSelectedPlatform(val as any)
            }}
          >
            {platforms.map((platform) => {
              const active = store.selectedPlatform === platform
              const htmlId = `demo-item-${platform}`
              const data = store.platformData?.[platform]
              return (
                <Label
                  key={platform}
                  f={1}
                  htmlFor={htmlId}
                  p="$4"
                  height="unset"
                  display="flex"
                  borderWidth="$0.5"
                  borderColor={active ? '$color8' : '$color5'}
                  borderRadius="$4"
                  gap="$4"
                  ai="center"
                  hoverStyle={{
                    borderColor: active ? '$color10' : '$color7',
                  }}
                >
                  <RadioGroup.Item id={htmlId} size="$3" value={platform}>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <YStack f={1}>
                    <Paragraph size="$6">{data?.name}</Paragraph>
                    <Paragraph size="$4" theme="alt1">
                      {data?.description}
                    </Paragraph>
                  </YStack>
                </Label>
              )
            })}
          </RadioGroup>
        )}
      </YStack>
    </YStack>
  )
}

export const StepExportCodeSidebar = () => {
  const store = useStore(StepExportStore)

  const platform = store.selectedPlatformData
  if (!platform) {
    return null
  }

  return (
    <ScrollView py="$2" pt="$4">
      <YStack gap="$8" pt="$1" pb="$6" key={store.selectedPlatform}>
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
          height={50}
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
