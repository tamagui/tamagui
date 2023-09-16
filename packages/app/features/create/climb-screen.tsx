import { H2, Paragraph, SubmitButton, Theme, YStack, isWeb, useToastController } from '@my/ui'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import {
  add,
  addDays,
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
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { Database } from '@my/supabase/types'

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

  const currentStartOfDay = startOfDay(new Date()) // Midnight

  // if current time is before 7AM, use 7AM as the start of the day
  // if current time is after 7am, use current time as the start of the day
  const now = new Date()

  // Needs to account for different days

  // if day is tomorrow, or greater then give full time selection to user
  // if day is today, then give time selection from now to end of day
  let weekDayStart
  let weekDayEnd
  let weekendStart
  let weekendEnd

  const tomorrowOrLater = isAfter(day, startOfDay(addDays(currentStartOfDay, 1)))
  const gymHasOpenedToday = isAfter(now, addHours(currentStartOfDay, 7))

  if (tomorrowOrLater) {
    // tomorrow
    // give full time selection
    weekDayStart = add(startOfDay(day), {
      hours: 7,
      minutes: 0,
    })

    weekDayEnd = add(day, {
      hours: 22,
      minutes: 30,
    })

    weekendStart = add(startOfDay(day), {
      hours: 9,
      minutes: 0,
    })

    weekendEnd = add(day, {
      hours: 21,
      minutes: 30,
    })

    // if now is after 7am, then give full time selection
  } else if (gymHasOpenedToday) {
    weekDayStart = roundToNearestMinutes(now, { nearestTo: increment })
    weekendStart = roundToNearestMinutes(now, { nearestTo: increment })
    weekDayEnd = add(currentStartOfDay, {
      hours: 22,
      minutes: 30,
    })
    weekendEnd = add(currentStartOfDay, {
      hours: 21,
      minutes: 30,
    }) // 9:30PM
  } else {
    weekDayStart = addHours(currentStartOfDay, 7)
    weekendStart = addHours(currentStartOfDay, 9)

    weekDayEnd = add(currentStartOfDay, {
      hours: 22,
      minutes: 30,
    })

    weekendEnd = add(currentStartOfDay, {
      hours: 21,
      minutes: 30,
    }) // 9:30PM
  }

  const formattedDayOfWeek = format(day, 'EEEE').toLowerCase()

  if (weekdays.includes(formattedDayOfWeek)) {
    return getTimeSelectionsForDay(weekDayStart, weekDayEnd, increment)
  } else if (gymHasOpenedToday) {
    return getTimeSelectionsForDay(weekendStart, weekendEnd, increment)
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
const ClimbScreenSchema = z.object({
  name: formFields.text.min(10).describe('Name // Afternoon Top Rope 5.9+'),
  type: formFields.select.describe('Climb Type'),
  start: formFields.select.describe('Start Time'),
  // Will always be in minutes, and 15 minute increments
  duration: formFields.select.describe('Duration'),
  location: formFields.select.describe('Location'),
  day: formFields.select.describe('Day'),
})

export const CreateScreen = () => {
  const router = useRouter()
  const toast = useToastController()
  const climbMutation = api.climb.create.useMutation()
  const me = api.me.profile.useQuery()

  const form = useForm<z.infer<typeof ClimbScreenSchema>>({
    defaultValues: {
      type: 'top_rope',
      start: getTimeSelections(new Date(), 15)[0].value,
      duration: getDurationSelections()?.[1]?.value,
      location: 'gowanus',
      day: getWeekDaySelections()?.[0]?.value,
    },
  })
  const day = useWatch<z.infer<typeof ClimbScreenSchema>>({
    control: form.control,
    name: 'day',
  })
  const queryClient = useQueryClient()

  return (
    <FormProvider {...form}>
      <SchemaForm
        form={form}
        onSubmit={async (values) => {
          toast.show('Sucess!', {
            message: `Climb created`,
          })
          climbMutation.mutate(values, {
            onSuccess: () => {
              queryClient.invalidateQueries([['climb', 'read'], { type: 'query' }])
              // const oldData = queryClient.getQueryData<
              //   Database['public']['Tables']['climbs']['Row'][]
              // >([['climb', 'read'], { type: 'query' }])

              // // Create optimistic update
              // queryClient.setQueryData<Database['public']['Tables']['climbs']['Row'][]>(
              //   [['climb', 'read'], { type: 'query' }],
              //   (old) => {
              //     if (!old) {
              //       return []
              //     }
              //     const idx = old?.findIndex((c) => c.start >= values.start)
              //     old.splice(idx, 0, {
              //       id: 99999999,
              //       name: values.name,
              //       created_at: new Date().toISOString(),
              //       created_by: me.data?.id ?? '',
              //       start: add(new Date(values.start), {
              //         days: Number(values.day),
              //       }).toISOString(),
              //       duration: add(new Date(values.start), {
              //         minutes: Number(values.duration),
              //       }).toISOString(),
              //       type: 'top_rope',
              //     })

              //     return
              //   }
              // )
              router.push('/')
            },
          })
        }}
        schema={ClimbScreenSchema}
        defaultValues={form.formState.defaultValues}
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
            options: getTimeSelections(add(new Date(), { days: Number(day) }), 15),
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
    </FormProvider>
  )
}
