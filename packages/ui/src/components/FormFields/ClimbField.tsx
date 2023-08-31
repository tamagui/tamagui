import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId, useMemo } from 'react'
import { Fieldset, InputProps, Label, Theme, XStack, useThemeName } from 'tamagui'
import { SelectField } from './SelectField'

import { z } from 'zod'

import { FieldError } from '../FieldError'
import { Shake } from '../Shake'

import {
  startOfDay,
  add,
  isAfter,
  addMinutes,
  format,
  addHours,
  roundToNearestMinutes,
  formatDuration,
} from 'date-fns'

export function getTimeSelections(
  day: Date,
  increment: number = 15 // 15 minutes interval
) {
  // Gowanus Hours

  // Monday - Friday
  // 7AM - 11PM

  // Saturday + Sunday
  // 9AM - 10PM

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  const weekends = ['saturday', 'sunday']

  const currentStartOfDay = startOfDay(new Date()) // Midnight

  // if current time is before 7AM, use 7AM as the start of the day
  // if current time is after 7am, use current time as the start of the day
  const now = new Date()
  const weekDayStart = isAfter(now, addHours(currentStartOfDay, 7))
    ? roundToNearestMinutes(now, { nearestTo: increment })
    : addHours(currentStartOfDay, 7)

  const weekEndStart = isAfter(now, addHours(currentStartOfDay, 9))
    ? roundToNearestMinutes(now, { nearestTo: increment })
    : addHours(currentStartOfDay, 9)

  const weekDayEnd = add(currentStartOfDay, {
    hours: 22,
    minutes: 30,
  })

  const weekendEnd = add(currentStartOfDay, {
    hours: 21,
    minutes: 30,
  }) // 9:30PM

  const formattedDayOfWeek = format(day, 'EEEE').toLowerCase()

  if (weekdays.includes(formattedDayOfWeek)) {
    return getTimeSelectionsForDay(weekDayStart, weekDayEnd, increment)
  } else if (weekends.includes(formattedDayOfWeek)) {
    return getTimeSelectionsForDay(weekEndStart, weekendEnd, increment)
  } else {
    throw new Error('Invalid day')
  }
}

function getTimeSelectionsForDay(startTime: Date, endTime: Date, increment: number) {
  const selections: Array<{
    name: string
    value: string
  }> = []

  let currentTime = startTime

  while (currentTime < endTime) {
    selections.push({
      name: format(currentTime, 'hh:mmaaa'),
      value: currentTime.toISOString(),
    })

    currentTime = addMinutes(currentTime, increment)
  }
  return selections
}

export function getDurationSelections() {
  const increment = 15 // 15 minutes interval

  return Array.from({ length: 15 }).map((_, i) => {
    const minutes = (i + 1) * increment
    const duration = {
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60,
    }
    return {
      name: formatDuration(duration, {
        format: ['hours', 'minutes'],
      }),
      value: `${minutes}`,
    }
  })
}

const climbType = z.enum(['top_rope', 'lead_rope', 'boulder'] as const)
const location = z.enum(['Gowanus'] as const)

export const ClimbSchema = z.object({
  type: climbType,
  location: location,
})

export const ClimbField = (props: Pick<InputProps, 'size'>) => {
  const {
    error,
    formState: { isSubmitting },
  } = useTsController<z.infer<typeof ClimbSchema>>()
  const { label } = useFieldInfo()
  const id = useId()
  const themeName = useThemeName()

  const startTimes = useMemo(() => {
    return getTimeSelections(new Date(), 15)
  }, [])
  const durationTimes = useMemo(() => {
    return getDurationSelections()
  }, [])
  const disabled = isSubmitting

  return (
    <Fieldset gap="$2">
      <Label theme="alt1" size="$3">
        {label}
      </Label>
      <XStack $sm={{ flexDirection: 'column' }} $gtSm={{ flexWrap: 'wrap' }} gap="$4">
        <Theme name={error?.type ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-street`}>
              Climb Type
            </Label>
            <Shake shakeKey={error?.type?.errorMessage}>
              <SelectField
                options={[
                  {
                    name: 'Top Rope',
                    value: 'top_rope',
                  },
                  {
                    name: 'Lead Rope',
                    value: 'lead_rope',
                  },
                  {
                    name: 'Boulder',
                    value: 'boulder',
                  },
                ]}
                {...props}
              />
            </Shake>
            <FieldError message={error?.type?.errorMessage} />
          </Fieldset>
        </Theme>

        <Theme name={error?.location ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-zip-code`}>
              Location
            </Label>
            <Shake shakeKey={error?.location?.errorMessage}>
              <SelectField
                disabled={true}
                options={[
                  {
                    name: 'Gowanus',
                    value: 'gowanus',
                  },
                ]}
                {...props}
              />
            </Shake>
            <FieldError message={error?.location?.errorMessage} />
          </Fieldset>
        </Theme>
        {/* <Theme name={error?.start ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-zip-code`}>
              Start
            </Label>
            <Shake shakeKey={error?.start?.errorMessage}>
              <SelectField disabled={disabled} options={startTimes} {...props} />
            </Shake>
            <FieldError message={error?.start?.errorMessage} />
          </Fieldset>
        </Theme>
        <Theme name={error?.duration ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-zip-code`}>
              Duration
            </Label>
            <Shake shakeKey={error?.duration?.errorMessage}>
              <SelectField disabled={disabled} options={durationTimes} {...props} />
            </Shake>
            <FieldError message={error?.location?.errorMessage} />
          </Fieldset>
        </Theme> */}
      </XStack>
    </Fieldset>
  )
}
