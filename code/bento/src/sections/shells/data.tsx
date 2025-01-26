export const listingData = [
  {
    sectionName: 'shells',
    parts: [
      {
        name: 'Navbar',
        numberOfComponents: 2,
        route: '/shells/navbars',
      },
      {
        name: 'Sidebar',
        numberOfComponents: 1,
        route: '/shells/sidebars',
      },
      {
        name: 'Tabbar',
        numberOfComponents: 3,
        route: '/shells/tabbars',
      },
    ],
  },
]

export const paths: {
  params: {
    section: 'shells'
    part: string
  }
}[] = [
  {
    params: {
      section: 'shells',
      part: 'navbars',
    },
  },
  {
    params: {
      section: 'shells',
      part: 'sidebars',
    },
  },
  {
    params: {
      section: 'shells',
      part: 'tabbars',
    },
  },
]
