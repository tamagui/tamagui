import { YStack } from 'tamagui'

import * as RadioGroups from '@tamagui/bento/component/forms/radiogroups'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

type Props = ReturnType<typeof radiogroupsGetComponentCodes>

export function radiogroups() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
      <Showcase fileName={RadioGroups.GroupedRadio.fileName} title="RadioGroup List">
        <Wrapper p={2}>
          <RadioGroups.GroupedRadio />
        </Wrapper>
      </Showcase>
      <Showcase fileName={RadioGroups.Horizontal.fileName} title="Horizontal RadioGroups">
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
