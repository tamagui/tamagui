import { X } from '@tamagui/lucide-icons'
import {
  Button,
  Dialog,
  H1,
  H5,
  Paragraph,
  ScrollView,
  Sheet,
  Unspaced,
  XStack,
  YStack,
} from 'tamagui'

import { useTakeoutStore } from './useTakeoutStore'

export const TakeoutFaqModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showTakeoutFaq}
      onOpenChange={(val) => {
        store.showTakeoutFaq = val
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
            <YStack $gtSm={{ maxHeight: '90vh' }}>
              <H1 px="$4" $sm={{ size: '$8' }}>
                Frequently Asked Questions
              </H1>
              <XStack mt="$4" flexWrap="wrap" gap="$6" p="$4">
                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>How difficult is Takeout to develop on?</H5>

                  <Paragraph>
                    We encourage our customers to try the free starter repo with "npm
                    create tamagui" to get a feel for how Takeout works at the base.
                    Takeout is based on that code, just adding many features and
                    refinements.
                  </Paragraph>

                  <Paragraph>
                    Takeout is not designed for a beginner to React or React Native,
                    instead it attempts to delivery a very high quality stack at the
                    expense of some simplicity. If you try the free starter and find it to
                    be comfortable, then Takeout will be an easy transition. If not, then
                    Takeout may not be a good choice for you.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>What development platforms do you support?</H5>

                  <Paragraph>
                    We support MacOS versions within the last three years, or for Android
                    and Web only, the most recent version of Windows. Linux should work,
                    but is not officially supported.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>Can I still use the starter after my subscription has ended?</H5>
                  <Paragraph>
                    Of course! the subscription is only for the bot updates. If you cancel
                    your subscription you will stop receiving updates but can still use
                    your starter.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>Can I suggest a feature for the upcoming updates?</H5>
                  <Paragraph>
                    Yes. You will have access to an exclusive Discord channel in which you
                    can chat directly with the creators of the template, suggest features,
                    ask questions and so forth.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>Is there a refund policy?</H5>
                  <Paragraph>
                    No, to prevent abuse we have a no refund policy, but reach out to us
                    if you are non-profit or a student with a .edu email address if you
                    would like a discount.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>
                    Can I use some of the features? What about merge conflicts with the
                    bot?
                  </H5>
                  <Paragraph>
                    Yes. We've designed the repo to be as well isolated as possible. We
                    are working on settings for takeout.json that let you configure which
                    types of updates you'd like to receive.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>How does the GitHub bot work?</H5>
                  <Paragraph>
                    Whenever we make changes to the starter, we may trigger the bot to
                    send update PRs to all the repositories that have the bot installed
                    and have an active subscription. You may tweak the changes on the PR
                    and merge, or just disable it if you want to.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>How often does the bot trigger updates?</H5>
                  <Paragraph>
                    We do this manually to avoid constant PRs and try to schedule them at
                    most once a week. We're also working on a UI for users to manually
                    trigger older updates in case they've missed them.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>What are the next steps after I purchase the starter?</H5>
                  <Paragraph>
                    You will see the full instructions after purchase. You can gain access
                    to the source code repository on GitHub, which allows you to install
                    the starter through the create-tamagui CLI. Simply run `yarn create
                    tamagui --template=takeout-starter` and follow the steps.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>
                    What are the next steps after I purchase the font/icon packages?
                  </H5>
                  <Paragraph>
                    You will see the full instructions after purchase. You can gain access
                    to the source code of icon or font packages on GitHub, which allows
                    you to install packages through the `@tamagui/cli` package. Simply
                    install the cli and run `yarn tamagui add icon` or `yarn tamagui add
                    font` and follow the steps to install the packages.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>Can I use the Takeout starter for an open-source project?</H5>
                  <Paragraph>
                    You aren't allowed to publish the source-code to the public. So no,
                    you can't use the starter for an open-source project.
                  </Paragraph>
                </YStack>

                <YStack gap="$4" f={1} fb={0} minWidth={300}>
                  <H5>How many projects can I use this for?</H5>
                  <Paragraph
                    cursor="pointer"
                    textDecorationLine="underline"
                    onPress={() => {
                      store.showTakeoutAgreement = true
                    }}
                  >
                    See License
                  </Paragraph>
                </YStack>

                {/*
            <YStack gap="$4" f={1} fb={0} minWidth={300}>
              <H5 >
                Can I get auto-updates if I have my repository on a git server that
                doesn't support GitHub bots?
              </H5>
              <Paragraph>
                You can't use the bot outside of GitHub but you can write a custom
                script / workflow to look for new changes on the repository source and
                create PRs.
              </Paragraph>
            </YStack> */}
              </XStack>
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
