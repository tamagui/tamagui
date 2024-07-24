import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, H4, SizableText, XStack, YStack } from 'tamagui'
import { useDemoProps } from '../hooks/useDemoProps'
const weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]
let curDay = 27 // first day of shown calendar screen of Sep
const weeks = 6

const calendar = Array(weeks)
  .fill([])
  .map((_, idx) => {
    let week: { day: number; disabled: boolean }[] = []
    for (let i = 0; i < weekdays.length; i++) {
      week.push({
        day: curDay,
        disabled: (curDay <= 7 && idx === weeks - 1) || (curDay > 7 && idx === 0),
      })
      if (curDay === 31) {
        curDay = 1
      } else {
        curDay++
      }
    }
    return week
  })
export const Calendar = () => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <YStack flex={1} ai="center">
        <YStack>
          <XStack jc="space-between" ai="center" f={1} width="100%" px="$4">
            <Button
              size="$2"
              icon={ChevronLeft}
              circular
              chromeless
              {...demoProps.borderRadiusProps}
            />
            <H4 {...demoProps.headingFontFamilyProps}>September 2023</H4>
            <Button
              size="$2"
              icon={ChevronRight}
              circular
              chromeless
              {...demoProps.borderRadiusProps}
            />
          </XStack>
          <YStack mt="$2" p="$2" gap="$2">
            <XStack>
              {weekdays.map((day) => (
                <LabelCell key={day}>{day[0].toUpperCase() + day[1]}</LabelCell>
              ))}
            </XStack>
            <YStack>
              {calendar.map((week, i) => (
                <XStack key={i}>
                  {week.map(({ day, disabled }) => (
                    <DayCell key={day} day={day} isDisabled={disabled} />
                  ))}
                </XStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </YStack>
      <YStack mt="$4">
        <>
          <Button
            fontWeight="600"
            size="$5"
            {...demoProps.borderRadiusProps}
            {...demoProps.buttonOutlineProps}
          >
            Select Date
          </Button>
        </>
      </YStack>
    </YStack>
  )
}

const LabelCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack
      width="$4"
      height="$4"
      $md={{
        width: '$3',
        height: '$3',
      }}
      userSelect="none"
      jc="center"
      ai="center"
    >
      <SizableText $md={{ size: '$2' }} size="$4" ta="center">
        {children}
      </SizableText>
    </YStack>
  )
}

const DayCell = ({ day, isDisabled }: { day: number; isDisabled?: boolean }) => {
  const demoProps = useDemoProps()
  return (
    <YStack
      width="$4"
      height="$4"
      $md={{
        width: '$3',
        height: '$3',
      }}
      cursor={isDisabled ? 'default' : 'pointer'}
      userSelect="none"
      hoverStyle={isDisabled ? {} : { backgroundColor: '$backgroundHover' }}
      disabled={isDisabled}
      opacity={isDisabled ? 0.5 : 1}
      jc="center"
      ai="center"
      {...demoProps.borderRadiusProps}
      borderWidth={0}
    >
      <SizableText size="$2" ta="center">
        {day}
      </SizableText>
    </YStack>
  )
}
