import { Image } from '@tamagui/image'
import { SizableText } from '@tamagui/text'
import { styled, View } from '@tamagui/web'

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

const MenuLabel = styled(SizableText, {
  name: LABEL_NAME,

  variants: {
    unstyled: {
      false: {
        cursor: 'default',
        color: '$color',
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
        marginVertical: 3,
        marginHorizontal: 10,
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
        cursor: 'pointer',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,

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
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const Title = styled(SizableText, {
  name: 'MenuTitle',

  variants: {
    unstyled: {
      false: {
        cursor: 'default',
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

const SubTitle = styled(SizableText, {
  name: 'MenuSubTitle',

  variants: {
    unstyled: {
      false: {
        cursor: 'default',
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
