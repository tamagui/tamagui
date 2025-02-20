import { X } from '@tamagui/lucide-icons'
import {
  Button,
  Dialog,
  Paragraph,
  ScrollView,
  Sheet,
  Unspaced,
  YStack,
  H3,
  H1,
  Separator,
} from 'tamagui'
import { TakeoutPolicy } from '../../takeout/TakeoutPolicy'
import { useTakeoutStore } from './useTakeoutStore'
import { BentoPolicy } from '../../bento/BentoPolicy'
import { Link } from '~/components/Link'

export const TakeoutPoliciesModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showTakeoutPolicies}
      onOpenChange={(val) => {
        store.showTakeoutPolicies = val
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
                <Link href="/takeout-policy">Permalink to policies</Link>.
              </Paragraph>

              <TakeoutPolicy />
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

export const BentoPoliciesModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showBentoPolicies}
      onOpenChange={(val) => {
        store.showBentoPolicies = val
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
                <Link href="/privacy">Permalink to policies</Link>.
              </Paragraph>

              <YStack gap="$4" p="$4">
                <H1 $sm={{ size: '$8' }}>Fulfillment Policies</H1>

                <H3>Delivery</H3>

                <Paragraph>
                  Tamagui LLC will deliver to you access to Tamagui Pro features including
                  Theme Builder, advanced components, and priority updates. You also get
                  access to our Discord community for support and discussions.
                </Paragraph>

                <H3>Returns and Refunds</H3>

                <Paragraph>
                  Tamagui Pro is not able to be returned as it is digital software. For
                  this reason we have a limited return policy in order to protect
                  ourselves from abuse.
                </Paragraph>

                <Paragraph>
                  Within the first 48 hours of your purchase, email us at
                  support@tamagui.dev with any issues you have with Pro features not
                  working as advertised.
                </Paragraph>

                <H3>Cancellation</H3>

                <Paragraph>
                  The Pro subscription is yearly at the rate of the purchase price. It
                  will maintain your access to Pro features and Discord community. You may
                  cancel this at any time from your account by going to Subscriptions and
                  then hitting "Cancel," or you can email us at support@tamagui.dev.
                </Paragraph>

                <Separator />

                <Paragraph>
                  For any further questions{' '}
                  <a href="mailto:support@tamagui.dev">send us an email</a>.
                </Paragraph>
              </YStack>
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
