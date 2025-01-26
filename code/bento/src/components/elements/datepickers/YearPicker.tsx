import { DatePickerProvider as _DatePickerProvider } from '@rehookify/datepicker'
import { useEffect, useState } from 'react'
import { View } from 'tamagui'
import { DatePicker, DatePickerInput, YearPicker, YearRangeSlider } from './common/dateParts'

function CalendarHeader() {
  return <YearRangeSlider />
}

function DatePickerBody() {
  return (
    <View flexDirection="column" alignItems="center" gap="$4">
      <CalendarHeader />
      <YearPicker />
    </View>
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
          if (offset) {
            offset.setMonth(0)
          }
          setOffsetDate(offset)
        },
        calendar: {
          startDay: 1,
        },
      }}
    >
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
        <DatePicker.Content.Arrow borderWidth={1} borderColor="$borderColor" />
        <DatePickerBody />
      </DatePicker.Content>
    </DatePicker>
  )
}

YearPickerInput.fileName = 'YearPicker'
