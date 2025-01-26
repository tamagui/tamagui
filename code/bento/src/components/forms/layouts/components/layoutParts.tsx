import { View, styled } from 'tamagui'
import { useGroupMedia } from '../../../hooks/useGroupMedia'
import type { MediaQueryKey } from '@tamagui/web'

export const FormCard = styled(View, {
  tag: 'form',
  flexDirection: 'row',
  maxWidth: '100%',
  borderRadius: 30,
  '$group-window-gtSm': {
    padding: '$6',
    shadowColor: '$shadowColor',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
  },
  '$group-window-xs': {
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: '$1',
  },
})

export const Hide = ({
  children,
  when = 'sm',
}: { children: React.ReactNode; when: MediaQueryKey }) => {
  const hide = useGroupMedia('window')[when]

  if (hide) {
    return null
  }
  return children
}
