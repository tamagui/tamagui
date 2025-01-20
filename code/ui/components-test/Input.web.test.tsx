import '@testing-library/jest-dom'
import { Input } from '@tamagui/input'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { Stack, TamaguiProvider, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

function InputTest(props: React.ComponentProps<typeof Input>) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <Stack>
        <Input {...props} />
      </Stack>
    </TamaguiProvider>
  )
}

describe('Input web keyboard type conversion', () => {
  it('should convert number-pad to number type and numeric inputmode', () => {
    const { container } = render(<InputTest keyboardType="number-pad" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  it('should convert email-address to email type and email inputmode', () => {
    const { container } = render(<InputTest keyboardType="email-address" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('inputmode', 'email')
  })

  it('should convert phone-pad to tel type and tel inputmode', () => {
    const { container } = render(<InputTest keyboardType="phone-pad" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'tel')
    expect(input).toHaveAttribute('inputmode', 'tel')
  })

  it('should convert decimal-pad to text type with decimal inputmode', () => {
    const { container } = render(<InputTest keyboardType="decimal-pad" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('inputmode', 'decimal')
  })
})

describe('Input web secure text entry', () => {
  it('should convert secureTextEntry to password type', () => {
    const { container } = render(<InputTest secureTextEntry={true} />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should prioritize secureTextEntry over keyboardType', () => {
    const { container } = render(
      <InputTest secureTextEntry={true} keyboardType="number-pad" />
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'password')
  })
})

describe('Input web default type', () => {
  it('should use text type and no inputmode when no props specified', () => {
    const { container } = render(<InputTest />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).not.toHaveAttribute('inputmode')
  })
})
