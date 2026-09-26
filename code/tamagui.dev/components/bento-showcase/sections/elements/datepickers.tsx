import { YStack } from 'tamagui'

import * as DatePickers from '@tamagui/bento/component/elements/datepickers'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function datepickers() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
    >
      <Showcase fileName={DatePickers.DatePickerExample.fileName} title="DatePicker">
        <Wrapper>
          <DatePickers.DatePickerExample />
        </Wrapper>
      </Showcase>

      <Showcase fileName={DatePickers.YearPickerInput.fileName} title="YearPicker">
        <Wrapper>
          <DatePickers.YearPickerInput />
        </Wrapper>
      </Showcase>

      <Showcase fileName={DatePickers.MonthPickerInput.fileName} title="MonthPicker">
        <Wrapper>
          <DatePickers.MonthPickerInput />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={DatePickers.MultiSelectPicker.fileName}
        title="MultiSelectPicker"
      >
        <Wrapper>
          <DatePickers.MultiSelectPicker />
        </Wrapper>
      </Showcase>
      <Showcase fileName={DatePickers.RangePicker.fileName} title="RangePicker">
        <Wrapper>
          <DatePickers.RangePicker />
        </Wrapper>
      </Showcase>
      <Showcase fileName={DatePickers.Calendar.fileName} title="Calendar">
        <Wrapper>
          <DatePickers.Calendar />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
