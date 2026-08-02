import { Theme, View, YStack } from 'tamagui'

/**
 * The program block cascade, as browser-visible behaviour.
 *
 * Every clause of a program has equal specificity and emitted rule order is
 * authored clause order, so the last matching clause wins. That is what makes
 * web resolution agree with native's last-matching-clause evaluation, and it is
 * the reason the encoding needs no specificity ladder. These were probed once
 * in Chromium; here they are as tests, so WebKit gets checked too.
 */
export function ProgramCascadeCase() {
  const chain =
    'rgb(255, 0, 0) hover:rgb(0, 255, 0) dark:rgb(128, 128, 128) dark:hover:rgb(0, 0, 255)'

  return (
    <YStack gap="4" p="4">
      {/* the same program in two themes: which clause is last-matching differs */}
      <View data-testid="chain-light" width={60} height={60} backgroundColor={chain} />

      <Theme name="dark">
        <View data-testid="chain-dark" width={60} height={60} backgroundColor={chain} />
      </Theme>

      {/* a media clause authored after the base: it wins where it matches and
          the base wins everywhere else, which is source order deciding rather
          than the media query carrying extra weight */}
      <View
        data-testid="base-then-media"
        width={60}
        height={60}
        backgroundColor="rgb(128, 0, 0) max-sm:rgb(0, 128, 0)"
      />
    </YStack>
  )
}
