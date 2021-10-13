import { Stack, styled } from '@tamagui/core'

export const YStack = styled(Stack, {
  flexDirection: 'column',

  variants: {
    fullscreen: {
      true: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },

    elevation: {
      '...size': (size, { tokens, theme }) => {
        const s = tokens.size[size] ?? size
        const shadow = {
          shadowColor: theme.shadowColor,
          shadowRadius: s,
          shadowOffset: { height: +size * 2, width: 0 },
        }
        return shadow
      },
    },
  },
})

export const XStack = styled(YStack, {
  flexDirection: 'row',
})

// // test types
// TODO regressed :(
// type YProps = PropTypes<typeof YStack>
// type x = YProps['children']
// type test<A> = A extends StaticComponent<any, infer B> ? B : null
// type x2 = test<typeof YStack>
// const x00 = <Stack missing={0} />
// const x0 = <YStack missing={0} />
// const x1 = (props: StackProps) => <YStack {...props} />
