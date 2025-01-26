import {
  DatePickerProvider as _DatePickerProvider,
  useDatePickerContext,
} from '@rehookify/datepicker'
import type { DPDay } from '@rehookify/datepicker'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, Button, H3, Separator, View, isWeb, useMedia } from 'tamagui'

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
    <View flexDirection="column" gap="$2">
      <View
        flexDirection="row"
        minWidth="100%"
        height={50}
        alignItems="center"
        justifyContent="space-between"
      >
        {order === 'first' || order === 'either' ? (
          <Button
            circular
            size="$4"
            {...swapOnClick(subtractOffset({ months: 1 }))}
          >
            <Button.Icon scaleIcon={1.5}>
              <ChevronLeft />
            </Button.Icon>
          </Button>
        ) : (
          <View />
        )}
        <View flexDirection="column" height={50} alignItems="center">
          <SizableText
            onPress={() => setHeader('year')}
            selectable
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
            tabIndex={0}
            cursor="pointer"
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

        {isWeb &&
          (order === 'last' || order === 'either' ? (
            <Button
              circular
              size="$4"
              {...swapOnClick(subtractOffset({ months: -1 }))}
            >
              <Button.Icon scaleIcon={1.5}>
                <ChevronRight />
              </Button.Icon>
            </Button>
          ) : (
            <View />
          ))}

        {!isWeb && (
          <Button
            circular
            size="$4"
            {...swapOnClick(subtractOffset({ months: -1 }))}
          >
            <Button.Icon scaleIcon={1.5}>
              <ChevronRight />
            </Button.Icon>
          </Button>
        )}
      </View>

      <AnimatePresence key={prevNextAnimationKey}>
        <View animation="medium" {...prevNextAnimation()} gap="$3">
          <View flexDirection="row" gap="$1">
            {weekDays.map((day) => (
              <SizableText
                theme="alt1"
                key={day}
                ta="center"
                width={45}
                size="$4"
              >
                {day}
              </SizableText>
            ))}
          </View>
          <View flexDirection="column" gap="$1" flexWrap="wrap">
            {calendarWeeks.map((days) => {
              return (
                <View
                  flexDirection="row"
                  key={days[0].$date.toString()}
                  gap="$1"
                >
                  {days.map((d) => (
                    <Button
                      key={d.$date.toString()}
                      chromeless
                      circular
                      padding={0}
                      width={45}
                      {...swapOnClick(dayButton(d))}
                      backgroundColor={
                        !d.inCurrentMonth
                          ? 'transparent'
                          : d.selected
                          ? '$background'
                          : 'transparent'
                      }
                      themeInverse={d.selected}
                      disabled={!d.inCurrentMonth}
                    >
                      <Button.Text
                        color={
                          !d.inCurrentMonth
                            ? '$gray6'
                            : d.selected
                            ? '$gray12'
                            : '$gray11'
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
    </View>
  )
}

function DatePickerBody() {
  const [header, setHeader] = useState<'year' | 'month' | 'day'>('day')
  const { gtSm: fullWidthMode } = useMedia()
  return (
    <HeaderTypeProvider type={header} setHeader={setHeader}>
      <View flexDirection="row" gap="$3">
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
          <View alignItems="center" gap="$3">
            <YearRangeSlider />
            <YearPicker onChange={() => setHeader('day')} />
          </View>
        )}
        {header === 'month' && (
          <View gap="$4">
            <H3 size="$7" alignSelf="center">
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

  return (
    <DatePicker
      keepChildrenMounted
      open={open}
      onOpenChange={setOpen}
      config={{
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
      }}
    >
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
        <DatePickerBody />
      </DatePicker.Content>
    </DatePicker>
  )
}

MultiSelectPicker.fileName = 'MultiSelectPicker'
