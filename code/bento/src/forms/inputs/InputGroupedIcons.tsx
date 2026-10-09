import type { ComponentSize } from '@tamagui/core'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from '../../icons'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'

/** ------ EXAMPLE ------ */
export function InputGroupedIconsExample({ size = 'md' }: { size?: ComponentSize }) {
  return (
    <View flexDirection="column" justify="center" items="center">
      <Input size={size} minW="100%">
        <Input.Box gap="1">
          <Input.Section>
            <Input.Button>
              <Input.Icon>
                <ChevronFirst />
              </Input.Icon>
            </Input.Button>
          </Input.Section>

          <Input.Section>
            <Input.Button>
              <Input.Icon>
                <ChevronLeft />
              </Input.Icon>
            </Input.Button>
          </Input.Section>

          <Input.Section>
            <Input.Area outlineOffset="focus:1px" placeholder="Page number" />
          </Input.Section>

          <Input.Section>
            <Input.Button>
              <Input.Icon>
                <ChevronRight />
              </Input.Icon>
            </Input.Button>
          </Input.Section>

          <Input.Section>
            <Input.Button>
              <Input.Icon>
                <ChevronLast />
              </Input.Icon>
            </Input.Button>
          </Input.Section>
        </Input.Box>
      </Input>
    </View>
  )
}
