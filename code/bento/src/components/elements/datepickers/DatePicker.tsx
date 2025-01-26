import { useDatePickerContext } from '@rehookify/datepicker'
import type { DPDay } from '@rehookify/datepicker'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, Button, View } from 'tamagui'

import {
  DatePicker,
  DatePickerInput,
  HeaderTypeProvider,
  MonthPicker,
  SizableText,
  YearPicker,
  YearRangeSlider,
  swapOnClick,
  useHeaderType,
} from './common/dateParts'
import { useDateAnimation } from './common/useDateAnimation'

function CalendarHeader() {
  const {
    data: { calendars },
    propGetters: { subtractOffset },
  } = useDatePickerContext()
  const { type: header, setHeader } = useHeaderType()
  const { year, month } = calendars[0]

  if (header === 'year') {
    return <YearRangeSlider />
  }

  if (header === 'month') {
    return (
      <SizableText width="100%" ta="center" userSelect="auto" tabIndex={0} size="$8">
        Select a month
      </SizableText>
    )
  }
  return (
    <View
      flexDirection="row"
      width="100%"
      height={50}
      alignItems="center"
      justifyContent="space-between"
    >
      <Button circular size="$4" {...swapOnClick(subtractOffset({ months: 1 }))}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronLeft />
        </Button.Icon>
      </Button>
      <View flexDirection="column" height={50} alignItems="center">
        <SizableText
          onPress={() => setHeader('year')}
          userSelect="auto"
          tabIndex={0}
          size="$4"
          cursor="pointer"
          color="$color11"
          hoverStyle={{
            color: '$color12',
          }}
        >
          {year}
        </SizableText>
        <SizableText
          onPress={() => setHeader('month')}
          userSelect="auto"
          cursor="pointer"
          tabIndex={0}
          size="$6"
          color="$gray12"
          fontWeight="600"
          lineHeight="$1"
          hoverStyle={{
            color: '$gray10',
          }}
        >
          {month}
        </SizableText>
      </View>
      <Button circular size="$4" {...swapOnClick(subtractOffset({ months: -1 }))}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronRight />
        </Button.Icon>
      </Button>
    </View>
  )
}

function DayPicker() {
  const {
    data: { calendars, weekDays },
    propGetters: { dayButton },
  } = useDatePickerContext()

  const { days } = calendars[0]

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'month',
  })

  // divide days array into sub arrays that each has 7 days, for better stylings
  const subDays = useMemo(
    () =>
      days.reduce((acc, day, i) => {
        if (i % 7 === 0) {
          acc.push([])
        }
        acc[acc.length - 1].push(day)
        return acc
      }, [] as DPDay[][]),
    [days]
  )

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <View animation="medium" {...prevNextAnimation()}>
        <View flexDirection="row" gap="$1">
          {weekDays.map((day) => (
            <SizableText key={day} ta="center" width={45} size="$4">
              {day}
            </SizableText>
          ))}
        </View>
        <View flexDirection="column" gap="$1" flexWrap="wrap">
          {subDays.map((days) => {
            return (
              <View flexDirection="row" key={days[0].$date.toString()} gap="$1">
                {days.map((d) => (
                  <Button
                    key={d.$date.toString()}
                    chromeless
                    circular
                    padding={0}
                    width={45}
                    {...swapOnClick(dayButton(d))}
                    backgroundColor={d.selected ? '$background' : 'transparent'}
                    themeInverse={d.selected}
                    disabled={!d.inCurrentMonth}
                  >
                    <Button.Text
                      color={
                        d.selected ? '$gray12' : d.inCurrentMonth ? '$gray11' : '$gray6'
                      }
                    >
                      {d.day}
                    </Button.Text>
                  </Button>
                ))}
              </View>
            )
          })}
        </View>
      </View>
    </AnimatePresence>
  )
}

function DatePickerBody() {
  const [header, setHeader] = useState<'day' | 'month' | 'year'>('day')

  return (
    <HeaderTypeProvider type={header} setHeader={setHeader}>
      <View flexDirection="column" alignItems="center" gap="$2.5" maxWidth={325}>
        <CalendarHeader />
        {header === 'month' && <MonthPicker onChange={() => setHeader('day')} />}
        {header === 'year' && <YearPicker onChange={() => setHeader('day')} />}
        {header === 'day' && <DayPicker />}
      </View>
    </HeaderTypeProvider>
  )
}

/** ------ EXAMPLE ------ */
export function DatePickerExample() {
  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [selectedDates])


  return (
    <DatePicker
      keepChildrenMounted
      open={open}
      onOpenChange={setOpen}
      config={{
        selectedDates,
        onDatesChange,
        calendar: {
          startDay: 1,
        },
      }}
    >
      <DatePickerInput
        placeholder="Select Date"
        value={selectedDates[0]?.toDateString() || ''}
        onReset={() => onDatesChange([])}
        onButtonPress={() => setOpen(true)}
      />

      {open && (
        <>
          <DatePicker.Content>
            <DatePicker.Content.Arrow />
            <DatePickerBody />
          </DatePicker.Content>
        </>
      )}
    </DatePicker>
  )
}

DatePickerExample.fileName = 'DatePicker'
