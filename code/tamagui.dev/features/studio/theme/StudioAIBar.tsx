import { Input } from '@tamagui/input'
import { useRef, useState } from 'react'
import { Button, Spinner, Theme, useThemeName, XStack } from 'tamagui'
import { toastController } from '../ToastProvider'
import { useThemeBuilderStore } from './store/ThemeBuilderStore'

export const StudioAIBar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const store = useThemeBuilderStore()
  const [isGenerating, setGenerating] = useState(false)
  const themeName = useThemeName()

  const generate = async () => {
    toastController.show(`Generating...`)
    setGenerating(true)

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

      store.updateGenerate(data.result)
    } catch (err) {
      toastController.show(`Error: ${err}`)
    } finally {
      toastController.hide()
      toastController.show(`Generated!`)
      setGenerating(false)
      clearInterval(int)
    }
  }

  return (
    <XStack zi={1000} data-tauri-drag-region className="all ease-in ms300">
      <XStack f={1} gap="$3">
        <Input
          ref={inputRef as any}
          placeholder="Prompt to generate themes with AI..."
          w="100%"
          f={10}
          size="$6"
          shadowColor="$shadow3"
          shadowOffset={{ height: 2, width: 0 }}
          shadowRadius={20}
          br="$8"
          onSubmit={generate}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              generate()
            }
          }}
        />
        <Theme name="accent">
          <Button
            disabled={isGenerating}
            o={isGenerating ? 0.2 : 1}
            pe={isGenerating ? 'none' : 'auto'}
            icon={isGenerating ? <Spinner size="small" /> : null}
            onPress={generate}
            size="$6"
          >
            Generate
          </Button>
        </Theme>
      </XStack>
    </XStack>
  )
}
