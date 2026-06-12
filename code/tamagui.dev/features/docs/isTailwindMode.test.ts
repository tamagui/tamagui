import { describe, expect, test } from 'vitest'
import {
  isTailwindHost,
  isTailwindLocation,
  isTailwindMode,
  isTailwindPath,
  isTailwindSearch,
  toTailwindPath,
  toTamaguiPath,
} from './isTailwindMode'

describe('isTailwindMode', () => {
  test('enables tailwind mode for the tailwind subdomain', () => {
    const request = new Request('https://tailwind.tamagui.dev/docs/intro/styles', {
      headers: {
        host: 'tailwind.tamagui.dev',
      },
    })

    expect(isTailwindMode({ request })).toBe(true)
  })

  test('enables tailwind mode for the syntax query param', () => {
    expect(isTailwindMode({ search: '?syntax=tailwind' })).toBe(true)
    expect(isTailwindSearch('?foo=1&syntax=tailwind')).toBe(true)
  })

  test('enables tailwind mode for route-group docs paths', () => {
    const request = new Request('https://tamagui.dev/tailwind/intro/tailwind-mode')

    expect(isTailwindMode({ path: '/tailwind/intro/tailwind-mode' })).toBe(true)
    expect(isTailwindMode({ request })).toBe(true)
    expect(isTailwindPath('/tailwind/core/view-and-text')).toBe(true)
    expect(isTailwindPath('/tailwind-ui/button')).toBe(true)
  })

  test('does not enable tailwind mode for similar query values', () => {
    expect(isTailwindMode({ search: '?syntax=tamagui-tailwind' })).toBe(false)
  })

  test('shares browser location detection with the client code-mode UI', () => {
    expect(
      isTailwindLocation({
        host: 'tailwind.localhost:8081',
        search: '',
      })
    ).toBe(true)

    expect(
      isTailwindLocation({
        host: 'localhost:8081',
        search: '?syntax=tailwind',
      })
    ).toBe(true)

    expect(isTailwindHost('tamagui.dev')).toBe(false)
  })

  test('maps docs paths between tamagui and tailwind route groups', () => {
    expect(toTailwindPath('/')).toBe('/tailwind')
    expect(toTailwindPath('/docs/intro/tailwind-mode')).toBe(
      '/tailwind/intro/tailwind-mode'
    )
    expect(toTailwindPath('/docs/core/view-and-text')).toBe(
      '/tailwind/core/view-and-text'
    )
    expect(toTailwindPath('/docs/guides/next-js')).toBe('/tailwind/guides/next-js')
    expect(toTailwindPath('/ui/button')).toBe('/tailwind-ui/button')

    expect(toTamaguiPath('/tailwind/intro/tailwind-mode')).toBe(
      '/docs/intro/tailwind-mode'
    )
    expect(toTamaguiPath('/tailwind/core/view-and-text')).toBe('/docs/core/view-and-text')
    expect(toTamaguiPath('/tailwind/guides/next-js')).toBe('/docs/guides/next-js')
    expect(toTamaguiPath('/tailwind-ui/button')).toBe('/ui/button')
  })
})
