import slugify from '@sindresorhus/slugify'
import { Input } from '@tamagui/input'
import { History, Moon, Sun } from '@tamagui/lucide-icons'
import { animationsCSS } from '@tamagui/tamagui-dev-config'
import { useColorScheme } from '@vxrn/color-scheme'
import { useActiveParams, useParams } from 'one'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'
import {
  Button,
  Configuration,
  ScrollView,
  Spinner,
  Switch,
  Theme,
  useThemeName,
  XStack,
  YStack,
} from 'tamagui'
import { Select } from '../../../components/Select'
import { defaultModel, generateModels, type ModelNames } from '../../api/generateModels'
import { purchaseModal } from '../../site/purchase/NewPurchaseModal'
import { useUser } from '../../user/useUser'
import { toastController } from '../ToastProvider'
import { RandomizeButton } from './RandomizeButton'
import { themeBuilderStore } from './store/ThemeBuilderStore'
import { themeJSONToText } from './helpers/themeJSONToText'

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never

type UpdateGenerateArgs = Parameters<typeof themeBuilderStore.updateGenerate>

interface StudioAIBarProps {
  initialTheme?: {
    themeSuite: UpdateGenerateArgs[0]
    query?: UpdateGenerateArgs[1]
    themeId?: UpdateGenerateArgs[2]
    username?: UpdateGenerateArgs[3]
  }
}

