import { View, styled } from 'tamagui'
import { tone } from '../../../tone'
import { useGroupMedia } from '../../../hooks/useGroupMedia'
import type { MediaQueryKey } from '@tamagui/web'

export const FormCard = styled(View, {
  render: 'form',
  flexDirection: 'row',
  maxW: '100%',
  rounded: '6 max-sm:0px',
  bg: tone.surface,
  borderWidth: '1px max-sm:0px',
  borderColor: tone.border,
  p: 'md:6',
  boxShadow: 'md:(0 1px 3px shadow-color)',
  px: 'max-sm:1',
})

export const Hide = ({
  children,
  when = 'max-md',
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
