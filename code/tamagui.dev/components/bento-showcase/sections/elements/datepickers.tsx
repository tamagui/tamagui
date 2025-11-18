import { YStack } from 'tamagui'

import * as DatePickers from '@tamagui/bento/component/elements/datepickers'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function datepickers({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase
          unlock
          fileName={DatePickers.DatePickerExample.fileName}
          title="DatePicker"
        >
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
    </BentoShowcaseProvider>
  )
}
