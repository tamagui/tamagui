import { Minus, Plus } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { Button, Theme, YGroup } from 'tamagui'
import { useContainerDim } from '../hooks/useContainerDim'

export const SizeController = YGroup.styleable<{
  size: SizeTokens
  setSize: (size: SizeTokens) => void
  sizes?: SizeTokens[]
}>(({ size, setSize, sizes = ['$3', '$4', '$6', '$8', '$9'], ...props }, ref) => {
  const { width } = useContainerDim('window')
  if (!width || width < 400) {
    return null
  }
  return (
    <Theme inverse>
      <YGroup
        ref={ref}
        justifyContent="center"
        alignItems="center"
        right={0}
        bottom={0}
        gap="$1"
        {...props}
      >
        <YGroup.Item>
          <Button
            size="$3"
            onPress={() => {
              const index = sizes.indexOf(size)
              setSize(sizes[index - 1 < 0 ? 0 : index - 1])
            }}
          >
            <Button.Icon>
              <Minus />
            </Button.Icon>
          </Button>
        </YGroup.Item>
        <YGroup.Item>
          <Button
            size="$3"
            onPress={() => {
              const index = sizes.indexOf(size)
              setSize(sizes[index + 1 >= sizes.length ? 4 : index + 1])
            }}
          >
            <Button.Icon>
              <Plus />
            </Button.Icon>
          </Button>
        </YGroup.Item>
      </YGroup>
    </Theme>
  )
})