export const StudioAIBar = memo(({ initialTheme }: StudioAIBarProps) => {
  const [model, setModel] = useState(defaultModel)
  const inputRef = useRef<HTMLInputElement>(null)
  const user = useUser()

  // bug in one: doesn't update after first render
  const params = useParams<{ subpath: string | string[] }>()

  const [isGenerating, setGenerating] = useState<'reply' | 'new' | null>(null)
  const themeName = useThemeName()
  const [lastPrompt, setLastPrompt] = useState('')

  const hasAccess =
    user.data?.accessInfo.hasBentoAccess || user.data?.accessInfo.hasTakeoutAccess

  const [selectedThemeId, setSelectedThemeId] = useState(
    (() => {
      if (Array.isArray(params.subpath)) {
        return Number(params.subpath[0])
      }
      if (typeof params.subpath === 'string') {
        return Number(params.subpath)
      }
      return typeof initialTheme?.themeId === 'number' ? initialTheme.themeId : undefined
    })()
  )

  const username = user.data?.userDetails?.full_name

  const { data: historiesData } = useSWR(
    user.data ? '/api/theme/histories' : null,
    async (url) => {
      const res = await fetch(url)
      const data = await res.json()
      return data.histories.map((history) => ({
        themeSuite: history.theme_data,
        query: history.search_query,
        themeId: history.id,
        username: username,
      })) as NonNullable<StudioAIBarProps['initialTheme']>[]
    }
  )

  useLayoutEffect(() => {
    if (initialTheme) {
      initialTheme
      inputRef.current!.value = initialTheme.query ?? ''
      console.warn('update to', initialTheme?.themeSuite)
      themeBuilderStore.updateGenerate(
        initialTheme.themeSuite,
        initialTheme.query,
        initialTheme.themeId,
        initialTheme.username
      )
    }
  }, [initialTheme?.themeSuite])

  const themeSuite = themeBuilderStore.themeSuite
  const lastReply = themeSuite ? themeJSONToText(themeSuite) : ''

  const generate = async (type: 'reply' | 'new') => {
    if (!inputRef.current?.value.trim()) {
      toastController.show(`Please enter a prompt`)
      return
    }
    toastController.show(`Generating...`)
    setGenerating(type)

    let seconds = 0

    const int = setInterval(() => {
      seconds++
      if (seconds === 4) {
        toastController.show(`Thinking about colors...`)
      } else if (seconds === 8) {
        toastController.show(`...`)
      } else if (seconds === 12) {
        toastController.show(`Refining palettes...`)
      } else if (seconds === 16) {
        toastController.show(`Taking too long...`)
      } else if (seconds === 24) {
        toastController.show(`It really does take a bit sometimes...`)
      }
    }, 1000)

    try {
      let prompt = inputRef.current?.value ?? ''

      const res = await fetch(`/api/theme/generate`, {
        body: JSON.stringify({
          prompt,
          model,
          lastReply,
          lastPrompt,
          scheme: themeName.startsWith('dark') ? 'dark' : 'light',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = await res.json()

      console.info(`got themes`, data)

      if (data.error) {
        toastController.show(`Error generating! ${data.error}`)
        return
      }

      themeBuilderStore.updateGenerate(
        data.result,
        slugify(prompt),
        data.themeId,
        username
      )

      if (typeof data.themeId === 'number') {
        setSelectedThemeId(data.themeId)
      }

      await mutate('/api/theme/histories')

      setLastPrompt(prompt)
      toastController.hide()
    } catch (err) {
      toastController.show(`Error: ${err}`)
    } finally {
      setGenerating(null)
      clearInterval(int)
    }
  }

  const applyTheme = async (history: NonNullable<StudioAIBarProps['initialTheme']>) => {
    const slug = slugify(history?.query ?? '')
    if (typeof history.themeId === 'number') {
      setSelectedThemeId(history.themeId)
    }

    themeBuilderStore.updateGenerate(
      history.themeSuite,
      slug,
      history.themeId,
      history.username
    )
  }

  return (
    <XStack zi={1000} data-tauri-drag-region className="all ease-in ms300">
      <YStack f={1} width="100%" gap="$4">
        <XStack fw="wrap" ai="center" f={1} gap="$3">
          <XStack miw={300} f={1}>
            <Input
              ref={inputRef as any}
              f={1}
              placeholder={`Generate a theme`}
              size="$6"
              shadowColor="$shadow3"
              bg="$color1"
              shadowOffset={{ height: 2, width: 0 }}
              shadowRadius={10}
              br="$8"
              onSubmit={() => {
                generate(selectedThemeId ? 'reply' : 'new')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  generate('new')
                }
              }}
            />

            <Select
              w={200}
              pos="absolute"
              t={10}
              br={100}
              r="$4"
              size="$4"
              value={model}
              onValueChange={(x) => {
                setModel(x as ModelNames)
              }}
            >
              {Object.keys(generateModels).map((modelName, index) => (
                <Select.Item key={modelName} value={modelName} index={index}>
                  {modelName}
                </Select.Item>
              ))}
            </Select>
          </XStack>
          <XStack gap="$3" ai="center" jc="space-between">
            <Theme name="accent">
              <Button
                br="$10"
                disabled={isGenerating === 'new'}
                o={isGenerating === 'new' ? 0.2 : 1}
                pe={isGenerating === 'new' ? 'none' : 'auto'}
                icon={isGenerating === 'new' ? <Spinner size="small" /> : null}
                onPress={() => {
                  if (hasAccess) {
                    generate('new')
                  } else {
                    purchaseModal.show = true
                  }
                }}
                size="$4"
              >
                {hasAccess ? (selectedThemeId ? 'Refine' : 'Generate') : 'Access'}
              </Button>

              <RandomizeButton />
            </Theme>

            <ThemeToggle />
          </XStack>
        </XStack>
        {historiesData && historiesData.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2" py="$2">
              {historiesData.map((history) => (
                <Button
                  key={history.query}
                  size="$3"
                  chromeless
                  bordered
                  onPress={() => applyTheme(history)}
                  borderRadius="$8"
                  bg={history.themeId === selectedThemeId ? '$color12' : '$color2'}
                  color={history.themeId === selectedThemeId ? '$color1' : '$color11'}
                  focusStyle={{
                    bg: history.themeId === selectedThemeId ? '$color12' : '$color2',
                    opacity: 0.8,
                  }}
                >
                  <Button.Icon>
                    <History size={14} />
                  </Button.Icon>

                  <Button.Text numberOfLines={1} maxWidth={200} fontFamily="$mono">
                    {history.query}
                  </Button.Text>
                </Button>
              ))}
            </XStack>
          </ScrollView>
        )}
      </YStack>
    </XStack>
  )
})

const ThemeToggle = () => {
  const [scheme, setUserTheme] = useColorScheme()
  const [checked, setChecked] = useState(scheme === 'light')

  useEffect(() => {
    setChecked(scheme === 'light')
  }, [scheme === 'light'])

  return (
    <XStack gap="$3" ai="center">
      <Configuration animationDriver={animationsCSS}>
        <Switch
          checked={checked}
          outlineColor="$accent11"
          outlineWidth={0}
          outlineStyle="solid"
          pressStyle={{
            bg: '$color2',
          }}
          onCheckedChange={(on) => {
            setChecked(on)
            setTimeout(() => {
              setUserTheme(on ? 'light' : 'dark')
            })
          }}
          size="$3"
        >
          <Switch.Thumb checked={checked} animation="75ms" size="$3">
            <YStack
              animation="bouncy"
              fullscreen
              ai="center"
              jc="center"
              o={1}
              y={0}
              $theme-light={{ o: 0, y: 3 }}
            >
              <Moon size={14} />
            </YStack>
            <YStack
              animation="bouncy"
              fullscreen
              ai="center"
              jc="center"
              o={1}
              y={0}
              $theme-dark={{ o: 0, y: 3 }}
            >
              <Sun size={14} />
            </YStack>
          </Switch.Thumb>
        </Switch>
      </Configuration>
    </XStack>
  )
}
