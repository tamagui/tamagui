import {
  SizeTokens,
  Stack,
  Text,
  createStyledContext,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import { getSpace } from '@tamagui/get-token'

export const ButtonContext = createStyledContext({
  size: '$4' as SizeTokens,
})

export const ButtonFrame = styled(Stack, {
  name: 'Button',
  context: ButtonContext,
  backgroundColor: '$background',
  alignItems: 'center',
  flexDirection: 'row',

  variants: {
    size: {
      '...size': (name, { tokens }) => ({
        height: tokens.size[name],
        borderRadius: tokens.radius[name],
        paddingHorizontal: getSpace(tokens.space[name], {
          shift: -1,
        }),
      }),
    },
  } as const,
})

export const ButtonText = styled(Text, {
  name: 'ButtonText',
  context: ButtonContext,
  color: '$color',

  variants: {
    size: {
      '...fontSize': (name, { font }) => ({
        fontSize: font?.size[name],
      }),
    },
  } as const,
})

export const Button = withStaticProperties(ButtonFrame, {
  Provider: ButtonContext.Provider,
  Text: ButtonText,
})

export const CustomButtonDemo = () => {
  return (
    <>
      <Button size="$10">
        <Button.Text>hi</Button.Text>
      </Button>

      <Button size="$5">
        <Button.Text>hi</Button.Text>
      </Button>

      <Button.Provider size="$10">
        <Button>
          <Button.Text>hi</Button.Text>
        </Button>
      </Button.Provider>

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
