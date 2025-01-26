import { YStack } from 'tamagui'

// import { getCode } from '../../components/forms/switches'
import { Showcase } from '../../components/general/_Showcase'
import * as Navbars from '../../components/shells/navbars'

type Props = ReturnType<typeof navbarsGetComponentCodes>
export function navbars(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase
        fileName={Navbars.TopNavBarWithLogo.fileName}
        title="Top Navbar with Swippable Drawer on Smaller Screens"
      >
        <Navbars.TopNavBarWithLogo />
      </Showcase>
      <Showcase
        fileName={Navbars.TopNavBarWithUnderLineTabs.fileName}
        title="Top Navbar with Underline Tabs"
      >
        <Navbars.TopNavBarWithUnderLineTabs />
      </Showcase>
    </YStack>
  )
}

export function navbarsGetComponentCodes() {
  return {
    codes: {
      TopNavBarWithLogo: '',
      TopNavBarWithUnderLineTabs: '',
    } as Omit<Record<keyof typeof Navbars, string>, 'getCode'>,
  }
}
