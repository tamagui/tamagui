import React from 'react'
import { SizableText, ToggleGroup, YStack, styled } from 'tamagui'

// repro for community issue: a styled(ToggleGroup.Item) variant that sets a
// resting backgroundColor breaks activeStyle. `filled` sets backgroundColor at
// rest; `primary` sets no backgroundColor. Both pass activeStyle={{backgroundColor:'green'}}.
// expected: the active item shows green. bug: filled item stays red on active.

const FilledItem = styled(ToggleGroup.Item, {
  variants: {
    filled: {
      true: {
        backgroundColor: 'red',
      },
    },
    primary: {
      true: {
        borderColor: 'blue',
        borderWidth: 2,
      },
    },
  } as const,
})

export function ToggleGroupFilledActiveCase() {
  const [value, setValue] = React.useState('a')

  return (
    <YStack p="$4" gap="$4">
      <ToggleGroup
        id="tg-filled"
        type="single"
        value={value}
        onValueChange={(v) => v && setValue(v)}
        disableDeactivation
      >
        <FilledItem
          filled
          value="a"
          id="filled-a"
          width={120}
          height={40}
          activeStyle={{ backgroundColor: 'green' }}
        >
          <SizableText>filled-a</SizableText>
        </FilledItem>
        <FilledItem
          filled
          value="b"
          id="filled-b"
          width={120}
          height={40}
          activeStyle={{ backgroundColor: 'green' }}
        >
          <SizableText>filled-b</SizableText>
        </FilledItem>
        <FilledItem
          primary
          value="c"
          id="primary-c"
          width={120}
          height={40}
          activeStyle={{ backgroundColor: 'green' }}
        >
          <SizableText>primary-c</SizableText>
        </FilledItem>
      </ToggleGroup>
    </YStack>
  )
}
