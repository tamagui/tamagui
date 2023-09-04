import { AddToCalendarButton as AddToCalendarWeb } from 'add-to-calendar-button-react'
import { AddToCalendarButtonProps } from 'add-to-calendar-button-react/dist/AddToCalendarButton'
import { H1, YStack } from 'tamagui'

export const AddToCalendarButton = (props: AddToCalendarButtonProps) => {
  // const config = {
  //   name: '[Reminder] Test the Add to Calendar Button',
  //   description:
  //     'Check out the maybe easiest way to include Add to Calendar Buttons to your web projects:[br]→ [url]https://add-to-calendar-button.com/',
  //   startDate: '2023-09-07',
  //   startTime: '10:15',
  //   endTime: '23:30',
  //   options: ['Google|My custom label', 'iCal'],
  //   timeZone: 'America/Los_Angeles',
  // }
  return (
    <YStack>
      <AddToCalendarWeb {...props} />
    </YStack>
  )
}
