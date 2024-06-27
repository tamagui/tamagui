export const sponsorshipDateMap = {
  NOT_SPONSOR: {
    tierName: null,
    dateStr: 'late October 2023',
    date: new Date(2023, 10, 30),
  },

  ST_kwDNL0TOAAMT2w: {
    tierName: '$10 a month',
    dateStr: 'late September 2023',
    date: new Date(2023, 9, 30),
  },

  ST_kwDNL0TOAANQFA: {
    tierName: '$100 a month',
    dateStr: 'late May 2023',
    date: new Date(2023, 4, 30),
  },

  ST_kwDNL0TOAAPNDw: {
    tierName: '$200 a month',
    dateStr: 'May 2023',
    date: new Date(2023, 4, 1),
  },

  ST_kwDNL0TOAAPNEQ: {
    tierName: '$500 a month',
    dateStr: 'April 2023',
    date: new Date(2023, 3, 1),
  },

  ST_kwDNL0TOAAPNEg: {
    tierName: '$1,000 a month',
    dateStr: 'April 2023',
    date: new Date(2023, 3, 1),
  },
  /*
      N/A:
      $50 one time "ST_kwDNL0TOAAMTSA"
      $100 one time "ST_kwDNL0TOAAMT2g"
      $400 one time "ST_kwDNL0TOAAMTSg"
      */
}

/**
 * smaller index = highest priority
 */
export const tiersPriority: (keyof typeof sponsorshipDateMap)[] = [
  'ST_kwDNL0TOAAPNEg',
  'ST_kwDNL0TOAAPNEQ',
  'ST_kwDNL0TOAAPNDw',
  'ST_kwDNL0TOAANQFA',
  'ST_kwDNL0TOAAMT2w',
  'NOT_SPONSOR',
]
