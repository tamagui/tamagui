import { Minus, Plus } from '@tamagui/lucide-icons'
import type { InputProps } from 'tamagui'
import { Button, Input } from 'tamagui'

export type NumberInputProps = {
  value: number
  onValueChange?: (newValue: number) => void
  min?: number
  max?: number
} & Omit<InputProps, 'value' | 'onValueChange'>

export function NumberInput({
  size,
  min,
  max,
  value = 0,
  onValueChange,
  ...props
}: NumberInputProps) {
  const handleUpdate = (newVal: string | number) => {
    const numberVal = Number(newVal)
    if (isNaN(numberVal)) {
      return
    }
    if (
      (typeof max !== 'undefined' && numberVal > max) ||
      (typeof min !== 'undefined' && numberVal < min)
    ) {
      return
    }
    onValueChange?.(numberVal)
  }

  const canDecrease = typeof min !== 'undefined' && value - 1 >= min
  const canIncrease = typeof max !== 'undefined' && value + 1 <= max
  // TODO: we manually set the border radius for now
  return (
    <>
      <Button
        disabled={!canDecrease}
        bordered
        size={size}
        icon={Minus}
        onPress={() => {
          handleUpdate(value - 1)
        }}
        bbrr="$0"
        btrr="$0"
        brw={0}
      />
      <Input
        width={50}
        size={size}
        value={value.toString()}
        onChangeText={handleUpdate}
        {...props}
        br="$0"
      />
      <Button
        disabled={!canIncrease}
        bordered
        size={size}
        icon={Plus}
        onPress={() => {
          handleUpdate(value + 1)
        }}
        br="$4"
        blw={0}
        btlr="$0"
        bblr="$0"
      />
    </>
  )
}
