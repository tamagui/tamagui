import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'

/** ------ EXAMPLE ------ */
export function InputGroupedIconsExample({ size }: { size?: SizeTokens }) {
  return (
    <View flexDirection="column" justifyContent="center" alignItems="center">
      <Input size={size} minWidth="100%">
        <Input.Box gap="$1">
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
            <Input.Area
              focusStyle={{
                outlineOffset: 1,
              }}
              placeholder="Page number"
            />
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

InputGroupedIconsExample.fileName = 'InputGroupedIcons'
