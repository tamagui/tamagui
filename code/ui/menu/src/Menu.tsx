import { styled, Text } from '@tamagui/core'
import { Image } from '@tamagui/image'
import { ThemeableStack } from '@tamagui/stacks'

/* -------------------------------------------------------------------------------------------------
 * MenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'MenuGroup'

const MenuGroup = styled(ThemeableStack, {
  name: GROUP_NAME,
  variants: {
    unstyled: {
      false: {
        role: 'group',
        width: '100%',
      },
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

MenuGroup.displayName = GROUP_NAME

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'MenuLabel'

const MenuLabel = styled(Text, {
  name: LABEL_NAME,
  variants: {
    unstyled: {
      false: {
        paddingHorizontal: '$4',
        color: 'gray',
        textAlign: 'left',
        width: '100%',
      },
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

MenuLabel.displayName = LABEL_NAME

/* -------------------------------------------------------------------------------------------------
  MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'MenuSeparator'

const MenuSeparator = styled(ThemeableStack, {
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
        maxHeight: 0,
        borderBottomWidth: 1,
        width: '100%',
      },
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})
MenuSeparator.displayName = SEPARATOR_NAME

const MenuIcon = ThemeableStack
const MenuImage = Image
const MenuIndicator = ThemeableStack
const MenuItem = styled(ThemeableStack, { flexDirection: 'row', maxWidth: '100%' })
const Title = Text
const SubTitle = Text

export const MenuPredefinied = {
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
