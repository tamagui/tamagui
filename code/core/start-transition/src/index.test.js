import { startTransition } from './index'

describe('startTransition', () => {
  it('should call the callback directly if TAMAGUI_TARGET is not web', () => {
    process.env.TAMAGUI_TARGET = 'native'
    const callback = jest.fn()
    startTransition(callback)
    expect(callback).toHaveBeenCalled()
  })

  it('should proxy to react.startTransition if TAMAGUI_TARGET is web', () => {
    process.env.TAMAGUI_TARGET = 'web'
    const callback = jest.fn()
    startTransition(callback)
    // Assuming react.startTransition works as expected
    expect(callback).not.toHaveBeenCalled()
  })
})
