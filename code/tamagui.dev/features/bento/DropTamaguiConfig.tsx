import { Paintbrush, X } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
// import { useLocalStorage } from 'foxact/use-local-storage'
import {
  Button,
  Dialog,
  H2,
  Paragraph,
  ScrollView,
  Theme,
  TooltipSimple,
  YStack,
} from 'tamagui'
import { Features } from '~/components/Features'
import { Code, CodeInline } from '~/components/Code'
import { useLocalStorageWatcher } from '~/hooks/useLocalStorageWatcher'

export const DropTamaguiConfig = () => {
  const [show, setShow] = useState(false)
  const config = useLocalStorageWatcher('userTamaguiConfig', '')
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const handleDrop = (e) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer?.items) {
        ;[...e.dataTransfer.items].forEach((item) => {
          if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
              const reader = new FileReader()
              reader.onload = () => {
                config.setItem(JSON.stringify(JSON.parse(`${reader.result}`)))
              }
              reader.readAsText(file)
            }
          }
        })
      }
    }

    document.addEventListener('dragover', (e) => {
      e.preventDefault()
      setDragging(true)
    })

    document.addEventListener('dragleave', () => setDragging(false))
    document.addEventListener('dragend', () => setDragging(false))
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragover', (e) => setDragging(true))
      document.removeEventListener('dragleave', () => setDragging(false))
      document.removeEventListener('dragend', () => setDragging(false))
      document.removeEventListener('drop', handleDrop)
    }
  }, [])

  return (
    <>
      <TooltipSimple label="Upload your Tamagui Config">
        <Theme name={config ? 'green' : 'accent'}>
          <Button
            als="flex-end"
            br="$10"
            onPress={() => setShow(true)}
            size="$3"
            chromeless
            $sm={{
              dsp: 'none',
            }}
            icon={Paintbrush}
            color={config ? '$green10' : '$color12'}
          >
            {config ? 'Customization enabled' : 'Customize'}
          </Button>
        </Theme>
      </TooltipSimple>

      <Dialog open={show} onOpenChange={setShow}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="medium"
            className="blur-medium"
            opacity={0.5}
            bg="$color1"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            bg="$color2"
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
            exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
            w="95%"
            maw={600}
            p="$8"
          >
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$4"
                right="$4"
                size="$2"
                circular
                zi={1000}
                icon={X}
              />
            </Dialog.Close>

            <YStack
              fullscreen
              pe="none"
              o={dragging ? 1 : 0}
              bg="$background06"
              ai="center"
              jc="center"
              zi={1000}
            >
              <H2>Drop it here!</H2>
            </YStack>

            <ScrollView mah={`90vh`}>
              <YStack gap="$4">
                <Dialog.Title>Your Design System</Dialog.Title>

                {config.storageItem && (
                  <>
                    <Paragraph size="$4">Nice, we've got your config.</Paragraph>
                    <Paragraph size="$4">
                      You can now go copy code from any component and we will adapt the
                      copy-paste code to use your tokens.
                    </Paragraph>
                    <Button
                      als="flex-end"
                      icon={X}
                      theme="red"
                      onPress={() => config.setItem('')}
                    >
                      Clear config
                    </Button>
                  </>
                )}

                {!config.storageItem && (
                  <>
                    <Paragraph size="$4">
                      Drag and drop your{' '}
                      <CodeInline>.tamagui/tamagui.config.json</CodeInline> here to
                      customize the code we generate to your design system!
                    </Paragraph>
                    <Paragraph size="$4">
                      If you have a compiler plugin installed, this is done for you
                      automatically. If not, use the CLI.
                    </Paragraph>
                    <Paragraph size="$4">
                      But first, set up a <CodeInline>tamagui.build.ts</CodeInline>:
                    </Paragraph>

                    <Features
                      items={[
                        // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                        <>
                          Create a <CodeInline>tamagui.build.ts</CodeInline> at the root
                          of your app and move your build configuration into it as a
                          default export. All of the bundler plugins load from this file
                          on startup.
                        </>,
                        // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                        <>
                          If not using a compiler plugin, run generate —{' '}
                          <Code>npx @tamagui/cli generate</Code>
                        </>,
                        // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                        <>
                          Drop the generated <Code>.tamagui/tamagui.config.json</Code> on
                          this window.
                        </>,
                      ]}
                    />
                  </>
                )}
              </YStack>
            </ScrollView>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
