import { Battery, Moon, Pocket } from '@tamagui/feather-icons'
import { Button, Tooltip, XStack } from 'tamagui'

export default function TooltipDemo() {
  return (
    <XStack space>
      <Tooltip contents="Normal tooltip with arrow" showArrow>
        <Button icon={Pocket} circular />
      </Tooltip>
      <Tooltip size="$6" contents="Larger tooltip">
        <Button size="$6" icon={Battery} circular />
      </Tooltip>
      <Tooltip alwaysDark size="$7" contents="Large, always dark tooltip">
        <Button size="$7" icon={Moon} circular />
      </Tooltip>
    </XStack>
  )
}
