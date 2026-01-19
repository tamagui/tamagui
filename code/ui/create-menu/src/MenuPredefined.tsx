import { getSpace } from '@tamagui/get-token'
import { Image } from '@tamagui/image'
import { styled, Text, View } from '@tamagui/web'

/* -------------------------------------------------------------------------------------------------
 * MenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'MenuGroup'

const MenuGroup = styled(View, {
  name: GROUP_NAME,
  variants: {
    unstyled: {
      false: {
        role: 'group',
        width: '100%',
        borderRadius: 0,
        borderWidth: 0,
        borderColor: '$borderColor',
        overflow: 'hidden',
        backgroundColor: '$background',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'MenuLabel'

const MenuLabel = styled(Text, {
  name: LABEL_NAME,

  variants: {
    unstyled: {
      false: {
        cursor: 'default',
        fontSize: 13,
        fontWeight: '600',
        color: '$color',
        paddingHorizontal: '$3',
        paddingTop: '$2',
        paddingBottom: '$1',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
  MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'MenuSeparator'

const MenuSeparator = styled(View, {
  name: SEPARATOR_NAME,
  role: 'separator',
  // @ts-ignore
  'aria-orientation': 'horizontal',

  variants: {
    unstyled: {
      false: {
        borderColor: '$borderColor',
        flexShrink: 0,
        borderWidth: 0,
        height: 1,
        marginVertical: '$1.5',
        marginHorizontal: '$3',
        backgroundColor: '$borderColor',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const MenuIcon = styled(View, {
  name: 'MenuIcon',

  variants: {
    unstyled: {
      false: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        marginLeft: 'auto',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const MenuImage = styled(Image, { name: 'MenuImage' })

const MenuIndicator = styled(View, {
  name: 'MenuIndicator',

  variants: {
    unstyled: {
      false: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const MenuItem = styled(View, {
  name: 'MenuItem',

  variants: {
    unstyled: {
      false: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        gap: '$3',
        cursor: 'pointer',
        borderRadius: '$3',

        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
        focusVisibleStyle: {
          backgroundColor: '$backgroundFocus',
        },
      },
    },

    size: {
      '...size': (val) => {
        if (!val) return
        const paddingVertical = getSpace(val, {
          shift: -2,
          bounds: [2],
        })
        const paddingHorizontal = getSpace(val, {
          shift: -1,
          bounds: [2],
        })

        return {
          paddingVertical,
          paddingHorizontal,
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
    size: '$3',
  },
})

const Title = styled(Text, {
  name: 'MenuTitle',

  variants: {
    unstyled: {
      false: {
        cursor: 'default',
        fontSize: 16,
        fontWeight: '400',
        color: '$color',
        flexGrow: 1,
        flexShrink: 1,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const SubTitle = styled(Text, {
  name: 'MenuSubTitle',

  variants: {
    unstyled: {
      false: {
        cursor: 'default',
        fontSize: 14,
        color: '$colorFaint',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const MenuPredefined = {
  MenuIcon,
  MenuImage,
  MenuIndicator,
  MenuItem,
  Title,
  SubTitle,
  MenuGroup,
  MenuSeparator,
  MenuLabel,
}
