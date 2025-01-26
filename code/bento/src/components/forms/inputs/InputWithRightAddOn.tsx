import { Copy } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'

/** ------ EXAMPLE ------ */
export function InputWithRightAddOnDemo({ size }: { size?: SizeTokens }) {
  return (
    <View flexDirection="column" justifyContent="center" alignItems="center" height={100}>
      <Input size={size} minWidth="100%">
        <Input.Box>
          <Input.Section>
            <Input.Area
              focusStyle={{
                outlineOffset: 1,
              }}
              placeholder="Copy this text"
            />
          </Input.Section>
          <Input.Section>
            <Input.Button>
              <Input.Icon>
                <Copy />
              </Input.Icon>
            </Input.Button>
          </Input.Section>
        </Input.Box>
      </Input>
    </View>
  )
}

InputWithRightAddOnDemo.fileName = 'InputWithRightAddOn'
