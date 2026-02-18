import '@testing-library/jest-dom'
import { Input } from '@tamagui/input'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { View, TamaguiProvider, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

function InputTest(props: React.ComponentProps<typeof Input>) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <View>
        <Input {...props} />
      </View>
    </TamaguiProvider>
  )
}

describe('Input web type prop', () => {
  it('should render with type="number"', () => {
    const { container } = render(<InputTest type="number" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should render with type="email"', () => {
    const { container } = render(<InputTest type="email" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('should render with type="tel"', () => {
    const { container } = render(<InputTest type="tel" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'tel')
  })

  it('should render with type="password"', () => {
    const { container } = render(<InputTest type="password" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should render with type="url"', () => {
    const { container } = render(<InputTest type="url" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'url')
  })

  it('should render with type="search"', () => {
    const { container } = render(<InputTest type="search" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'search')
  })
})

describe('Input web inputMode prop', () => {
  it('should render with inputMode="numeric"', () => {
    const { container } = render(<InputTest inputMode="numeric" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  it('should render with inputMode="decimal"', () => {
    const { container } = render(<InputTest inputMode="decimal" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('inputmode', 'decimal')
  })

  it('should render with inputMode="email"', () => {
    const { container } = render(<InputTest inputMode="email" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('inputmode', 'email')
  })

  it('should render with inputMode="tel"', () => {
    const { container } = render(<InputTest inputMode="tel" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('inputmode', 'tel')
  })
})

describe('Input web default behavior', () => {
  it('should render an input element', () => {
    const { container } = render(<InputTest />)
    const input = container.querySelector('input')
    expect(input).toBeTruthy()
  })

  it('should support placeholder', () => {
    const { container } = render(<InputTest placeholder="Enter text" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })

  it('should support disabled', () => {
    const { container } = render(<InputTest disabled />)
    const input = container.querySelector('input')
    expect(input).toBeDisabled()
  })
})

describe('Input autoFocus', () => {
  it('should focus the input element on mount when autoFocus is set', () => {
    const { container } = render(<InputTest autoFocus />)
    const input = container.querySelector('input')
    expect(input).toHaveFocus()
  })
})
