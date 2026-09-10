import { Square, Text, Theme, useThemeName, YStack } from 'tamagui'

function ThemeName({ testID }: { testID: string }) {
  return (
    <Text id={testID} testID={testID} color="color">
      {String(useThemeName())}
    </Text>
  )
}

function Surface({ testID }: { testID: string }) {
  return <Square id={testID} testID={testID} size={24} backgroundColor="background" />
}

// inverse under each scheme, next to a reference painted with the opposite
// scheme named outright. the two have to match: `inverse` means "the other
// scheme", so comparing against an explicitly named theme is what says it
// resolved rather than silently falling through to its parent.
function SchemeInverse({ scheme }: { scheme: 'light' | 'dark' }) {
  return (
    <Theme name={scheme}>
      <YStack gap="2" padding="3" backgroundColor="background">
        <Surface testID={`${scheme}-base`} />
        <Theme name="inverse">
          <YStack gap="2" padding="3" backgroundColor="background">
            <ThemeName testID={`${scheme}-inverse-name`} />
            <Surface testID={`${scheme}-inverse`} />
            <Theme name="level2">
              <Surface testID={`${scheme}-inverse-level2`} />
            </Theme>
          </YStack>
        </Theme>
      </YStack>
    </Theme>
  )
}

function Reference({ scheme }: { scheme: 'light' | 'dark' }) {
  return (
    <Theme name={scheme}>
      <Surface testID={`${scheme}-reference`} />
      <Theme name="level2">
        <Surface testID={`${scheme}-reference-level2`} />
      </Theme>
    </Theme>
  )
}

// the runtime emits the full resolved class (`t_light_inverse`), which has a
// selector of its own and therefore resolves even when the relative light/dark
// selectors are wrong. markup carrying only the short class depends entirely on
// those relative selectors, so that is the only place a misclassified alias
// shows up. the compiler's extracted output and older runtimes both emit the
// short form, which is how this reached a real app.
function ShortClasses() {
  const surface = { width: 24, height: 24, background: 'var(--background)' }
  return (
    <div>
      <div className="t_light">
        <div id="short-light-inverse" className="t_inverse" style={surface} />
      </div>
      <div className="t_dark">
        <div id="short-dark-inverse" className="t_inverse" style={surface} />
      </div>
      <div id="short-light" className="t_light" style={surface} />
      <div id="short-dark" className="t_dark" style={surface} />
    </div>
  )
}

export function ThemeInverse() {
  return (
    <YStack gap="4" padding="4" testID="theme-inverse-root">
      <SchemeInverse scheme="light" />
      <SchemeInverse scheme="dark" />
      <Reference scheme="light" />
      <Reference scheme="dark" />
      <ShortClasses />
    </YStack>
  )
}
