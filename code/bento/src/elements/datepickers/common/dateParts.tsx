import type { ComponentSize } from '@tamagui/core'
import type { DatePickerProviderProps } from '@rehookify/datepicker'
import { DatePickerProvider, useDatePickerContext } from '@rehookify/datepicker'
import { Calendar, ChevronLeft, ChevronRight, X } from '../../../icons'
import type { GestureReponderEvent, ViewProps } from '@tamagui/web'
import type { PopoverProps } from 'tamagui'
import { tone } from '../../../tone'
import {
  createStyledHOC,
  Adapt,
  AnimatePresence,
  Button,
  Popover,
  Sheet,
  Text,
  View,
  createStyledContext,
  isWeb,
  styled,
  withStaticProperties,
  SizableText,
} from 'tamagui'

import { type ReactNode, useEffect, useRef } from 'react'
import { Input } from '../../../forms/inputs/components/inputsParts'
import { useDateAnimation } from './useDateAnimation'

type DatePickerProps = PopoverProps & {
  config: DatePickerProviderProps['config']
}

export type HeaderType = 'day' | 'month' | 'year'

export function RangeGradient({
  children,
  color,
  direction,
}: {
  children: ReactNode
  color: 'color-5' | 'color-6'
  direction: 'leftToRight' | 'rightToLeft'
}) {
  return (
    <View
      flex={1}
      width="100%"
      bg={color}
      opacity={direction === 'leftToRight' ? 0.9 : 0.75}
    >
      {children}
    </View>
  )
}

/** rehookify internally return `onClick` and that's incompatible with native */
export function swapOnClick<D>(d: D) {
  //@ts-ignore
  d.onPress = d.onClick
  return d
}

export const { Provider: HeaderStyleTypeProvider, useStyledContext: useHeaderType } =
  createStyledContext({
    type: 'day',
    setHeader: (_: HeaderType) => {},
  })

export const HeaderTypeProvider = ({
  config,
  ...props
}: {
  config: DatePickerProviderProps['config']
  type: HeaderType
  setHeader: (type: HeaderType) => void
  children: ReactNode
}) => {
  return (
    <DatePickerProvider config={config}>
      <HeaderStyleTypeProvider {...props} />
    </DatePickerProvider>
  )
}

const DatePickerImpl = (props: DatePickerProps) => {
  const { children, config, ...rest } = props
  const popoverRef = useRef<Popover>(null)

  // hide date picker on scroll (web)
  useEffect(() => {
    if (isWeb) {
      const controller = new AbortController()
      // NOTE: For cross-browser compatibility:
      // - We use document.addEventListener('scroll', ...) instead of document.body.addEventListener because Safari does not fire scroll events on body.
      // - We use capture: true because Chrome only fires scroll events on document in the capture phase.
      //   (Chrome works with document.body.addEventListener and capture: false, but that is not reliable in Safari.)
      // This combination ensures the scroll event is caught in both Chrome and Safari.
      document.addEventListener(
        'scroll',
        () => {
          popoverRef.current?.close()
        },
        {
          capture: true,
          signal: controller.signal,
        }
      )

      return () => {
        controller.abort()
      }
    }
  }, [])

  return (
    <DatePickerProvider config={config}>
      <Popover ref={popoverRef} keepChildrenMounted allowFlip {...rest}>
        <Adapt when="max-md">
          <Sheet modal dismissOnSnapToBottom snapPointsMode="fit">
            <Sheet.Container p="4" width="100%" items="center">
              <Sheet.Background />
              <Adapt.Contents />
            </Sheet.Container>
            <Sheet.Overlay
              style={{ transition: 'opacity 200ms ease' }}
              opacity="0.8 enter:0 exit:0"
            />
          </Sheet>
        </Adapt>
        {children}
      </Popover>
    </DatePickerProvider>
  )
}

const DatePickerContent = styled(Popover.Content, {
  padding: 12,
  borderWidth: 1,
  borderColor: tone.border,
  backgroundColor: tone.surface,
  rounded: '6',
  boxShadow: '0 8px 24px shadow-color',
  y: 'enter:-10px exit:-10px',
  opacity: 'enter:0 exit:0',
})

export const DatePicker = withStaticProperties(DatePickerImpl, {
  Trigger: Popover.Trigger,
  Content: withStaticProperties(DatePickerContent, {
    Arrow: styled(Popover.Arrow, {
      borderWidth: 1,
      borderColor: tone.border,
      backgroundColor: tone.surface,
    }),
  }),
})

type DatePickerInputProps = Omit<React.ComponentProps<typeof Input.Area>, 'size'> & {
  onReset: () => void
  onButtonPress?: (e: GestureReponderEvent) => void
  size?: ComponentSize
}

export const DatePickerInput = createStyledHOC(
  Input.Area,
  (props: DatePickerInputProps, ref) => {
    const { value, onButtonPress, size = 'sm', onReset, onLayout, ...rest } = props
    return (
      <View onLayout={isWeb ? undefined : onLayout} minW="native:100%">
        <Input cursor="pointer" onPress={onButtonPress} size={size}>
          <Input.Box>
            <Input.Section>
              <Input.Area
                readOnly
                value={value}
                ref={ref}
                {...(rest as any)}
                color="color-10"
              />
            </Input.Section>
            <Input.Section>
              <Input.Button
                onPress={(e) => {
                  if (value) {
                    e.stopPropagation()
                    onReset()
                  } else {
                    onButtonPress?.(e)
                  }
                }}
              >
                {value ? (
                  <Input.Icon>
                    <X />
                  </Input.Icon>
                ) : (
                  <Input.Icon>
                    <Calendar />
                  </Input.Icon>
                )}
              </Input.Button>
            </Input.Section>
          </Input.Box>
        </Input>
      </View>
    )
  }
)

