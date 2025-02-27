import { Input } from '@tamagui/input'
import { Moon, Sun } from '@tamagui/lucide-icons'
import { animationsCSS } from '@tamagui/tamagui-dev-config'
import { useColorScheme } from '@vxrn/color-scheme'
import { memo, useEffect, useRef, useState } from 'react'
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
import { Select } from '../../../components/Select'
import { purchaseModal } from '../../site/purchase/NewPurchaseModal'
import { useUser } from '../../user/useUser'
import { toastController } from '../ToastProvider'
import { RandomizeButton } from './RandomizeButton'
import { themeBuilderStore } from './store/ThemeBuilderStore'
import { defaultModel, generateModels, type ModelNames } from '../../api/generateModels'

export const StudioAIBar = memo(() => {
  const [model, setModel] = useState(defaultModel)
  const inputRef = useRef<HTMLInputElement>(null)
  const user = useUser()
  const [isGenerating, setGenerating] = useState<'reply' | 'new' | null>(null)
  const themeName = useThemeName()
  const [lastReply, setLastReply] = useState('')
  const [lastPrompt, setLastPrompt] = useState('')
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

      setLastReply(data.reply)
      setLastPrompt(prompt)
      themeBuilderStore.updateGenerate(data.result)
      toastController.hide()
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
        <XStack miw={300} f={10}>
          <Input
            ref={inputRef as any}
            f={1}
            placeholder={`Generate a theme`}
            size="$6"
            shadowColor="$shadow3"
            bg="$color4"
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
              {hasAccess ? 'Generate' : 'Access'}
            </Button>

            <RandomizeButton />
          </Theme>

          <ThemeToggle />
        </XStack>
      </XStack>
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
