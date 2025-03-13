import slugify from '@sindresorhus/slugify'
import { Input } from '@tamagui/input'
import { History, Moon, Plus, Sun, X } from '@tamagui/lucide-icons'
import { animationsCSS } from '@tamagui/tamagui-dev-config'
import { useStore } from '@tamagui/use-store'
import { useColorScheme } from '@vxrn/color-scheme'
import { Link, router } from 'one'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'
import {
  Button,
  Configuration,
  Paragraph,
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
import { themeJSONToText } from './helpers/themeJSONToText'
import { RandomizeButton } from './RandomizeButton'
import { type UpdateGenerateArgs, useThemeBuilderStore } from './store/ThemeBuilderStore'
import { ThemePageStore } from './themePageStore'

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never

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
  const themePage = useStore(ThemePageStore)
  const themeBuilderStore = useThemeBuilderStore()

  const [isGenerating, setGenerating] = useState<'reply' | 'new' | 'delete' | null>(null)
  const themeName = useThemeName()
  const [lastPrompt, setLastPrompt] = useState('')

  const id = themePage.curProps?.id || initialTheme?.themeId || ''

  const hasAccess =
    user.data?.accessInfo.hasBentoAccess || user.data?.accessInfo.hasTakeoutAccess

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
      themeBuilderStore.updateGenerate(
        initialTheme.themeSuite,
        initialTheme.query,
        initialTheme.themeId,
        initialTheme.username
      )
    }
  }, [initialTheme?.themeSuite?.name])

  const themeSuite = themeBuilderStore.themeSuite
  const lastReply = themeSuite ? themeJSONToText(themeSuite) : ''

  const fetchUpdate = async (
    type: 'reply' | 'new' | 'delete',
    themeIdToDelete?: string
  ) => {
    if (type !== 'delete' && !inputRef.current?.value.trim()) {
      toastController.show(`Please enter a prompt`)
      return
    }

    if (type !== 'delete') {
      toastController.show(`Generating...`)
    } else {
      toastController.show(`Deleting theme...`)
    }

    setGenerating(type as 'reply' | 'new')

    let seconds = 0

    const int = setInterval(() => {
      seconds++
      if (seconds === 4) {
        toastController.show(
          `${type === 'delete' ? 'Still deleting...' : 'Thinking about colors...'}`
        )
      } else if (seconds === 8) {
        toastController.show(`...`)
      } else if (seconds === 12) {
        toastController.show(
          `${type === 'delete' ? 'Almost done...' : 'Refining palettes...'}`
        )
      } else if (seconds === 16) {
        toastController.show(`Taking too long...`)
      } else if (seconds === 24) {
        toastController.show(`It really does take a bit sometimes...`)
      }
    }, 1000)

    try {
      let prompt = inputRef.current?.value ?? ''

      const lastId = `${type === 'delete' ? themeIdToDelete : id}`

      const res = await fetch(`/api/theme/generate`, {
        body: JSON.stringify({
          prompt,
          model,
          lastReply,
          lastId,
          lastPrompt,
          scheme: themeName.startsWith('dark') ? 'dark' : 'light',
          action: type === 'delete' ? 'delete' : 'generate',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = await res.json()

      console.info(`got themes`, data)

      if (data.error) {
        toastController.show(
          `Error ${type === 'delete' ? 'deleting' : 'generating'}! ${data.error}`
        )
        return
      }

      if (type !== 'delete') {
        if (!lastId) {
          // created new one just go there
          router.navigate(`/theme/${data.themeId}/${data.slug}`)
        } else {
          await themeBuilderStore.updateGenerate(
            data.result,
            slugify(prompt),
            data.themeId,
            username
          )
        }
      } else {
        toastController.show('Theme deleted')
      }

      await mutate('/api/theme/histories')

      if (type !== 'delete') {
        setLastPrompt(prompt)
      }
      toastController.hide()
    } catch (err) {
      toastController.show(`Error: ${err}`)
    } finally {
      setGenerating(null)
      clearInterval(int)
    }
  }

  const selectedThemeId = themePage.curProps?.id

  return (
    <XStack
      zi={1000}
      data-tauri-drag-region
      className="all ease-in ms300"
      $lg={{ mr: '$6' }}
    >
      <YStack f={1} width="100%" gap="$4">
        <XStack fw="wrap" ai="center" f={1} gap="$3">
          <XStack miw={300} f={1}>
            <Input
              ref={inputRef as any}
              f={1}
              placeholder={selectedThemeId ? `Refine this theme` : `Generate a theme`}
              size="$6"
              shadowColor="$shadow3"
              bg="$color1"
              shadowOffset={{ height: 2, width: 0 }}
              pr={240}
              shadowRadius={10}
              br="$8"
              onSubmit={() => {
                fetchUpdate(selectedThemeId ? 'reply' : 'new')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchUpdate('new')
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
                    fetchUpdate('new')
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

        <ScrollView
          mx="$-6"
          px="$6"
          f={1}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <XStack gap="$2" py="$2">
            <Link href="/theme">
              <HistoryButton icon={<Plus size={14} />}>New</HistoryButton>
            </Link>

            {(historiesData || []).map((history) => (
              <XStack key={history.query}>
                <Link href={`/theme/${history.themeId!}/${slugify(history.query!)}`}>
                  <HistoryButton
                    icon={<History size={14} />}
                    active={history.themeId === selectedThemeId}
                    onDelete={() => {
                      if (confirm('Are you sure you want to delete this theme?')) {
                        fetchUpdate('delete', `${history.themeId || ''}`)
                      }
                    }}
                  >
                    {history.query}
                  </HistoryButton>
                </Link>
              </XStack>
            ))}

            {!hasAccess && (
              <XStack f={1} ov="hidden" ai="center" px="$4">
                <Paragraph ff="$mono" size="$3">
                  Welcome to the Theme Builder! Pro members can build, save and refine
                  themes using the generate input above.
                </Paragraph>
              </XStack>
            )}
          </XStack>
        </ScrollView>
      </YStack>
    </XStack>
  )
})

const HistoryButton = ({
  active,
  children,
  icon,
  onDelete,
}: {
  active?: boolean
  children?: any
  icon?: any
  onDelete?: () => void
}) => {
  return (
    <XStack position="relative">
      <Button size="$3" borderRadius="$8" theme={active ? 'accent' : null}>
        <Button.Icon>{icon}</Button.Icon>

        <Button.Text numberOfLines={1} maxWidth={200} fontFamily="$mono">
          {children}
        </Button.Text>
      </Button>

      {onDelete && (
        <Button
          position="absolute"
          top={-5}
          right={-5}
          size="$1"
          circular
          onPress={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
        >
          <X opacity={0.5} size={10} />
        </Button>
      )}
    </XStack>
  )
}

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
