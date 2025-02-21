import { X } from '@tamagui/lucide-icons'
import { Link } from '~/components/Link'
import {
  Button,
  Dialog,
  H1,
  H3,
  Paragraph,
  ScrollView,
  Sheet,
  Unspaced,
  YStack,
  styled,
} from 'tamagui'
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

export const ProAgreementModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showProAgreement}
      onOpenChange={(val) => {
        store.showProAgreement = val
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
                <Link href="/pro-license">Permalink to the license</Link>.
              </Paragraph>

              <YStack gap="$4" p="$4">
                <H1 $sm={{ size: '$8' }}>License Agreement</H1>

                <Paragraph>
                  Tamagui Pro License grants you a non-exclusive license and permission to
                  use the Tamagui LLC Pro features and services based on your subscription
                  plan.
                </Paragraph>

                <Paragraph>
                  Tamagui Pro License grants permission to one individual to access the
                  Takeout Github repository and the Bento components via tamagui.dev. You
                  are free to use Takeout to build as many apps as you please, and to use
                  Bento components in as many projects as you please.
                </Paragraph>

                <Paragraph>
                  For Bento - you are free to use and the source code in unlimited
                  projects and publish it publicly, but we ask you do not re-publish the
                  majority of the components in one place. Other developers may
                  collaborate on the source code without a license.
                </Paragraph>

                <Paragraph>
                  For Takeout - you cannot re-publish any of the source code publicly. If
                  you are collaborating on the source code with other developers, then all
                  developers who commit to the repository within the last 3 months must
                  also have a license.
                </Paragraph>

                <H3>License Terms</H3>

                <Paragraph>You can:</Paragraph>

                <Paragraph>
                  <Ul>
                    <Li>
                      Use all Pro features including Theme Builder, Bento, and Takeout, in
                      your projects.
                    </Li>
                    <Li>
                      Use Pro features in both commercial and non-commercial projects.
                    </Li>
                    <Li>
                      Access Discord community and support channels based on your
                      subscription tier.
                    </Li>
                  </Ul>
                </Paragraph>

                <Paragraph>You cannot:</Paragraph>

                <Paragraph>
                  <Ul>
                    <Li>Share your Pro account credentials with any other individual.</Li>
                    <Li>
                      Redistribute or resell Pro features or components as standalone
                      products.
                    </Li>
                    <Li>
                      Create and distribute derivative products based on Pro features
                      without permission.
                    </Li>
                  </Ul>
                </Paragraph>

                <H3>License Definitions</H3>

                <Paragraph>
                  <Ul>
                    <Li>
                      Licensee is a person or a business entity who has purchased a Pro
                      subscription.
                    </Li>
                    <Li>
                      Pro features are the components, tools, and services made available
                      to the Licensee after purchasing a Tamagui Pro subscription.
                    </Li>
                    <Li>
                      Employee is a full-time or part-time employee of the Licensee.
                    </Li>
                    <Li>
                      Contractor is an individual or business entity contracted to perform
                      services for the Licensee.
                    </Li>
                  </Ul>
                </Paragraph>

                <H3>Liability</H3>

                <Paragraph>
                  Tamagui LLC's liability to you for costs, damages, or other losses
                  arising from your use of the Pro features — including third-party claims
                  against you — is limited to a refund of your subscription fee. Tamagui
                  LLC may not be held liable for any consequential damages related to your
                  use of the Pro features. The ownership of the Pro features remains with
                  the Tamagui LLC development team. You are required to abide by the
                  licensing terms to avoid termination in case of non-compliance with the
                  agreed terms.
                </Paragraph>

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

const Ul = styled(YStack, {
  name: 'ul',
  tag: 'ul',
  paddingLeft: 20,
})

const Li = styled(Paragraph, {
  name: 'li',
  tag: 'li',
  // @ts-ignore
  display: 'list-item',
})
