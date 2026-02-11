import { styled, View, Text } from '@tamagui/core'

const Box = styled(View, {
  width: 100,
  height: 100,
  backgroundColor: 'white',

  variants: {
    variant: {
      outline: {
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'transparent',
      },
      filled: {
        backgroundColor: 'blue',
      },
    },
    size: {
      small: {
        width: 50,
        height: 50,
      },
      large: {
        width: 150,
        height: 150,
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  } as const,

  defaultVariants: {
    size: 'small',
  },

  compoundVariants: [
    {
      variant: 'outline',
      size: 'small',
      styles: {
        borderWidth: 1,
        borderColor: 'red',
      },
    },
    {
      variant: 'outline',
      size: 'large',
      styles: {
        borderWidth: 4,
        borderColor: 'green',
      },
    },
    {
      disabled: true,
      variant: 'filled',
      styles: {
        backgroundColor: 'gray',
      },
    },
    // test ordering: later entry overrides earlier for same conditions
    {
      variant: 'outline',
      size: 'small',
      styles: {
        borderColor: 'purple',
        // test nested pseudo - compound hover should lose to user hover
        hoverStyle: {
          borderColor: 'orange',
        },
      },
    },
    // test shorthand expansion
    {
      variant: 'filled',
      size: 'large',
      styles: {
        padding: 16,
        margin: 8,
      },
    },
  ],
})

const Label = styled(Text, {
  fontSize: 12,
  color: 'white',
  fontFamily: '$body',
})

const Description = styled(Text, {
  fontSize: 11,
  color: '#999',
  fontFamily: '$body',
})

function TestRow({
  label,
  expected,
  children,
}: {
  label: string
  expected: string
  children: React.ReactNode
}) {
  return (
    <View flexDirection="row" alignItems="center" gap={12} paddingVertical={6}>
      {children}
      <View>
        <Label>{label}</Label>
        <Description>Expected: {expected}</Description>
      </View>
    </View>
  )
}

export function CompoundVariantsCase() {
  return (
    <View padding={20} gap={4} backgroundColor="#1a1a1a">
      <Text color="white" fontSize={16} fontFamily="$body" marginBottom={8}>
        compoundVariants Test Cases
      </Text>

      <TestRow
        label="outline + small (compound match)"
        expected="border: 1px purple (later compound overrides red)"
      >
        <Box data-testid="outline-small" variant="outline" size="small" />
      </TestRow>

      <TestRow label="outline + large (compound match)" expected="border: 4px green">
        <Box data-testid="outline-large" variant="outline" size="large" />
      </TestRow>

      <TestRow
        label="filled + small (no compound)"
        expected="bg: blue (no compound for this combo)"
      >
        <Box data-testid="filled-small" variant="filled" size="small" />
      </TestRow>

      <TestRow
        label="outline + default size (defaultVariants)"
        expected="border: 1px purple (size defaults to small)"
      >
        <Box data-testid="outline-default-size" variant="outline" />
      </TestRow>

      <TestRow
        label="disabled + filled (boolean compound)"
        expected="bg: gray (boolean coercion)"
      >
        <Box data-testid="disabled-filled" variant="filled" disabled />
      </TestRow>

      <TestRow
        label="disabled + outline + small (partial compound)"
        expected="border: 1px purple + opacity: 0.5 (outline+small matches, disabled+outline has no compound)"
      >
        <Box data-testid="disabled-outline" variant="outline" size="small" disabled />
      </TestRow>

      <TestRow
        label="user hover overrides compound hover"
        expected="border: 1px purple, hover -> blue (user hover beats compound hover)"
      >
        <Box
          data-testid="user-hover-override"
          variant="outline"
          size="small"
          hoverStyle={{ borderColor: 'blue' }}
        />
      </TestRow>

      <TestRow
        label="shorthand expansion (padding + margin)"
        expected="padding: 16px all sides, margin: 8px all sides (shorthands expand)"
      >
        <Box data-testid="shorthand-expansion" variant="filled" size="large" />
      </TestRow>
    </View>
  )
}
