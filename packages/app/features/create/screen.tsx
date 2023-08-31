import { H2, Paragraph, SubmitButton, Theme, YStack, isWeb } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { z } from 'zod'

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
import { api } from 'app/utils/api'

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

export const CreateScreen = () => {
  const createClimbMutation = api.climb.create.useMutation()
  return (
    <SchemaForm
      onSubmit={(bag) => {
        createClimbMutation.mutate({
          name: bag.name,
          type: bag.type,
          start: bag.start,
          duration: bag.duration,
          location: bag.location,
        })
      }}
      schema={z.object({
        name: formFields.text.min(10).describe('Name // Afternoon Top Rope 5.9+'),
        type: formFields.select.describe('Climb Type'),
        start: formFields.select.describe('Start Time'),
        // Will always be in minutes, and 15 minute increments
        duration: formFields.select.describe('Duration'),
        location: formFields.select.describe('Location'),
      })}
      defaultValues={{
        name: '',
        // start: getTimeSelections(new Date(), 15)[0].value,
        duration: getDurationSelections()[1].value,
        location: 'gowanus',
        type: 'top_rope',
      }}
      props={{
        location: {
          options: [
            {
              name: 'Gowanus',
              value: 'gowanus',
            },
          ],
        },
        duration: {
          options: getDurationSelections(),
        },
        start: {
          options: getTimeSelections(new Date(), 15),
        },
        type: {
          options: [
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
          ],
        },
      }}
      renderAfter={({ submit }) => (
        <Theme inverse>
          <SubmitButton onPress={() => submit()}>Submit</SubmitButton>
        </Theme>
      )}
    >
      {(fields) => (
        <>
          <YStack gap="$2" py="$4" pb="$8">
            {isWeb && <H2 ta="center">New Project</H2>}
            <Paragraph ta="center">Dummy page showing a form</Paragraph>
          </YStack>
          {Object.values(fields)}
        </>
      )}
    </SchemaForm>
  )
}
