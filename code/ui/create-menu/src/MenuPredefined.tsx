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
  cursor: 'default',
  fontSize: 18,
  fontWeight: '600',
  paddingHorizontal: 16,
  paddingVertical: 18,
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
        flex: 1,
        height: 0,
        gap: 5,
        marginVertical: 8,
        borderBottomWidth: 1,
        width: '100%',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const MenuIcon = styled(View, { name: 'MenuIcon' })

const MenuImage = styled(Image, { name: 'MenuImage' })

const MenuIndicator = styled(View, {
  name: 'MenuIndicator',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 'auto',
})

const MenuItem = styled(View, {
  name: 'MenuItem',
  flexDirection: 'row',
  maxWidth: '100%',
  justifyContent: 'space-between',
  paddingVertical: 20,
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
})

const Title = styled(Text, {
  name: 'MenuTitle',
  cursor: 'default',
  fontSize: 16,
  fontWeight: '500',
  color: '$color',
})

const SubTitle = styled(Text, {
  name: 'MenuSubTitle',
  cursor: 'default',
  fontSize: 14,
  color: '$colorFaint',
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
