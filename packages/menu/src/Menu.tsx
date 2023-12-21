import { ThemeableStack } from '@tamagui/stacks'
import { Text, styled } from 'tamagui'

/* -------------------------------------------------------------------------------------------------
 * MenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'MenuGroup'

export const MenuGroup = styled(ThemeableStack, {
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

MenuGroup.displayName = GROUP_NAME

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'MenuLabel'

export const MenuLabel = styled(Text, {
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

MenuLabel.displayName = LABEL_NAME

/* -------------------------------------------------------------------------------------------------
  MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'MenuSeparator'

export const MenuSeparator = styled(ThemeableStack, {
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})
MenuSeparator.displayName = SEPARATOR_NAME
