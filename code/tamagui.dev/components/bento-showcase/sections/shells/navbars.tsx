import { YStack } from 'tamagui'

import { Showcase } from '~/components/bento-showcase/_Showcase'
import * as Navbars from '@tamagui/bento/component/shells/navbars'

type Props = ReturnType<typeof navbarsGetComponentCodes>

export function navbars() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
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

      <Showcase fileName={Navbars.FullSideBar.fileName} title="Responsive Sidebar">
        <Navbars.FullSideBar />
      </Showcase>
    </YStack>
  )
}

export function navbarsGetComponentCodes() {
  return {
    codes: {
      TopNavBarWithLogo: '',
      TopNavBarWithUnderLineTabs: '',
      FullSideBar: '',
    } as Omit<Record<keyof typeof Navbars, string>, 'getCode'>,
  }
}
