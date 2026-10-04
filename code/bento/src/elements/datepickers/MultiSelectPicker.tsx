import type { DPDay } from '@rehookify/datepicker'
import { useDatePickerContext, type DatePickerProviderProps } from '@rehookify/datepicker'
import { ChevronLeft, ChevronRight } from '../../icons'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, Button, H3, Separator, View, isWeb, useMedia } from 'tamagui'

import {
  CalendarHeader,
  DatePicker,
  DatePickerInput,
  HeaderTypeProvider,
  MonthPicker,
  WeekView,
  YearPicker,
  YearRangeSlider,
  swapOnClick,
  useHeaderType,
} from './common/dateParts'
import { useDateAnimation } from './common/useDateAnimation'

function Calendar({
  calendarIndex = 0,
  order,
}: {
  calendarIndex?: number
  order?: 'first' | 'last' | 'either'
}) {
  const { setHeader } = useHeaderType()
  const {
    data: { calendars, weekDays },
    propGetters: { dayButton, subtractOffset },
  } = useDatePickerContext()

  const { days, year, month } = calendars[calendarIndex]

  // divide days array into sub arrays that each has 7 days, for better stylings
  const calendarWeeks = useMemo(
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

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'month',
  })

  return (
    <View items="center" justify="center" flexDirection="column" gap="4">
      <View flexDirection="row" minW="100%" items="center" justify="space-between">
        {order === 'first' || order === 'either' ? (
          <Button circular size="md" {...swapOnClick(subtractOffset({ months: 1 }))}>
            <Button.Icon scaleIcon={1.5}>
              <ChevronLeft />
            </Button.Icon>
          </Button>
        ) : (
          <View />
        )}

        <CalendarHeader year={year} month={month} setHeader={setHeader} />

        {isWeb &&
          (order === 'last' || order === 'either' ? (
            <Button circular size="md" {...swapOnClick(subtractOffset({ months: -1 }))}>
              <Button.Icon scaleIcon={1.5}>
                <ChevronRight />
              </Button.Icon>
            </Button>
          ) : (
            <View />
          ))}

        {!isWeb && (
          <Button circular size="md" {...swapOnClick(subtractOffset({ months: -1 }))}>
            <Button.Icon scaleIcon={1.5}>
              <ChevronRight />
            </Button.Icon>
          </Button>
        )}
      </View>

      <AnimatePresence key={prevNextAnimationKey}>
        <View
          width="100%"
          justify="center"
          items="center"
          gap="4"
          {...prevNextAnimation()}
          style={{ transition: 'transform 200ms ease, opacity 200ms ease' }}
        >
          <WeekView weekDays={weekDays} />

          <View
            flexDirection="column"
            gap="2"
            items="center"
            justify="center"
            width="100%"
          >
            {calendarWeeks.map((days) => {
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
                      circular
                      p={0}
                      {...swapOnClick(dayButton(d))}
                      bg={`${!d.inCurrentMonth ? 'transparent' : d.selected ? 'background' : 'transparent'}`}
                      theme={d.selected ? 'accent' : undefined}
                      disabled={!d.inCurrentMonth}
                    >
                      <Button.Text
                        color={`${!d.inCurrentMonth ? 'color-6' : d.selected ? 'color-11' : 'color-10'}`}
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
    </View>
  )
}

type CalendarViewProps = {
  fullWidthMode: boolean
}

const CalendarView = ({ fullWidthMode }: CalendarViewProps) => {
  if (fullWidthMode)
    return (
      <View flexDirection="row" gap="3">
        <Calendar order="first" calendarIndex={1} />
        <Separator vertical />
        <Calendar order="last" calendarIndex={0} />
      </View>
    )

  return <Calendar order="either" calendarIndex={0} />
}

function DatePickerBody({
  config,
}: {
  config: DatePickerProviderProps['config']
}) {
  const [header, setHeader] = useState<'month' | 'year' | 'day'>('day')
  const { md: fullWidthMode } = useMedia()

  const renderView = () => {
    switch (header) {
      case 'day':
        return <CalendarView fullWidthMode={fullWidthMode} />

      case 'year':
        return (
          <View items="center" gap="3">
            <YearRangeSlider />
            <YearPicker onChange={() => setHeader('day')} />
          </View>
        )

      case 'month':
        return (
          <View gap="4">
            <H3 size="7" self="center">
              Select a month
            </H3>
            <MonthPicker onChange={() => setHeader('day')} />
          </View>
        )

      default:
        return null
    }
  }

  return (
    <HeaderTypeProvider config={config} type={header} setHeader={setHeader}>
      <View p="4 lg:0">{renderView()}</View>
    </HeaderTypeProvider>
  )
}

/** ------ EXAMPLE ------ */
export function MultiSelectPicker() {
  const now = new Date()
  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, onOffsetChange] = useState<Date>(now)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (selectedDates.length === 2) {
      setOpen(false)
    }
  }, [selectedDates])

  // uncomment this to limit the range of dates
  //   const M = now.getMonth()
  //   const Y = now.getFullYear()
  //   const D = now.getDate()

  const config: DatePickerProviderProps['config'] = {
    selectedDates,
    onDatesChange,
    offsetDate,
    onOffsetChange,
    dates: {
      mode: 'multiple',
      limit: 5,
      // limit years to 2 years before and after current year
      //   minDate: new Date(Y, M - 2, 1),
      //   maxDate: new Date(Y, M + 2, 0),
      toggle: true,
    },
    calendar: {
      offsets: [-1, 1],
    },
  }

  return (
    <DatePicker keepChildrenMounted open={open} onOpenChange={setOpen} config={config}>
      <DatePicker.Trigger asChild>
        <DatePickerInput
          width={250}
          placeholder="Start date, End date"
          value={`${selectedDates[0]?.toDateString() || ''}${
            selectedDates[0] && selectedDates[1]
              ? ' , '
              : selectedDates[0]
                ? ' , end date'
                : ''
          }${selectedDates[1]?.toDateString() || ''}`}
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

MultiSelectPicker.fileName = 'MultiSelectPicker'
