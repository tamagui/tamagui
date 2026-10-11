import { View, styled } from '@tamagui/web'

// probes conditioned discrete (non-animatable) props on an inline animation
// driver: the direct emitter keeps active-condition values inline, so the
// driver receives them and must apply them instantly rather than trying to
// interpolate them alongside a running animation
const Box = styled(View, {
  width: 120,
  height: 120,
  backgroundColor: 'red',
  borderWidth: 2,
  borderColor: 'black',
  borderStyle: 'solid',
  cursor: 'default',
  opacity: 1,
  transition: '1000ms',
})

export function DriverConditionedDiscreteCase() {
  return (
    <View padding={40}>
      <Box
        data-testid="box"
        cursor="default hover:pointer"
        borderStyle="solid hover:dashed"
        opacity="1 hover:0.3"
      />
    </View>
  )
}
