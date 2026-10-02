import type { ThemeSuiteItemData } from '~/features/studio/theme/types'

export type FreeTheme = {
  id: number
  label: string
  slug: string
  searchQuery: string
  accentColor: string
  baseColor: string
  themeData: ThemeSuiteItemData & { templateStrategy?: string }
}

export const freeThemes: FreeTheme[] = [
  {
    id: 1980,
    label: 'B/W',
    slug: 'black-and-white-hi-contrast',
    searchQuery: 'black & white hi contrast',
    themeData: {
      name: 'a bit more separation between color1, 2, 3, 4 so borders show a bit better',
      schemes: {
        dark: true,
        light: true,
      },
      palettes: {
        base: {
          name: 'base',
          anchors: [
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
              },
              lum: {
                dark: 0,
                light: 1,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 0,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.05,
                light: 0.96,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 1,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.1,
                light: 0.92,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 2,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.16,
                light: 0.87,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 3,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.22,
                light: 0.82,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 4,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.55,
                light: 0.45,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 9,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.94,
                light: 0.08,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 10,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 1,
                light: 0,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 11,
            },
          ],
        },
        accent: {
          name: 'accent',
          anchors: [
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
              },
              lum: {
                dark: 0.92,
                light: 0.08,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 0,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.75,
                light: 0.25,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 3,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.5,
                light: 0.5,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 8,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.12,
                light: 0.88,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 9,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.06,
                light: 0.94,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 10,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0,
                light: 1,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 11,
            },
          ],
        },
      },
      templateStrategy: 'base',
    },
    accentColor: '#ffffff',
    baseColor: '#111111',
  },
  {
    id: 1951,
    label: 'Ocean',
    slug: 'ocean-blue-theme',
    searchQuery: 'ocean blue theme',
    themeData: {
      name: 'ocean blue theme',
      schemes: {
        dark: true,
        light: true,
      },
      palettes: {
        base: {
          name: 'base',
          anchors: [
            {
              hue: {
                dark: 205,
                sync: true,
                light: 205,
              },
              lum: {
                dark: 0.08,
                light: 0.97,
              },
              sat: {
                dark: 0.2,
                light: 0.15,
              },
              index: 0,
            },
            {
              hue: {
                dark: 205,
                sync: true,
                light: 205,
                syncLeft: true,
              },
              lum: {
                dark: 0.25,
                light: 0.85,
              },
              sat: {
                dark: 0.18,
                light: 0.12,
              },
              index: 4,
            },
            {
              hue: {
                dark: 205,
                sync: true,
                light: 205,
                syncLeft: true,
              },
              lum: {
                dark: 0.55,
                light: 0.45,
              },
              sat: {
                dark: 0.2,
                light: 0.15,
              },
              index: 9,
            },
            {
              hue: {
                dark: 205,
                sync: true,
                light: 205,
                syncLeft: true,
              },
              lum: {
                dark: 0.85,
                light: 0.25,
              },
              sat: {
                dark: 0.15,
                light: 0.2,
              },
              index: 10,
            },
            {
              hue: {
                dark: 205,
                sync: true,
                light: 205,
                syncLeft: true,
              },
              lum: {
                dark: 0.95,
                light: 0.12,
              },
              sat: {
                dark: 0.1,
                light: 0.25,
              },
              index: 11,
            },
          ],
        },
        accent: {
          name: 'accent',
          anchors: [
            {
              hue: {
                dark: 195,
                sync: true,
                light: 195,
              },
              lum: {
                dark: 0.3,
                light: 0.55,
              },
              sat: {
                dark: 0.5,
                light: 0.6,
              },
              index: 0,
            },
            {
              hue: {
                dark: 200,
                sync: true,
                light: 200,
              },
              lum: {
                dark: 0.4,
                light: 0.5,
              },
              sat: {
                dark: 0.55,
                light: 0.65,
              },
              index: 4,
            },
            {
              hue: {
                dark: 210,
                sync: true,
                light: 210,
              },
              lum: {
                dark: 0.55,
                light: 0.45,
              },
              sat: {
                dark: 0.6,
                light: 0.7,
              },
              index: 9,
            },
            {
              hue: {
                dark: 210,
                sync: true,
                light: 210,
                syncLeft: true,
              },
              lum: {
                dark: 0.88,
                light: 0.2,
              },
              sat: {
                dark: 0.5,
                light: 0.6,
              },
              index: 10,
            },
            {
              hue: {
                dark: 215,
                sync: true,
                light: 215,
                syncLeft: true,
              },
              lum: {
                dark: 0.95,
                light: 0.15,
              },
              sat: {
                dark: 0.4,
                light: 0.5,
              },
              index: 11,
            },
          ],
        },
      },
      templateStrategy: 'base',
    },
    accentColor: '#0ea5e9',
    baseColor: '#1e293b',
  },
  {
    id: 82,
    label: 'SUPER',
    slug: 'supreme',
    searchQuery: 'SUPREME',
    themeData: {
      name: 'can u just make a *bit* more spread between the dark and light reds from 1-9? not a ton but maybe 25%',
      schemes: {
        dark: true,
        light: true,
      },
      palettes: {
        base: {
          name: 'base',
          anchors: [
            {
              hue: {
                dark: 358,
                sync: true,
                light: 358,
              },
              lum: {
                dark: 0.32,
                light: 0.52,
              },
              sat: {
                dark: 1,
                sync: true,
                light: 1,
              },
              index: 0,
            },
            {
              hue: {
                dark: 358,
                sync: true,
                light: 358,
                syncLeft: true,
              },
              lum: {
                dark: 0.45,
                light: 0.45,
              },
              sat: {
                dark: 1,
                sync: true,
                light: 1,
              },
              index: 4,
            },
            {
              hue: {
                dark: 358,
                sync: true,
                light: 358,
                syncLeft: true,
              },
              lum: {
                dark: 0.58,
                light: 0.38,
              },
              sat: {
                dark: 1,
                sync: true,
                light: 1,
              },
              index: 8,
            },
            {
              hue: {
                dark: 358,
                sync: true,
                light: 358,
                syncLeft: true,
              },
              lum: {
                dark: 0.65,
                light: 0.35,
              },
              sat: {
                dark: 1,
                sync: true,
                light: 1,
              },
              index: 9,
            },
            {
              hue: {
                dark: 358,
                sync: true,
                light: 358,
                syncLeft: true,
              },
              lum: {
                dark: 0.75,
                light: 1,
              },
              sat: {
                dark: 1,
                sync: true,
                light: 1,
              },
              index: 10,
            },
            {
              hue: {
                dark: 358,
                sync: true,
                light: 358,
                syncLeft: true,
              },
              lum: {
                dark: 0.95,
                light: 1,
              },
              sat: {
                dark: 1,
                sync: true,
                light: 1,
              },
              index: 11,
            },
          ],
        },
        accent: {
          name: 'accent',
          anchors: [
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
              },
              lum: {
                dark: 0.02,
                light: 0.99,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 0,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.15,
                light: 0.85,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 4,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.5,
                light: 0.5,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 9,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.85,
                light: 0.15,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 10,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.98,
                light: 0.03,
              },
              sat: {
                dark: 0,
                sync: true,
                light: 0,
              },
              index: 11,
            },
          ],
        },
      },
      templateStrategy: 'base',
    },
    accentColor: '#ef4444',
    baseColor: '#18181b',
  },
  {
    id: 53,
    label: 'Cactus',
    slug: 'desert',
    searchQuery: 'desert',
    themeData: {
      name: 'light accent fg dark brown',
      schemes: {
        dark: true,
        light: true,
      },
      palettes: {
        base: {
          name: 'base',
          anchors: [
            {
              hue: {
                dark: 32.00000000000001,
                sync: true,
                light: 32.00000000000001,
              },
              lum: {
                dark: 0.27,
                light: 0.97,
              },
              sat: {
                dark: 0.15463917525773194,
                light: 0.25,
              },
              index: 0,
            },
            {
              hue: {
                dark: 32,
                light: 30,
              },
              lum: {
                dark: 0.22,
                light: 0.85,
              },
              sat: {
                dark: 0.18,
                light: 0.3,
              },
              index: 3,
            },
            {
              hue: {
                dark: 188,
                light: 26.999999999999996,
              },
              lum: {
                dark: 0.4294117647058823,
                light: 0.6392156862745098,
              },
              sat: {
                dark: 0.1872146118721461,
                light: 0.3260869565217391,
              },
              index: 5,
            },
            {
              hue: {
                dark: 30,
                light: 25,
              },
              lum: {
                dark: 0.5,
                light: 0.5,
              },
              sat: {
                dark: 0.2,
                light: 0.35,
              },
              index: 8,
            },
            {
              hue: {
                dark: 28,
                light: 20,
              },
              lum: {
                dark: 0.85,
                light: 0.2,
              },
              sat: {
                dark: 0.22,
                light: 0.4,
              },
              index: 9,
            },
            {
              hue: {
                dark: 25,
                light: 15,
              },
              lum: {
                dark: 0.95,
                light: 0.1,
              },
              sat: {
                dark: 0.25,
                light: 0.45,
              },
              index: 10,
            },
            {
              hue: {
                dark: 22,
                light: 10,
              },
              lum: {
                dark: 0.98,
                light: 0.05,
              },
              sat: {
                dark: 0.28,
                light: 0.5,
              },
              index: 11,
            },
          ],
        },
        accent: {
          name: 'accent',
          anchors: [
            {
              hue: {
                dark: 180,
                sync: true,
                light: 180,
              },
              lum: {
                dark: 0.3,
                light: 0.7,
              },
              sat: {
                dark: 0.6,
                light: 0.5,
              },
              index: 0,
            },
            {
              hue: {
                dark: 180,
                sync: true,
                light: 180,
                syncLeft: true,
              },
              lum: {
                dark: 0.35,
                light: 0.65,
              },
              sat: {
                dark: 0.55,
                light: 0.45,
              },
              index: 2,
            },
            {
              hue: {
                dark: 35,
                sync: true,
                light: 35,
              },
              lum: {
                dark: 0.4,
                light: 0.6,
              },
              sat: {
                dark: 0.7,
                light: 0.6,
              },
              index: 3,
            },
            {
              hue: {
                dark: 40,
                sync: true,
                light: 40,
              },
              lum: {
                dark: 0.6,
                light: 0.5,
              },
              sat: {
                dark: 0.65,
                light: 0.55,
              },
              index: 8,
            },
            {
              hue: {
                dark: 45,
                light: 30,
                syncLeft: true,
              },
              lum: {
                dark: 0.8,
                light: 0.35,
              },
              sat: {
                dark: 0.5,
                light: 0.65,
              },
              index: 9,
            },
            {
              hue: {
                dark: 48,
                light: 28,
              },
              lum: {
                dark: 0.9,
                light: 0.3,
              },
              sat: {
                dark: 0.45,
                light: 0.7,
              },
              index: 10,
            },
            {
              hue: {
                dark: 50,
                light: 25,
              },
              lum: {
                dark: 0.95,
                light: 0.25,
              },
              sat: {
                dark: 0.4,
                light: 0.75,
              },
              index: 11,
            },
          ],
        },
      },
      templateStrategy: 'base',
    },
    accentColor: '#eab308',
    baseColor: '#292524',
  },
  {
    id: 37,
    label: 'Neon',
    slug: 'nike-neon',
    searchQuery: 'nike neon',
    themeData: {
      name: 'dark accent 10 should be a lot darker',
      schemes: {
        dark: true,
        light: true,
      },
      palettes: {
        base: {
          name: 'base',
          anchors: [
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
              },
              lum: {
                dark: 0.01,
                light: 0.99,
              },
              sat: {
                dark: 0.15,
                sync: true,
                light: 0.15,
              },
              index: 0,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.5,
                light: 0.5,
              },
              sat: {
                dark: 0.15,
                sync: true,
                light: 0.15,
              },
              index: 9,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.99,
                light: 0.15,
              },
              sat: {
                dark: 0.15,
                sync: true,
                light: 0.15,
              },
              index: 10,
            },
            {
              hue: {
                dark: 0,
                sync: true,
                light: 0,
                syncLeft: true,
              },
              lum: {
                dark: 0.99,
                light: 0.01,
              },
              sat: {
                dark: 0.15,
                sync: true,
                light: 0.15,
              },
              index: 11,
            },
          ],
        },
        accent: {
          name: 'accent',
          anchors: [
            {
              hue: {
                dark: 83.47826086956522,
                sync: true,
                light: 83.47826086956522,
              },
              lum: {
                dark: 0.7,
                light: 0.5,
              },
              sat: {
                dark: 0.9,
                sync: true,
                light: 0.9,
              },
              index: 0,
            },
            {
              hue: {
                dark: 83.47826086956522,
                sync: true,
                light: 83.47826086956522,
                syncLeft: true,
              },
              lum: {
                dark: 0.52,
                light: 0.6,
              },
              sat: {
                dark: 0.92,
                sync: true,
                light: 0.92,
              },
              index: 9,
            },
            {
              hue: {
                dark: 83.47826086956522,
                sync: true,
                light: 83.47826086956522,
                syncLeft: true,
              },
              lum: {
                dark: 0.02,
                light: 0.05,
              },
              sat: {
                dark: 0.9,
                sync: true,
                light: 0.9,
              },
              index: 10,
            },
            {
              hue: {
                dark: 85,
                sync: true,
                light: 85,
                syncLeft: true,
              },
              lum: {
                dark: 0.01,
                light: 0.01,
              },
              sat: {
                dark: 0.9,
                sync: true,
                light: 0.9,
              },
              index: 11,
            },
          ],
        },
      },
      templateStrategy: 'base',
    },
    accentColor: '#84cc16',
    baseColor: '#000000',
  },
] as const
