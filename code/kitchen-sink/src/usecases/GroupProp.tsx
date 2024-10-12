import { Square, Stack, XStack, styled } from 'tamagui'

const GroupTest = styled(Stack, {
  group: 'testy',
})

const GroupChild = styled(Stack, {
  width: 100,
  height: 100,
  backgroundColor: 'pink',

  pressStyle: {
    backgroundColor: 'black',
  },

  '$group-testy': {
    backgroundColor: 'rgb(255,0,0)',

    hoverStyle: {
      backgroundColor: 'rgb(160, 32, 240)',
    },

    pressStyle: {
      backgroundColor: 'rgb(255,255,0)',
    },
  },

  '$group-testy-sm': {
    backgroundColor: 'rgb(0,255,0)',

    hoverStyle: {
      backgroundColor: 'rgb(160, 32, 240)',
    },

    pressStyle: {
      backgroundColor: 'rgb(255,255,0)',
    },
  },
})

const GroupChildMedia = styled(GroupChild, {
  width: 100,
  height: 100,
  backgroundColor: 'rgb(0,0,255)',

  '$group-testy': {
    backgroundColor: 'rgb(255,0,0)',

    hoverStyle: {
      backgroundColor: 'rgb(160, 32, 240)',
    },

    pressStyle: {
      backgroundColor: 'rgb(255,255,0)',
    },
  },

  '$group-testy-sm': {
    backgroundColor: 'rgb(0,255,0)',

    hoverStyle: {
      backgroundColor: 'rgb(160, 32, 240)',
    },

    pressStyle: {
      backgroundColor: 'rgb(255,255,0)',
    },
  },
})

export function GroupProp() {
  return (
    <Stack margin={20}>
      <GroupTest>
        <GroupChild id="styled" />
      </GroupTest>

      <GroupTest w={1000}>
        <GroupChildMedia id="styled-media-unmatched" />
      </GroupTest>

      <GroupTest w={200}>
        <GroupChildMedia id="styled-media-matched" />
      </GroupTest>

      <XStack group="testy">
        <Square
          id="inline"
          bg="rgb(255,0,0)"
          $group-testy={{ bg: 'rgb(0,0,255)' }}
          size={100}
        />
      </XStack>
    </Stack>
  )
}
