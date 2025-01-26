// export * from './dialog'
export const paths: {
  params: {
    section: 'panels'
    part: string
  }
}[] = [
  {
    params: {
      section: 'panels',
      part: 'walkthrough',
    },
  },
  // {
  //   params: {
  //     section: 'panels',
  //     part: 'dialog',
  //   },
  // },
]

export const listingData = [
  {
    sectionName: 'Panels',
    parts: [
      // TODO: Add WalkThrough back in when it's ready
      // {
      //   name: 'WalkThrough',
      //   numberOfComponents: 2,
      //   route: '/panels/walkthrough',
      // },
      // {
      //   name: 'dialog',
      //   numberOfComponents: 1,
      //   route: '/panels/dialog',
      // },
    ],
  },
]
