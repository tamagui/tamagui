import {
  useDatePickerContext,
  type DatePickerProviderProps,
  type DPDay,
} from '@rehookify/datepicker'

import { ChevronLeft, ChevronRight } from '../../icons'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, Button, H3, View } from 'tamagui'

import {
  CalendarHeader,
  DatePicker,
  DatePickerInput,
  HeaderTypeProvider,
  MonthPicker,
  swapOnClick,
  useHeaderType,
  WeekView,
  YearPicker,
  YearRangeSlider,
  type HeaderType,
} from './common/dateParts'
import { useDateAnimation } from './common/useDateAnimation'

function DateHeader() {
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
      <H3 size="7" self="center">
        Select a month
      </H3>
    )
  }
  return (
    <View flexDirection="row" width="100%" items="center" justify="space-between">
      <Button circular size="md" {...swapOnClick(subtractOffset({ months: 1 }))}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronLeft />
        </Button.Icon>
      </Button>

      <CalendarHeader year={year} month={month} setHeader={setHeader} />

      <Button circular size="md" {...swapOnClick(subtractOffset({ months: -1 }))}>
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
      <View
        width="100%"
        gap="4"
        {...prevNextAnimation()}
        style={{ transition: 'transform 200ms ease, opacity 200ms ease' }}
      >
        <WeekView weekDays={weekDays} />

        <View flexDirection="column" gap="2" items="center" justify="center" width="100%">
          {subDays.map((days) => {
            return (
              <View
                justify="space-between"
                items="center"
                flexDirection="row"
                gap="1"
                flex={1}
                flexBasis="auto"
                width="100%"
                key={days[0].$date.toString()}
              >
                {days.map((d) => (
                  <Button
                    key={d.$date.toString()}
                    variant="quiet"
                    circular
                    p={0}
                    {...swapOnClick(dayButton(d))}
                    bg={`${d.selected ? 'background' : 'transparent'}`}
                    theme={d.selected ? 'accent' : undefined}
                    disabled={!d.inCurrentMonth}
                  >
                    <Button.Text
                      fontWeight="500"
                      fontSize="4"
                      color={`${d.selected ? 'color-11' : d.inCurrentMonth ? 'color-10' : 'color-6'}`}
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

function DatePickerBody({
  config,
}: {
  config: DatePickerProviderProps['config']
}) {
  const [header, setHeader] = useState<HeaderType>('day')

  return (
    <HeaderTypeProvider config={config} type={header} setHeader={setHeader}>
      <View flexDirection="column" items="center" gap="4" width="100%" p="4 lg:2">
        <DateHeader />
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

  const config: DatePickerProviderProps['config'] = {
    selectedDates,
    onDatesChange,
    calendar: {
      startDay: 1,
    },
  }

  return (
    <DatePicker keepChildrenMounted open={open} onOpenChange={setOpen} config={config}>
      <DatePicker.Trigger asChild>
        <DatePickerInput
          placeholder="Select Date"
          value={selectedDates[0]?.toDateString() || ''}
          onReset={() => onDatesChange([])}
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

DatePickerExample.fileName = 'DatePicker'
