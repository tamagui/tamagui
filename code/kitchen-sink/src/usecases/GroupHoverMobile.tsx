import { Stack, Text, XStack, styled } from 'tamagui'
import { Star } from '@tamagui/lucide-icons'

const GroupContainer = styled(Stack, {
  group: 'testy',
  padding: '$4',
  backgroundColor: '$background',
  borderRadius: '$4',
  cursor: 'pointer',
})

const GroupText = styled(Text, {
  color: 'rgb(0, 0, 0)',

  '$group-testy-hover': {
    color: 'rgb(255, 0, 0)',
  },
})

const GroupIcon = styled(Star, {
  color: 'rgb(0, 0, 0)',

  '$group-testy-hover': {
    color: 'rgb(255, 0, 0)',
  },
})

export function GroupHoverMobile() {
  return (
    <Stack padding="$4" gap="$4">
      <GroupContainer id="group-hover-container">
        <XStack gap="$2" alignItems="center">
          <GroupIcon id="group-hover-icon" size={24} />
          <GroupText id="group-hover-text">Hover me</GroupText>
        </XStack>
      </GroupContainer>
    </Stack>
  )
}
