import { X } from '@tamagui/lucide-icons-2'
import { Dialog, Paragraph, ScrollView, Sheet, Unspaced, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { Link } from '~/components/Link'
import { ProPolicy } from '../../pro/ProPolicy'
import { useTakeoutStore } from './useTakeoutStore'

export const ProPoliciesModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showProPolicies}
      onOpenChange={(val) => {
        store.showProPolicies = val
      }}
    >
      <Dialog.Adapt when="maxMd">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Container p="8">
            <Sheet.Background />
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Container>
          <Sheet.Overlay bg="shadow4" transition="lazy" opacity="enter:0 exit:0" />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          transition="medium"
          opacity="enter:0 exit:0"
          className="blur-medium"
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          transition={['quick', { opacity: { overshootClamping: true } }]}
          y="enter:-10px exit:10px"
          opacity="enter:0 exit:0"
          scale="enter:0.975 exit:0.975"
          width="90%"
          maxW={900}
        >
          <ScrollView>
            <YStack maxH="gtSm:90vh" gap="4">
              <Paragraph>
                <Link href="/pro-policy">Permalink to policies</Link>.
              </Paragraph>

              <ProPolicy />
            </YStack>
          </ScrollView>
          <Unspaced>
            <Dialog.Close asChild>
              <Button position="absolute" t="2" r="2" size="3" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
