import type { DatePickerProviderProps } from '@rehookify/datepicker'
import { DatePickerProvider } from '@rehookify/datepicker'
import { useEffect, useState } from 'react'
import { View } from 'tamagui'
import {
  DatePicker,
  DatePickerInput,
  YearPicker,
  YearRangeSlider,
} from './common/dateParts'

function CalendarHeader() {
  return <YearRangeSlider />
}

function DatePickerBody({ config }: { config: DatePickerProviderProps['config'] }) {
  return (
    <DatePickerProvider config={config}>
      <View flexDirection="column" items="center" gap="4" p="4 lg:0">
        <CalendarHeader />
        <YearPicker />
      </View>
    </DatePickerProvider>
  )
}

/** ------ EXAMPLE ------ */
export function YearPickerInput() {
  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, setOffsetDate] = useState<Date>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [offsetDate])

  const config: DatePickerProviderProps['config'] = {
    onDatesChange,
    /** this is the default dates, which means updating this will not update internal date
     *  and date picker will not be controlled, for manually changing internal date value use `offsetDate`
     *  */
    selectedDates,
    offsetDate,
    onOffsetChange: (offset) => {
      if (offset) {
        offset.setMonth(0)
      }
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
          value={
            offsetDate?.toLocaleDateString('en-US', {
              year: 'numeric',
            }) || ''
          }
          placeholder="Select year"
          onReset={() => {
            setOffsetDate(undefined)
          }}
          onButtonPress={() => setOpen(true)}
        />
      </DatePicker.Trigger>

      <DatePicker.Content>
        <DatePicker.Content.Arrow borderWidth={1} borderColor="border-color" />
        <DatePickerBody config={config} />
      </DatePicker.Content>
    </DatePicker>
  )
}

YearPickerInput.fileName = 'YearPicker'
