import type { DPDatesMode, DPDay, DatePickerProviderProps } from '@rehookify/datepicker'
import { useDatePickerContext } from '@rehookify/datepicker'
import { ChevronLeft, ChevronRight } from '../../icons'
import { Fragment, useMemo, useState } from 'react'
import type { GetProps } from 'tamagui'
import {
  AnimatePresence,
  Button,
  H3,
  Separator,
  SizableText,
  View,
  YStack,
  isWeb,
  useMedia,
  Tabs,
} from 'tamagui'
import {
  CalendarHeader,
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

function CalendarView({
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
                        background: dayIsFirstOrLastOfMonth ? 'transparent' : 'color-5',
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
                      'will-be-range-start': {
                        bg: 'color-1',
                      },
                      'will-be-range-end': {
                        bg: 'color-1',
                      },
                      '': {},
                    }

                    const buttonElement = (
                      <Button
                        key={day.$date.toString()}
                        theme={day.selected ? 'accent' : undefined}
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
                        data-range={day.range}
                        disabled={!day.inCurrentMonth}
                      >
                        {day.selected ? (
                          <Button.Text
                            key="text-selected"
                            style={{
                              transition: 'transform 100ms ease, opacity 100ms ease',
                            }}
                            y="enter:20px exit:20px"
                            opacity="1 enter:0 exit:0"
                            fontWeight="bold"
                          >
                            {day.day}
                          </Button.Text>
                        ) : (
                          <Button.Text key="text-normal">{day.day}</Button.Text>
                        )}
                      </Button>
                    )

                    if (shouldWrapInGradient) {
                      const direction =
                        day.$date.getDate() === 1 ? 'rightToLeft' : 'leftToRight'

                      return (
                        <RangeGradient
                          key={day.$date.toString()}
                          color="color-5"
                          direction={direction}
                        >
                          {buttonElement}
                        </RangeGradient>
                      )
                    }

                    return (
                      <View
                        position="relative"
                        justify="center"
                        items="center"
                        key={day.$date.toString()}
                        width="100%"
                        flex={1}
                      >
                        {(day.range === 'in-range' ||
                          day.range === 'range-start' ||
                          day.range === 'range-end') && (
                          <View
                            style={{ transition: 'opacity 150ms ease' }}
                            position="absolute"
                            width="100%"
                            height="100%"
                            z={-1}
                            {...BG_RANGE_STYLE[day.range]}
                            opacity="1 enter:0 exit:0"
                            y={0}
                          />
                        )}

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

export function Calendar({ showTabs = true }: { showTabs?: boolean }) {
  const now = new Date()
  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, onOffsetChange] = useState<Date>(now)
  const [mode, setMode] = useState<DPDatesMode>('range')

  const config: DatePickerProviderProps['config'] = {
    selectedDates,
    onDatesChange,
    offsetDate,
    onOffsetChange,
    dates: {
      mode,
    },
    calendar: {
      offsets: [-1, 1],
    },
  }

  const [header, setHeader] = useState<'month' | 'year' | 'day'>('day')
  const { md: fullWidthMode } = useMedia()

  return (
    <YStack gap="4">
      {showTabs && (
        <Tabs
          defaultValue="range"
          flexDirection="row"
          rounded="4"
          borderWidth="px"
          overflow="hidden"
          self="center"
          items="lg:center"
          justify="lg:center"
          bg="color-1"
          borderColor="border-color"
          orientation="horizontal"
          onValueChange={(value) => {
            setMode(value as DPDatesMode)
            onDatesChange([])
          }}
        >
          <AnimatePresence>
            <Tabs.List aria-label="Calendar Mode">
              <Tabs.Tab key="range" backgroundColor="focus:color-3" value="range">
                <SizableText>Range</SizableText>
              </Tabs.Tab>
              <Tabs.Tab key="single" backgroundColor="focus:color-3" value="single">
                <SizableText>Single</SizableText>
              </Tabs.Tab>
              <Tabs.Tab key="multiple" backgroundColor="focus:color-3" value="multiple">
                <SizableText>Multiple</SizableText>
              </Tabs.Tab>
            </Tabs.List>
          </AnimatePresence>
          <Separator vertical />
        </Tabs>
      )}

      <HeaderTypeProvider config={config} type={header} setHeader={setHeader}>
        <View
          bg="background"
          flexDirection="row"
          gap="4"
          p="4"
          borderWidth={1}
          borderColor="border-color"
          rounded="8"
          boxShadow="0 32px 32px color-9"
        >
          {header === 'day' && !fullWidthMode && (
            <CalendarView order="either" calendarIndex={0} />
          )}
          {header === 'day' && fullWidthMode && (
            <Fragment key="dual-calendar">
              <CalendarView order="first" calendarIndex={1} />
              <Separator vertical />
              <CalendarView order="last" calendarIndex={0} />
            </Fragment>
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
    </YStack>
  )
}

Calendar.fileName = 'Calendar'
