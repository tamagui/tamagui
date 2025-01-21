import { Input } from '@tamagui/input'
import { useRef, useState } from 'react'
import { Button, Spinner, Theme, XStack } from 'tamagui'
import { toastController } from '../ToastProvider'
import { useThemeBuilderStore } from './store/ThemeBuilderStore'

export const StudioAIBar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const store = useThemeBuilderStore()
  const [isGenerating, setGenerating] = useState(false)

  const generate = async () => {
    toastController.show(`Generating...`)
    setGenerating(true)

    let seconds = 0

    const int = setInterval(() => {
      seconds++
      if (seconds === 8) {
        toastController.show(`Thinking about base colors...`)
      } else if (seconds === 16) {
        toastController.show(`Thinking about accent colors...`)
      } else if (seconds === 24) {
        toastController.show(`Refining palettes...`)
      } else if (seconds === 32) {
        toastController.show(`Taking too long...`)
      } else if (seconds === 48) {
        toastController.show(`It really does take a bit sometimes...`)
      }
    }, 1000)

    try {
      const res = await fetch(`/api/theme/generate`, {
        body: JSON.stringify({
          prompt: inputRef.current?.value ?? '',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = await res.json()

      if (data.error) {
        toastController.show(`Error generating! ${data.error}`)
        return
      }

      store.updateGenerate(data.result)
    } catch (err) {
      toastController.show(`Error: ${err}`)
    } finally {
      setGenerating(false)
      clearInterval(int)
    }
  }

  return (
    <XStack
      zi={1000}
      data-tauri-drag-region
      className="all ease-in ms300"
      my="$4"
      ml="$6"
      mr="$12"
      $gtMd={{
        mr: 580,
      }}
    >
      <XStack f={1} gap="$6">
        <Input
          ref={inputRef as any}
          placeholder="Prompt to generate a custom theme suite with AI..."
          w="100%"
          f={10}
          size="$6"
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
