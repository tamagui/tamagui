export const paths: {
  params: {
    section: 'animation'
    part: string
  }
}[] = [
  {
    params: {
      section: 'animation',
      part: 'buttons',
    },
  },
  {
    params: {
      section: 'animation',
      part: 'microinteractions',
    },
  },
  {
    params: {
      section: 'animation',
      part: 'slide',
    },
  },
  {
    params: {
      section: 'animation',
      part: 'avatars',
    },
  },
]

export const listingData = [
  {
    sectionName: 'animation',
    parts: [
      {
        name: 'Buttons',
        numberOfComponents: 3,
        route: '/animation/buttons',
      },
      {
        name: 'Microinteractions',
        numberOfComponents: 3,
        route: '/animation/microinteractions',
      },
      {
        name: 'Slide',
        numberOfComponents: 2,
        route: '/animation/slide',
      },
      {
        name: 'Avatars',
        numberOfComponents: 2,
        route: '/animation/avatars',
      },
    ],
  },
] as const