export function MonthPicker({
  onChange = (_e, _date) => {
    'noop'
  },
}: {
  onChange?: (e: MouseEvent, date: Date) => void
}) {
  const {
    data: { months },
    propGetters: { monthButton },
  } = useDatePickerContext()

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'year',
  })

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <View
        {...prevNextAnimation()}
        flexDirection="row"
        flexWrap="wrap"
        gap="2"
        grow={0}
        justify="native:space-between"
        width="native:100% lg:285px"
        style={{ transition: 'transform 100ms ease, opacity 100ms ease' }}
      >
        {months.map((month) => (
          <Button
            theme={month.active ? 'accent' : undefined}
            rounded="4"
            shrink={0}
            flexBasis={90}
            bg={month.active ? tone.fill : 'transparent'}
            p={0}
            {...swapOnClick(
              monthButton(month, {
                onClick: onChange as any,
              })
            )}
            key={month.$date.toString()}
            variant="quiet"
          >
            <Button.Text color={`${month.active ? 'color-11' : 'color-10'}`}>
              {month.month}
            </Button.Text>
          </Button>
        ))}
      </View>
    </AnimatePresence>
  )
}

export function YearPicker({
  onChange = () => {},
}: {
  onChange?: (e: MouseEvent, date: Date) => void
}) {
  const {
    data: { years, calendars },
    propGetters: { yearButton },
  } = useDatePickerContext()
  const selectedYear = calendars[0].year

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'years',
  })

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <View
        {...prevNextAnimation()}
        flexDirection="row"
        flexWrap="wrap"
        gap="2"
        width="100%"
        maxW="lg:280px"
        style={{ transition: 'transform 150ms ease, opacity 150ms ease' }}
      >
        {years.map((year) => (
          <Button
            theme={year.year === Number(selectedYear) ? 'accent' : undefined}
            rounded="4"
            flexBasis="30%"
            grow={1}
            bg={year.year === Number(selectedYear) ? tone.fill : 'transparent'}
            p={0}
            {...swapOnClick(
              yearButton(year, {
                onClick: onChange as any,
              })
            )}
            key={year.$date.toString()}
            variant="quiet"
          >
            <Button.Text
              color={`${year.year === Number(selectedYear) ? 'color-11' : 'color-10'}`}
            >
              {year.year}
            </Button.Text>
          </Button>
        ))}
      </View>
    </AnimatePresence>
  )
}
export function YearRangeSlider() {
  const {
    data: { years },
    propGetters: { previousYearsButton, nextYearsButton },
  } = useDatePickerContext()

  return (
    <View flexDirection="row" width="100%" items="center" justify="space-between">
      <Button
        circular
        size="md"
        variant="outlined"
        {...swapOnClick(previousYearsButton())}
      >
        <Button.Icon scaleIcon={1.5}>
          <ChevronLeft />
        </Button.Icon>
      </Button>
      <View y={2} flexDirection="column" items="center">
        <SizableText size="5">
          {`${years[0].year} - ${years[years.length - 1].year}`}
        </SizableText>
      </View>
      <Button circular size="md" variant="outlined" {...swapOnClick(nextYearsButton())}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronRight />
        </Button.Icon>
      </Button>
    </View>
  )
}

export function YearSlider() {
  const {
    data: { calendars },
    propGetters: { subtractOffset },
  } = useDatePickerContext()
  const { setHeader } = useHeaderType()
  const { year } = calendars[0]
  return (
    <View
      flexDirection="row"
      width="100%"
      height={50}
      items="center"
      justify="space-between"
    >
      <Button
        circular
        size="sm"
        variant="outlined"
        {...swapOnClick(subtractOffset({ months: 12 }))}
      >
        <Button.Icon scaleIcon={1.5}>
          <ChevronLeft />
        </Button.Icon>
      </Button>
      <SizableText
        onPress={() => setHeader('year')}
        select="text"
        cursor="pointer"
        color="color-10 hover:color-11"
        tabIndex={0}
        size="6"
      >
        {year}
      </SizableText>
      <Button
        circular
        size="sm"
        variant="outlined"
        {...swapOnClick(subtractOffset({ months: -12 }))}
      >
        <Button.Icon scaleIcon={1.5}>
          <ChevronRight />
        </Button.Icon>
      </Button>
    </View>
  )
}

export const CalendarHeader = ({
  year,
  month,
  setHeader,
}: {
  year: string
  month: string
  setHeader: (header: 'year' | 'month') => void
}) => {
  return (
    <View flexDirection="column" height={50} items="center">
      <SizableText
        onPress={() => setHeader('year')}
        tabIndex={0}
        size="4"
        cursor="pointer"
        color="color-10 hover:color-11"
      >
        {year}
      </SizableText>
      <SizableText
        onPress={() => setHeader('month')}
        select="auto"
        cursor="pointer"
        color="color-11 hover:color-9"
        fontWeight="bold"
        tabIndex={0}
        size="6"
      >
        {month}
      </SizableText>
    </View>
  )
}

export const WeekView = ({
  weekDays,
  ...props
}: {
  weekDays: string[]
  props?: ViewProps
}) => {
  return (
    <View width="100%" flexDirection="row" gap="1" {...props}>
      {weekDays.map((day) => (
        <SizableText
          flex={1}
          theme="level2"
          key={day}
          text="center"
          width="100%"
          size="4"
        >
          {day}
        </SizableText>
      ))}
    </View>
  )
}
