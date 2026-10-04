import { View, styled } from 'tamagui'
import { useGroupMedia } from '../../../hooks/useGroupMedia'
import type { MediaQueryKey } from '@tamagui/web'

export const FormCard = styled(View, {
  render: 'form',
  flexDirection: 'row',
  maxW: '100%',
  rounded: '30px xs:0px',
  bg: 'color-1',
  borderWidth: '1px xs:0px',
  borderColor: 'color-4',
  p: 'gtSm:6',
  boxShadow: 'gtSm:(0 9px 12.35px shadow-color)',
  px: 'xs:1',
})

export const Hide = ({
  children,
  when = 'sm',
}: {
  children: React.ReactNode
  when: MediaQueryKey
}) => {
  const hide = useGroupMedia('window')[when]

  if (hide) {
    return null
  }
  return children
}
