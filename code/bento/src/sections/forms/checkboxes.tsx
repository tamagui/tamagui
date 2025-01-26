import { YStack } from 'tamagui'

import * as Checkboxes from '../../components/forms/checkboxes'
// import { getCode } from '../../components/forms/checkboxes'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function checkboxes(props: {
  codes: {
    CheckboxCards: string
    CheckboxList: string
    GroupedCheckbox: string
    HorizontalCheckboxes: string
    HorizontalWithDescriptionCheckboxes: string
    VerticalWithDescriptionCheckboxes: string
  }
}) {
  return (
    <YStack paddingBottom="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={Checkboxes.CheckboxCards.fileName} title="CheckBox Cards">
        <Wrapper>
          <Checkboxes.CheckboxCards />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Checkboxes.CheckboxList.fileName} title="Checkbox List">
        <Wrapper paddingHorizontal={2}>
          <Checkboxes.CheckboxList />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Checkboxes.GroupedCheckbox.fileName} title="Grouped Checkbox">
        <Wrapper paddingHorizontal={2}>
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
