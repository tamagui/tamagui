export * from './preferences'
export * from './events'
export const paths: {
  params: {
    section: 'user'
    part: string
  }
}[] = [
  {
    params: {
      section: 'user',
      part: 'preferences',
    },
  },
  {
    params: {
      section: 'user',
      part: 'events',
    },
  },
]

export const listingData = [
  {
    sectionName: 'user',
    parts: [
      {
        name: 'Preferences',
        numberOfComponents: 1,
        route: '/user/preferences',
      },
      {
        name: 'Event Reminders',
        numberOfComponents: 2,
        route: '/user/events',
      },
    ],
  },
]
