import type { DPDay, DatePickerProviderProps } from '@rehookify/datepicker'
import { useDatePickerContext } from '@rehookify/datepicker'
import { ChevronLeft, ChevronRight } from '../../icons'
import { useEffect, useMemo, useState } from 'react'
import type { GetProps } from 'tamagui'
import { AnimatePresence, Button, H3, Separator, View, isWeb, useMedia } from 'tamagui'

import {
  CalendarHeader,
  DatePicker,
  DatePickerInput,
  HeaderTypeProvider,
  MonthPicker,
  RangeGradient,
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
    <View flexDirection="column" gap="4">
      <View
        flexDirection="row"
        minW="100%"
        height={50}
        items="center"
        justify="space-between"
      >
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
              const isWeekInCalendarMonth = days.some((day) => day.inCurrentMonth)
              if (!isWeekInCalendarMonth) {
                return <View key={days[0].$date.toString()} flex={1} />
              }

              return (
                <View
                  justify="space-between"
                  items="center"
                  flexDirection="row"
                  key={days[0].$date.toString()}
                  flex={1}
                  flexBasis="auto"
                  width="100%"
                >
                  {days.map((day) => {
                    const dayIsFirstOrLastOfMonth =
                      day.$date.getDate() === 1 ||
                      day.$date.getDate() ===
                        new Date(
                          day.$date.getFullYear(),
                          day.$date.getMonth() + 1,
                          0
                        ).getDate()

                    const shouldWrapInGradient =
                      dayIsFirstOrLastOfMonth && day.range && day.range === 'in-range'

                    if (!day.inCurrentMonth) {
                      return <View key={day.$date.toString()} flex={1} width="100%" />
                    }

                    const BG_RANGE_STYLE: {
                      [key: string]: GetProps<typeof View>
                    } = {
                      'in-range': {
                        bg: dayIsFirstOrLastOfMonth ? 'transparent' : 'color-5',
                      },
                      'range-start': {
                        bg: 'color-5',
                        width: '50%',
                        r: 0,
                      },
                      'range-end': {
                        bg: 'color-5',
                        width: '50%',
                        l: 0,
                      },
                      'will-be-in-range': {
                        bg: 'color-2',
                      },
                      '': {},
                    }

                    const buttonElement = (
                      <Button
                        key={day.$date.toString()}
                        variant="quiet"
                        circular
                        {...swapOnClick(dayButton(day))}
                        borderWidth={1}
                        borderColor={`${day.selected ? 'color-1' : 'transparent'}`}
                        {...(day.selected
                          ? {
                              bg: 'color-5',
                            }
                          : {})}
                        theme={day.selected ? 'accent' : undefined}
                        data-range={day.range}
                        disabled={!day.inCurrentMonth}
                      >
                        <Button.Text
                          color={`${day.selected ? 'color-11' : day.inCurrentMonth ? 'color-10' : 'color-6'}`}
                        >
                          {day.day}
                        </Button.Text>
                      </Button>
                    )

                    if (shouldWrapInGradient) {
                      const direction =
                        day.$date.getDate() === 1 ? 'rightToLeft' : 'leftToRight'

                      return (
                        <RangeGradient
                          key={day.$date.toString()}
                          color="color-6"
                          direction={direction}
                        >
                          {buttonElement}
                        </RangeGradient>
                      )
                    }

                    return (
                      <View
                        justify="center"
                        items="center"
                        key={day.$date.toString()}
                        width="100%"
                        flex={1}
                        position="relative"
                      >
                        <View
                          position="absolute"
                          width="100%"
                          height="100%"
                          z={-1}
                          {...BG_RANGE_STYLE[day.range]}
                        />
                        {buttonElement}
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </View>
        </View>
      </AnimatePresence>
    </View>
  )
}

function DatePickerBody({
  config,
}: {
  config: DatePickerProviderProps['config']
}) {
  const [header, setHeader] = useState<'month' | 'year' | 'day'>('day')
  const { gtSm: fullWidthMode } = useMedia()

  return (
    <HeaderTypeProvider config={config} type={header} setHeader={setHeader}>
      <View flexDirection="row" gap="4" p="4 gtMd:0">
        {header === 'day' && !fullWidthMode && (
          <Calendar order="either" calendarIndex={0} />
        )}
        {header === 'day' && fullWidthMode && (
          <>
            <Calendar order="first" calendarIndex={1} />
            <Separator vertical />
            <Calendar order="last" calendarIndex={0} />
          </>
        )}
        {header === 'year' && (
          <View items="center" gap="2">
            <YearRangeSlider />
            <YearPicker onChange={() => setHeader('day')} />
          </View>
        )}
        {header === 'month' && (
          <View gap="4">
            <H3 size="7" self="center">
              Select a month
            </H3>
            <MonthPicker
              onChange={() => {
                setHeader('day')
              }}
            />
          </View>
        )}
      </View>
    </HeaderTypeProvider>
  )
}

/** ------ EXAMPLE ------ */
export function RangePicker() {
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
      mode: 'range',
      // limit years to 2 years before and after current year
      //   minDate: new Date(Y, M - 2, 1),
      //   maxDate: new Date(Y, M + 2, 0),
      // minDate: new Date('2023-01-01'),
      // maxDate: new Date('2023-07-31'),
    },
    calendar: {
      offsets: [-1, 1],
    },
  }

  return (
    <DatePicker keepChildrenMounted open={open} onOpenChange={setOpen} config={config}>
      <DatePicker.Trigger asChild>
        <DatePickerInput
          value={`${selectedDates[0]?.toDateString() || ''}${
            selectedDates[0] && selectedDates[1] ? ' - ' : ''
          }${selectedDates[1]?.toDateString() || ''}`}
          placeholder="Start date - End date"
          onReset={() => {
            onDatesChange([])
          }}
          onButtonPress={() => setOpen(true)}
          width={260}
        />
      </DatePicker.Trigger>

      <DatePicker.Content>
        <DatePicker.Content.Arrow />
        <DatePickerBody config={config} />
      </DatePicker.Content>
    </DatePicker>
  )
}

RangePicker.fileName = 'RangePicker'
