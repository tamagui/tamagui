import {
  DatePickerProvider as _DatePickerProvider,
  type DatePickerProviderProps,
} from '@rehookify/datepicker'
import { useState } from 'react'
import { View } from 'tamagui'
import {
  DatePicker,
  DatePickerInput,
  HeaderTypeProvider,
  MonthPicker,
  YearPicker,
  YearRangeSlider,
  YearSlider,
  useHeaderType,
  type HeaderType,
} from './common/dateParts'

function CalendarHeader() {
  const { type: header } = useHeaderType()
  if (header === 'year') {
    return <YearRangeSlider />
  }
  return <YearSlider />
}

function DatePickerBody({
  config,
}: {
  config: DatePickerProviderProps['config']
}) {
  const [header, setHeader] = useState<HeaderType>('month')

  return (
    <HeaderTypeProvider config={config} type={header} setHeader={setHeader}>
      <View flexDirection="column" p="4 gtMd:0" items="center" gap="4">
        <CalendarHeader />
        {header === 'month' && <MonthPicker />}
        {header === 'year' && <YearPicker onChange={() => setHeader('month')} />}
      </View>
    </HeaderTypeProvider>
  )
}

/** ------ EXAMPLE ------ */
export function MonthPickerInput() {
  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, setOffsetDate] = useState<Date>()
  const [open, setOpen] = useState(false)

  const config: DatePickerProviderProps['config'] = {
    onDatesChange,

    selectedDates,
    offsetDate,
    onOffsetChange: (offset) => {
      setOffsetDate(offset)
    },
    calendar: {
      startDay: 1,
    },
  }

  return (
    <DatePicker keepChildrenMounted open={open} onOpenChange={setOpen} config={config}>
      <DatePicker.Trigger asChild>
        <DatePickerInput
          placeholder="Select Month"
          value={
            offsetDate?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            }) || ''
          }
          onReset={() => {
            setOffsetDate(undefined)
          }}
          onButtonPress={() => setOpen(true)}
        />
      </DatePicker.Trigger>

      <DatePicker.Content>
        <DatePicker.Content.Arrow />
        <DatePickerBody config={config} />
      </DatePicker.Content>
    </DatePicker>
  )
}

MonthPickerInput.fileName = 'MonthPicker'
