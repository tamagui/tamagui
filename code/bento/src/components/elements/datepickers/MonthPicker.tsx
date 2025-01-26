import { DatePickerProvider as _DatePickerProvider } from '@rehookify/datepicker'
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
} from './common/dateParts'

function CalendarHeader() {
  const { type: header } = useHeaderType()
  if (header === 'year') {
    return <YearRangeSlider />
  }
  return <YearSlider />
}

function DatePickerBody() {
  const [header, setHeader] = useState<'month' | 'year' | 'day'>('month')

  return (
    <HeaderTypeProvider type={header} setHeader={setHeader}>
      <View flexDirection="column" alignItems="center" gap="$2">
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

  return (
    <DatePicker
      keepChildrenMounted
      open={open}
      onOpenChange={setOpen}
      config={{
        onDatesChange,
        /** this is the default dates, which means updating this will not update internal date
         *  and date picker will not be controlled, for manually changing internal date value use `offsetDate`
         *  */
        selectedDates,
        offsetDate,
        onOffsetChange: (offset) => {
          setOffsetDate(offset)
        },
        calendar: {
          startDay: 1,
        },
      }}
    >
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
        <DatePickerBody />
      </DatePicker.Content>
    </DatePicker>
  )
}

MonthPickerInput.fileName = 'MonthPicker'
