import type { ComponentSize } from '@tamagui/core'
import { Copy } from '../../icons'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'

/** ------ EXAMPLE ------ */
export function InputWithRightAddOnDemo({
  size = 'md',
}: {
  size?: ComponentSize
}) {
  return (
    <View flexDirection="column" justify="center" items="center" height={100}>
      <Input size={size} minW="100%">
        <Input.Box>
          <Input.Section>
            <Input.Area outlineOffset="focus:1px" placeholder="Copy this text" />
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
