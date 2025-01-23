import { Input } from '@tamagui/input'
import { startTransition, useRef, useState } from 'react'
import {
  Button,
  Configuration,
  Spinner,
  Theme,
  useThemeName,
  XStack,
  YStack,
} from 'tamagui'
import { toastController } from '../ToastProvider'
import { useThemeBuilderStore } from './store/ThemeBuilderStore'
import { RandomizeButton } from './RandomizeButton'
import { Moon, Sun } from '@tamagui/lucide-icons'
import { Switch } from 'tamagui'
import { useUserTheme } from '@tamagui/one-theme'
import { animationsCSS } from '../../../config/animations.css'

export const StudioAIBar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const store = useThemeBuilderStore()
  const [isGenerating, setGenerating] = useState<'reply' | 'new' | null>(null)
  const themeName = useThemeName()
  const [lastReply, setLastReply] = useState('')

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
      if (seconds === 6) {
        toastController.show(`Thinking about base colors...`)
      } else if (seconds === 12) {
        toastController.show(`Thinking about accent colors...`)
      } else if (seconds === 18) {
        toastController.show(`Refining palettes...`)
      } else if (seconds === 24) {
        toastController.show(`Taking too long...`)
      } else if (seconds === 32) {
        toastController.show(`It really does take a bit sometimes...`)
      }
    }, 1000)

    try {
      const prompt = inputRef.current?.value ?? ''
      const res = await fetch(`/api/theme/generate`, {
        body: JSON.stringify({
          prompt,
          lastReply: type === 'new' ? '' : lastReply,
          scheme: themeName.startsWith('dark') ? 'dark' : 'light',
          model: prompt[0] === '!' ? 'reasoning' : 'chat',
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
    } catch (err) {
      toastController.show(`Error: ${err}`)
    } finally {
      toastController.hide()
      toastController.show(`Generated!`)
      setGenerating(null)
      clearInterval(int)
    }
  }

  return (
    <XStack zi={1000} data-tauri-drag-region className="all ease-in ms300">
      <XStack ai="center" f={1} gap="$3">
        <Input
          ref={inputRef as any}
          placeholder={`Prompt to generate a theme...`}
          w="100%"
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
        {lastReply && (
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
        )}
        <Theme name="accent">
          <Button
            br="$10"
            disabled={isGenerating === 'new'}
            o={isGenerating === 'new' ? 0.2 : 1}
            pe={isGenerating === 'new' ? 'none' : 'auto'}
            icon={isGenerating === 'new' ? <Spinner size="small" /> : null}
            onPress={() => generate('new')}
            size="$4"
          >
            New
          </Button>

          <RandomizeButton />
        </Theme>

        <ThemeToggle />
      </XStack>
    </XStack>
  )
}

const ThemeToggle = () => {
  const [{ userTheme }, setUserTheme] = useUserTheme()
  const [checked, setChecked] = useState(userTheme === 'light')
  return (
    <XStack gap="$3" ai="center">
      <Configuration animationDriver={animationsCSS}>
        <Switch
          checked={checked}
          pressStyle={{
            bg: '$color2',
          }}
          onCheckedChange={(on) => {
            setChecked(on)
            setTimeout(() => {
              startTransition(() => {
                setUserTheme(on ? 'light' : 'dark')
              })
            })
          }}
          size="$3"
        >
          <Switch.Thumb animation="75ms" size="$3">
            <YStack
              animation="bouncy"
              fullscreen
              ai="center"
              jc="center"
              o={1}
              y={0}
              $theme-light={{ o: 0, y: 3 }}
            >
              <Sun size={14} />
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
              <Moon size={14} />
            </YStack>
          </Switch.Thumb>
        </Switch>
      </Configuration>
    </XStack>
  )
}
