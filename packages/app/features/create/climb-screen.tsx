import { H2, Paragraph, SubmitButton, Theme, YStack, isWeb } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import {
  add,
  addHours,
  addMinutes,
  format,
  formatDuration,
  isAfter,
  roundToNearestMinutes,
  startOfDay,
} from 'date-fns'
import { api } from 'app/utils/api'
import { z } from 'zod'

function getWeekDaySelections() {
  // TODO: Get the next 7 days
  // TODO: premium can book farther out and have RRULES
  return [
    {
      name: 'Today',
      value: '0',
    },
    {
      name: 'Tomorrow',
      value: '1',
    },
    {
      name: `${format(add(new Date(), { days: 2 }), 'EEEE')}`,
      value: '2',
    },
    {
      name: `${format(add(new Date(), { days: 3 }), 'EEEE')}`,
      value: '3',
    },
    {
      name: `${format(add(new Date(), { days: 4 }), 'EEEE')}`,
      value: '4',
    },
    {
      name: `${format(add(new Date(), { days: 5 }), 'EEEE')}`,
      value: '5',
    },
    {
      name: `${format(add(new Date(), { days: 6 }), 'EEEE')}`,
      value: '6',
    },
  ]
}

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
  const climbMutation = api.climb.create.useMutation()
  return (
    <SchemaForm
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2))
        climbMutation.mutate(values)
      }}
      schema={z.object({
        name: formFields.text.min(10).describe('Name // Afternoon Top Rope 5.9+'),
        type: formFields.select.describe('Climb Type'),
        start: formFields.select.describe('Start Time'),
        // Will always be in minutes, and 15 minute increments
        duration: formFields.select.describe('Duration'),
        location: formFields.select.describe('Location'),
        day: formFields.select.describe('Day'),
      })}
      defaultValues={{
        name: '',
        // start: getTimeSelections(new Date(), 15)[0].value,
        duration: getDurationSelections()[1].value,
        location: 'gowanus',
        type: 'top_rope',
        day: getWeekDaySelections()[0].value,
      }}
      props={{
        day: {
          options: getWeekDaySelections(),
        },
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
            {isWeb && <H2 ta="center">Post a Climb</H2>}
            <Paragraph ta="center">Find a belayer in the community</Paragraph>
          </YStack>
          {Object.values(fields)}
        </>
      )}
    </SchemaForm>
  )
}
