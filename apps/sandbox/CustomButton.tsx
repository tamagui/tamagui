import { getSize, getSpace } from '@tamagui/get-token'
import { Moon } from '@tamagui/lucide-icons'
import {
  GetProps,
  SizeTokens,
  Stack,
  Text,
  createStyledContext,
  styled,
  useTheme,
  withStaticProperties,
} from '@tamagui/web'
import { cloneElement, useContext } from 'react'

export const ButtonContext = createStyledContext({
  size: '$4' as SizeTokens,
})

export const ButtonFrame = styled(Stack, {
  name: 'Button',
  context: ButtonContext,
  backgroundColor: '$background',
  alignItems: 'center',
  flexDirection: 'row',

  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
  },

  variants: {
    size: {
      '...size': (name, { tokens }) => {
        return {
          height: tokens.size[name],
          borderRadius: tokens.radius[name],
          gap: tokens.space[name].val * 0.2,
          paddingHorizontal: getSpace(name, {
            shift: -1,
          }),
        }
      },
    },
  } as const,

  defaultVariants: {
    size: '$4',
  },
})

type ButtonProps = GetProps<typeof ButtonFrame>

export const ButtonText = styled(Text, {
  name: 'ButtonText',
  context: ButtonContext,
  color: '$color',
  userSelect: 'none',

  variants: {
    size: {
      '...fontSize': (name, { font }) => ({
        fontSize: font?.size[name],
      }),
    },
  } as const,
})

const ButtonIcon = (props: { children: any }) => {
  const { size } = useContext(ButtonContext)
  const smaller = getSize(size, {
    shift: -2,
  })
  const theme = useTheme()
  return cloneElement(props.children, {
    size: smaller.val * 0.5,
    color: theme.color.get(),
  })
}

export const Button = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
  Icon: ButtonIcon,
})

export const CustomButtonDemo = () => {
  return (
    <>
      <CustomButton size="$2" />
      <CustomButton size="$3" />
      <CustomButton />
      <CustomButton size="$5" />
      <CustomButton size="$6" />
      <CustomButton size="$7" />

      <Button size="$5">
        <Button.Text>hi</Button.Text>
      </Button>

      <Button.Props size="$10">
        <Button>
          <Button.Text>hi</Button.Text>
        </Button>
      </Button.Props>

      {/* ensure that we can scope them like radix */}
      <Button size="$10">
        <Button.Text>hi</Button.Text>

        {/* this should create a new scope */}
        <Button size="$2">
          <Button.Text>hi</Button.Text>
        </Button>
      </Button>
    </>
  )
}

const CustomButton = (props: ButtonProps) => (
  <Button {...props}>
    <Button.Icon>
      <Moon />
    </Button.Icon>
    <Button.Text>hi</Button.Text>
  </Button>
)

/**
 * Button.Provider + Flattening ?
 *
 *   1. provider + flattening only works if you only use static variants or `...` functional variants
 *   2. <Button.Provider size="$10" /> could flatten but not necessary, but outputs:
 *      - div className="provide_Button-size-10"
 *      - will generate CSS:
 *           .provide_Button-size-10 { --Button-size: var(--size-10) }
 *   3. then Button with variant ...size would pre-generate all your ...size tokens?
 *      .provide_Button-size-10 .is_Button { height: var(--size-10); border-radius: var(--space-8); }
 *      .provide_Button-size-9 .is_Button { height: var(--size-9); border-radius: var(--space-7); }
 *   4. this is ok to be non-atomic because its provided in context so anything set directly on button will override it
 *       - to be less specific somehow may need either :root on every other selector
 *       - or @layer
 *       - or maybe :where() but then its the same specificity right
 *
 */
