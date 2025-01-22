import { X } from '@tamagui/lucide-icons'
import { Link } from '~/components/Link'
import { Button, Dialog, Paragraph, ScrollView, Sheet, Unspaced, YStack } from 'tamagui'
import { BentoLicense } from '../../bento/BentoLicense'
import { TakeoutLicense } from '../../takeout/TakeoutLicense'
import { useTakeoutStore } from './useTakeoutStore'

export const TakeoutAgreementModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showTakeoutAgreement}
      onOpenChange={(val) => {
        store.showTakeoutAgreement = val
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
            bg="$shadow4"
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
                <Link href="/takeout-license">Permalink to the license</Link>.
              </Paragraph>

              <TakeoutLicense />
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

export const BentoAgreementModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showBentoAgreement}
      onOpenChange={(val) => {
        store.showBentoAgreement = val
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
            bg="$shadow4"
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
                <Link href="/bento-license">Permalink to the license</Link>.
              </Paragraph>

              <BentoLicense />
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
