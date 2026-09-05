import { YStack } from 'tamagui'

import * as Checkboxes from '@tamagui/bento/component/forms/checkboxes'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

type Props = {
  codes: {
    CheckboxCards: string
    CheckboxList: string
    GroupedCheckbox: string
    HorizontalCheckboxes: string
    HorizontalWithDescriptionCheckboxes: string
    VerticalWithDescriptionCheckboxes: string
  }
}

export function checkboxes() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
      <Showcase fileName={Checkboxes.CheckboxCards.fileName} title="CheckBox Cards">
        <Wrapper>
          <Checkboxes.CheckboxCards />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Checkboxes.CheckboxList.fileName} title="Checkbox List">
        <Wrapper px={2}>
          <Checkboxes.CheckboxList />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Checkboxes.GroupedCheckbox.fileName} title="Grouped Checkbox">
        <Wrapper px={2}>
          <Checkboxes.GroupedCheckbox />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Checkboxes.HorizontalCheckboxes.fileName}
        title="Horizontal Checkboxes"
      >
        <Wrapper>
          <Checkboxes.HorizontalCheckboxes />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Checkboxes.HorizontalWithDescriptionCheckboxes.fileName}
        title="Horizontal with Description Checkboxes"
      >
        <Wrapper>
          <Checkboxes.HorizontalWithDescriptionCheckboxes />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Checkboxes.VerticalWithDescriptionCheckboxes.fileName}
        title="Vertical with Description Checkboxes"
      >
        <Wrapper>
          <Checkboxes.VerticalWithDescriptionCheckboxes />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}

export function checkboxesGetComponentCodes() {
  return {
    codes: {
      CheckboxCards: '',
      CheckboxList: '',
      GroupedCheckbox: '',
      HorizontalCheckboxes: '',
      HorizontalWithDescriptionCheckboxes: '',
      VerticalCheckboxes: '',
      VerticalWithDescriptionCheckboxes: '',
    },
  }
}
