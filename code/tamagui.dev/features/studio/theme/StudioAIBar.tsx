import { Input } from '@tamagui/input'
import { Moon, Sun } from '@tamagui/lucide-icons'
import { useColorScheme } from '@vxrn/color-scheme'
import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Configuration,
  Spinner,
  Switch,
  Theme,
  useThemeName,
  XStack,
  YStack,
} from 'tamagui'
import { animationsCSS } from '../../../config/animations.css'
import { useUser } from '../../user/useUser'
import { toastController } from '../ToastProvider'
import { RandomizeButton } from './RandomizeButton'
import { useThemeBuilderStore } from './store/ThemeBuilderStore'

export const StudioAIBar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const store = useThemeBuilderStore()
  const user = useUser()
  const [isGenerating, setGenerating] = useState<'reply' | 'new' | null>(null)
  const themeName = useThemeName()
  const [lastReply, setLastReply] = useState('')
  const hasAccess =
    user.data?.accessInfo.hasBentoAccess || user.data?.accessInfo.hasTakeoutAccess

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
      let model = ''

      if (prompt[0] === '!') {
        const space = prompt.indexOf(' ')
        if (space > 0) {
          model = prompt.slice(1, space)
          prompt = prompt.slice(space)
        }
      }

      const res = await fetch(`/api/theme/generate`, {
        body: JSON.stringify({
          prompt,
          lastReply,
          scheme: themeName.startsWith('dark') ? 'dark' : 'light',
          model,
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

      setLastReply(data.reply)
      store.updateGenerate(data.result)
      toastController.show(`Generated!`)
    } catch (err) {
      toastController.show(`Error: ${err}`)
    } finally {
      setGenerating(null)
      clearInterval(int)
    }
  }

  return (
    <XStack zi={1000} data-tauri-drag-region className="all ease-in ms300">
      <XStack fw="wrap" ai="center" f={1} gap="$3">
        <Input
          ref={inputRef as any}
          placeholder={`Prompt to generate a theme...`}
          miw={300}
          f={10}
          size="$6"
          shadowColor="$shadow3"
          shadowOffset={{ height: 2, width: 0 }}
          shadowRadius={20}
          br="$8"
          onSubmit={() => {
            generate(lastReply ? 'reply' : 'new')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              generate('new')
            }
          }}
        />
        {/* {lastReply && (
          <Theme name="surface1">
            <Button
              br="$10"
              disabled={isGenerating === 'reply'}
              o={isGenerating === 'reply' ? 0.2 : 1}
              pe={isGenerating === 'reply' ? 'none' : 'auto'}
              icon={isGenerating === 'reply' ? <Spinner size="small" /> : null}
              onPress={() => generate('reply')}
              size="$4"
            >
              Refine
            </Button>
          </Theme>
        )} */}
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
                  toastController.show(
                    `This is mostly an experiment, it's gated behind purchase of Takeout or Bento for now.`
                  )
                }
              }}
              size="$4"
            >
              {hasAccess ? 'Generate' : 'Access'}
            </Button>

            <RandomizeButton />
          </Theme>

          <ThemeToggle />
        </XStack>
      </XStack>
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
          outlineWidth={2}
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
