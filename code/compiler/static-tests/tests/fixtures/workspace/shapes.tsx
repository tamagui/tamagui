// stands in for a monorepo package: `@workspace/shapes` is a package
// specifier discovery evaluates, while this source stays in the graph the way
// a workspace dist file does. The dynamic variant and the object form's third
// argument are what a static reading of the literal cannot reproduce
import { View, styled } from '@tamagui/core'

const getSize = styled.dynamic<number>((value) => ({ width: value, height: value }))

export const WorkspaceSquare = styled(
  View,
  {
    alignItems: 'center',
    justifyContent: 'center',
    variants: { size: getSize },
  },
  { memo: true }
)
