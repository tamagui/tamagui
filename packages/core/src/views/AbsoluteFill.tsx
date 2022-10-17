import { Stack } from './Stack'

export const AbsoluteFill = (props: { children?: any }) => {
  return (
    <Stack position="absolute" top={0} right={0} bottom={0} left={0} pointerEvents="box-none">
      {props.children}
    </Stack>
  )
}
