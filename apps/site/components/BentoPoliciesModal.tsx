import { X } from '@tamagui/lucide-icons'
import Link from 'next/link'
import { ScrollView } from 'react-native'
import { Button, Dialog, Sheet, YStack, Paragraph, Unspaced } from 'tamagui'
import { useBentoStore } from '../hooks/useBentoStore'
import { TakeoutPolicy } from './TakeoutPolicy'
import BentoPolicy from '../pages/bento-policy'

export const BentoPoliciesModal = () => {
  const store = useBentoStore()
  return (
    <Dialog
      modal
      open={store.showPolicies}
      onOpenChange={(val) => {
        store.showPolicies = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="medium"
          className="blur-medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
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
          w="90%"
          maw={900}
        >
          <ScrollView>
            <YStack $gtSm={{ maxHeight: '90vh' }} space>
              <Paragraph>
                <Link href="/bento-policy">Permalink to policies</Link>.
              </Paragraph>

              <BentoPolicy />
            </YStack>
          </ScrollView>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$2"
                right="$2"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
