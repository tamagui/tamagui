import { Paragraph, TamaguiProvider, Text, Theme, View, styled } from 'tamagui'
import config from '../tamagui.config'

// A second app-authored module also contributes compiler atomic CSS, so the
// artifact's collection order is observable across more than one module.
import { GlobalPanel } from './GlobalPanel'

const Badge = styled(View, {
  name: 'GlobalBadge',
  backgroundColor: '#1d4ed8',
  width: 91,
  height: 17,
})

/**
 * The compiled-global-CSS tier: ordinary compiled Tamagui with a provider and
 * the full runtime, plus the owned outputCSS artifact. Runtime CSS generation is
 * compiled out, so everything here renders from the loaded stylesheets and the
 * provider's own inject has nothing left to emit.
 */
export function GlobalApp() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <View data-testid="global-root" padding={24} gap={12}>
        <Text data-testid="global-text" fontSize={23} color="$color">
          compiled global css fixture
        </Text>
        <Paragraph data-testid="global-font">font rules come from the artifact</Paragraph>
        <Badge data-testid="global-badge" />
        <Theme name="dark">
          <View data-testid="global-dark" backgroundColor="$background" padding={7}>
            <Text data-testid="global-dark-text" color="$color">
              dark theme
            </Text>
          </View>
        </Theme>
        <GlobalPanel />
      </View>
    </TamaguiProvider>
  )
}
