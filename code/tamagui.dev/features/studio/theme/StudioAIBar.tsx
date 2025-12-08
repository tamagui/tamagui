import slugify from '@sindresorhus/slugify'
import { Input } from '@tamagui/input'
import { History, Moon, Plus, Sun, X } from '@tamagui/lucide-icons'
import { animationsCSS } from '@tamagui/tamagui-dev-config'
import { useStore } from '@tamagui/use-store'
import { useColorScheme } from '@vxrn/color-scheme'
import { router } from 'one'
import { memo, useEffect, useLayoutEffect, useOptimistic, useRef, useState } from 'react'
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
import { defaultModel } from '../../api/generateModels'
import { purchaseModal } from '../../site/purchase/NewPurchaseModal'
import { useUser } from '../../user/useUser'
import { toastController } from '../ToastProvider'
import { themeJSONToText } from './helpers/themeJSONToText'
import { RandomizeButton } from './RandomizeButton'
import { type UpdateGenerateArgs, useThemeBuilderStore } from './store/ThemeBuilderStore'
import { ThemePageStore } from './themePageStore'
import { Link } from '../../../components/Link'

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
  const model = defaultModel
  const inputRef = useRef<HTMLInputElement>(null)
  const user = useUser()
  const themePage = useStore(ThemePageStore)
  const themeBuilderStore = useThemeBuilderStore()

  const [isGenerating, setGenerating] = useState<'reply' | 'new' | 'delete' | null>(null)
  const themeName = useThemeName()
  const [lastPrompt, setLastPrompt] = useState('')

  const id = themePage.curProps?.id || initialTheme?.themeId || 0
  const [active, setActive] = useState(id)

  useEffect(() => {
    setActive(themePage.curProps?.id)
  }, [themePage.curProps?.id])

  useEffect(() => {
    inputRef.current?.focus()
  }, [id])

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
  const lastReply = id && themeSuite ? themeJSONToText(themeSuite) : ''

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

  return (
    <XStack
      z={1000}
      data-tauri-drag-region
      className="all ease-in ms300"
      $lg={{ mr: '$6' }}
    >
      <YStack flex={1} width="100%" gap="$4">
        <XStack flexWrap="wrap" items="center" flex={1} gap="$3">
          <XStack minW={300} flex={1}>
            <Input
              ref={inputRef as any}
              flex={1}
              placeholder={active ? `Refine this theme` : `Generate a theme`}
              size="$6"
              shadowColor="$shadow3"
              bg="$color1"
              shadowOffset={{ height: 2, width: 0 }}
              shadowRadius={10}
              rounded="$8"
              onSubmit={() => {
                fetchUpdate(active ? 'reply' : 'new')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchUpdate('new')
                }
              }}
            />
          </XStack>

          <XStack gap="$3" items="center" justify="space-between">
            <Theme name="accent">
              <Button
                rounded="$10"
                disabled={isGenerating === 'new'}
                opacity={isGenerating === 'new' ? 0.2 : 1}
                pointerEvents={isGenerating === 'new' ? 'none' : 'auto'}
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
                {hasAccess ? (active ? 'Refine' : 'Generate') : 'Access'}
              </Button>

              <RandomizeButton />
            </Theme>

            <ThemeToggle />
          </XStack>
        </XStack>

        <ScrollView
          mx="$-6"
          px="$6"
          flex={1}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <XStack gap="$2" py="$2">
            <Link href="/theme">
              <HistoryButton icon={<Plus size={14} />}>New</HistoryButton>
            </Link>

            {(historiesData || []).map((history) => {
              if (!history.themeId) {
                return null
              }
              return (
                <XStack key={history.query}>
                  <Link
                    delayNavigate
                    href={`/theme/${history.themeId!}/${slugify(history.query!)}`}
                  >
                    <HistoryButton
                      icon={<History size={14} />}
                      active={active === history.themeId}
                      onDelete={() => {
                        if (confirm('Are you sure you want to delete this theme?')) {
                          fetchUpdate('delete', `${history.themeId || ''}`)
                          router.navigate('/theme')
                        }
                      }}
                      onPress={() => {
                        console.warn('set active')
                        setActive(+history.themeId!)
                      }}
                    >
                      {history.query}
                    </HistoryButton>
                  </Link>
                </XStack>
              )
            })}

            {!hasAccess && (
              <XStack flex={1} overflow="hidden" items="center" px="$4">
                <Paragraph fontFamily="$mono" size="$3">
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
  onPress,
}: {
  active?: boolean
  children?: any
  icon?: any
  onDelete?: () => void
  onPress?: () => void
}) => {
  return (
    <XStack group="item" containerType="normal" position="relative">
      <Button onPress={onPress} size="$3" rounded="$8" theme={active ? 'accent' : null}>
        <Button.Icon>{icon}</Button.Icon>

        <Button.Text numberOfLines={1} maxW={200} fontFamily="$mono">
          {children}
        </Button.Text>
      </Button>

      {onDelete && (
        <YStack
          position="absolute"
          opacity={0}
          $group-item-hover={{
            opacity: 1,
          }}
          t={-5}
          r={-5}
          onPress={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
        >
          <X opacity={0.3} size={10} />
        </YStack>
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
    <XStack gap="$3" items="center">
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
              items="center"
              justify="center"
              opacity={1}
              y={0}
              $theme-light={{ opacity: 0, y: 3 }}
            >
              <Moon size={14} />
            </YStack>
            <YStack
              animation="bouncy"
              fullscreen
              items="center"
              justify="center"
              opacity={1}
              y={0}
              $theme-dark={{ opacity: 0, y: 3 }}
            >
              <Sun size={14} />
            </YStack>
          </Switch.Thumb>
        </Switch>
      </Configuration>
    </XStack>
  )
}
