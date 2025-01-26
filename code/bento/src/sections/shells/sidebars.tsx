import { YStack } from 'tamagui'

// import { getCode } from '../../components/forms/switches'
import { Showcase } from '../../components/general/_Showcase'
import * as SideBars from '../../components/shells/sidebars'

type Props = ReturnType<typeof sidebarsGetComponentCodes>

export function sidebars(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={SideBars.FullSideBar.fileName} title="Responsive Sidebar">
        <SideBars.FullSideBar />
      </Showcase>
    </YStack>
  )
}

export function sidebarsGetComponentCodes() {
  return {
    codes: {
      FullSideBar: '',
    } as Omit<Record<keyof typeof SideBars, string>, 'getCode'>,
  }
}
