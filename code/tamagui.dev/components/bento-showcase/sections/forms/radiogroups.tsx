import { YStack } from 'tamagui'

import * as RadioGroups from '@tamagui/bento/component/forms/radiogroups'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

type Props = ReturnType<typeof radiogroupsGetComponentCodes> & BentoShowcaseContext

export function radiogroups({ isProUser, showAppropriateModal }: Props) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={RadioGroups.GroupedRadio.fileName}
          title="RadioGroup List"
        >
          <Wrapper p={2}>
            <RadioGroups.GroupedRadio />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={RadioGroups.Horizontal.fileName}
          title="Horizontal RadioGroups"
        >
          <Wrapper>
            <RadioGroups.Horizontal />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={RadioGroups.HorizontalWithDescription.fileName}
          title="Horizontal RadioGroups with description"
        >
          <Wrapper>
            <RadioGroups.HorizontalWithDescription />
          </Wrapper>
        </Showcase>
        <Showcase fileName={RadioGroups.RadioCards.fileName} title="Cards RadioGroups">
          <Wrapper>
            <RadioGroups.RadioCards />
          </Wrapper>
        </Showcase>
        <Showcase fileName={RadioGroups.RadioList.fileName} title="List RadioGroups">
          <Wrapper p={2}>
            <RadioGroups.RadioList />
          </Wrapper>
        </Showcase>
        <Showcase fileName={RadioGroups.Vertical.fileName} title="Vertical RadioGroups">
          <Wrapper>
            <RadioGroups.Vertical />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={RadioGroups.VerticalWithDescription.fileName}
          title="Vertical with Description RadioGroups"
        >
          <Wrapper>
            <RadioGroups.VerticalWithDescription />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}

export function radiogroupsGetComponentCodes() {
  return {
    codes: {
      GroupedRadio: '',
      Horizontal: '',
      HorizontalWithDescription: '',
      RadioCards: '',
      RadioList: '',
      Vertical: '',
      VerticalWithDescription: '',
    } as Omit<Record<keyof typeof RadioGroups, string>, 'getCode'>,
  }
}
