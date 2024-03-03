import { Paintbrush, X } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { useEffect, useState } from 'react'
import type { TamaguiConfig } from 'tamagui'
import { Button, Dialog, H2, Paragraph, ScrollView, TooltipSimple, YStack } from 'tamagui'
import { Code, CodeInline } from './Code'
import { Features } from './Features'
import { Notice } from './Notice'

type TamaguiConfigBuilt = {
  tamaguiConfig: TamaguiConfig
}

class DropTamaguiConfigStore {
  config: TamaguiConfigBuilt | null = null
  dragging = false
}

export const DropTamaguiConfig = () => {
  const [show, setShow] = useState(false)
  const store = useStore(DropTamaguiConfigStore)

  useEffect(() => {
    document.addEventListener('dragover', (e) => {
      store.dragging = true
      e.preventDefault()
    })

    document.addEventListener('dragleave dragend', (e) => {
      store.dragging = false
    })

    document.addEventListener('drop', (e) => {
      store.dragging = false
      e.preventDefault()
      if (e.dataTransfer?.items) {
        ;[...e.dataTransfer.items].forEach((item, i) => {
          if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
              const reader = new FileReader()
              reader.onload = () => {
                store.config = JSON.parse(`${reader.result}`)
              }
              reader.readAsText(file)
            }
          }
        })
      }
    })
  }, [])

  return (
    <>
      <TooltipSimple label="Upload your Tamagui Config">
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
        >
          Customize
        </Button>
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
            // animateOnly={['transform']}
            enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
            exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
            w="95%"
            maw={600}
            p="$6"
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
              o={store.dragging ? 1 : 0}
              bg="$background075"
              ai="center"
              jc="center"
              zi={1000}
            >
              <H2>Drop it here!</H2>
            </YStack>

            <ScrollView mah={`90vh`}>
              <YStack gap="$4">
                <Dialog.Title>Your Design System</Dialog.Title>

                {store.config && (
                  <>
                    <Paragraph size="$6">Nice, we've got your config.</Paragraph>
                    <Paragraph size="$6">
                      You can now go copy code from an example and we will adapt the
                      copy-paste code to use your tokens.
                    </Paragraph>
                    <Button
                      als="flex-end"
                      icon={X}
                      theme="red_active"
                      onPress={() => (store.config = null)}
                    >
                      Clear config
                    </Button>
                  </>
                )}

                {!store.config && (
                  <>
                    <Paragraph size="$6">
                      Drag and drop your{' '}
                      <CodeInline>.tamagui/tamagui.config.json</CodeInline> here to
                      customize the code we generate to your design system!
                    </Paragraph>
                    <Paragraph size="$6">
                      If you have a compiler plugin installed, this is done for your
                      automatically. If not, use the CLI.
                    </Paragraph>
                    <Paragraph size="$6">
                      But first, set up a <CodeInline>tamagui.build.ts</CodeInline>:
                    </Paragraph>

                    <Features
                      items={[
                        <>
                          Create a <CodeInline>tamagui.build.ts</CodeInline> at the root
                          of your app and move your build configuration into it as a
                          default export.{' '}
                          <a
                            target="_blank"
                            href="https://github.com/tamagui/tamagui/blob/c42cab421edf911f8a30eb8172102f39938c7614/apps/site/tamagui.build.ts#L8-L9"
                            rel="noreferrer"
                          >
                            See an example here
                          </a>
                          . All of the bundler plugins will now load from this file on
                          startup.
                        </>,
                        <>
                          If not using a compiler plugin, run generate —{' '}
                          <Code>npx @tamagui/cli generate</Code>
                        </>,
                        <>
                          Drop the generated <Code>.tamagui/tamagui.config.json</Code> on
                          this window.
                        </>,
                      ]}
                    />

                    <Notice>
                      WIP - we're adding the final piece to replace tokens next.
                    </Notice>
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
