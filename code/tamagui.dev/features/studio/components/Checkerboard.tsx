import type { YStackProps } from 'tamagui';
import { YStack } from 'tamagui'

export const Checkerboard = (props: YStackProps) => (
  <YStack
    fullscreen
    {...props}
    style={{
      background: `#eee url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill-opacity=".25" ><rect x="5" width="5" height="5" /><rect y="5" width="5" height="5" /></svg>')`,
      backgroundSize: '10px 10px',
      ...(props?.style as any),
    }}
  />
)
