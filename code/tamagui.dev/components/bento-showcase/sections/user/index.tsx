export * from './preferences'

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
]

export const listingData = [
  {
    sectionName: 'user',
    parts: [
      {
        name: 'Preferences',
        numberOfComponents: 3,
        route: '/user/preferences',
      },
    ],
  },
] as const
