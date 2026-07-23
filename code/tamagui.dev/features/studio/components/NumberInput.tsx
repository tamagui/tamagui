import { Minus, Plus } from '@tamagui/lucide-icons-2'
import { Input, type SizeTokens, type InputProps as TamaguiInputProps } from 'tamagui'
import { Button, type ButtonSize } from '~/components/Button'

export type NumberInputProps = {
  size: SizeTokens
  value: number
  onValueChange?: (newValue: number) => void
  min?: number
  max?: number
} & Omit<TamaguiInputProps, 'value' | 'onValueChange'>

const getButtonSize = (size: SizeTokens): ButtonSize => {
  if (typeof size === 'number') {
    return size <= 30 ? 'small' : size <= 40 ? 'medium' : 'large'
  }

  const token = Number.parseFloat(String(size).replace('$', ''))
  return token <= 2 ? 'small' : token <= 4 ? 'medium' : 'large'
}

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
    if (Number.isNaN(numberVal)) {
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
        variant="outlined"
        size={getButtonSize(size)}
        icon={Minus}
        onPress={() => {
          handleUpdate(value - 1)
        }}
        borderBottomRightRadius="$0"
        borderTopRightRadius="$0"
        borderWidth={0}
      />
      <Input
        width={50}
        size={size}
        value={value.toString()}
        onChange={(e) => handleUpdate(e.target?.value ?? '')}
        {...props}
        rounded="$0"
      />
      <Button
        disabled={!canIncrease}
        variant="outlined"
        size={getButtonSize(size)}
        icon={Plus}
        onPress={() => {
          handleUpdate(value + 1)
        }}
        rounded="$4"
        borderLeftWidth={0}
        borderTopLeftRadius="$0"
        borderBottomLeftRadius="$0"
      />
    </>
  )
}
