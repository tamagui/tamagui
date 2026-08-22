import { describe, expect, it, vi } from 'vitest'

// processColor is the react-native one; stub it to the ARGB packing it returns so
// the channel unpacking is what gets asserted here rather than RN's css parsing.
vi.mock('react-native', () => ({
  processColor: (value: string) => {
    if (value === 'grey') return 0xffe3e3e3
    if (value === 'blue') return 0xff0000ff
    if (value === 'half-red') return 0x80ff0000
    // an android-style signed int, which is the same bits with the top one set
    if (value === 'signed') return -0x001c1c1d
    if (value === 'platform') return { semantic: 'label' }
    return null
  },
}))

const { processStyleColors } = await import('../processStyleColors')

describe('processStyleColors', () => {
  // the bug this guards: colors handed to fabric as a packed int came back with
  // the alpha byte read as red, so an opaque grey rendered as rgb(254, 229, 229)
  // and every themed surface in the app was tinted pink
  it('unpacks a color into r, g, b, a floats in channel order', () => {
    expect(processStyleColors({ backgroundColor: 'grey' })).toEqual({
      backgroundColor: [0xe3 / 255, 0xe3 / 255, 0xe3 / 255, 1],
    })
  })

  it('keeps blue in the blue channel', () => {
    expect(processStyleColors({ color: 'blue' })).toEqual({ color: [0, 0, 1, 1] })
  })

  it('carries partial alpha through as the fourth component', () => {
    expect(processStyleColors({ color: 'half-red' })).toEqual({
      color: [1, 0, 0, 0x80 / 255],
    })
  })

  it('reads a negative (android) packed int as the same channels', () => {
    expect(processStyleColors({ color: 'signed' })).toEqual({
      color: [0xe3 / 255, 0xe3 / 255, 0xe3 / 255, 1],
    })
  })

  it('passes a platform color object through untouched', () => {
    expect(processStyleColors({ color: 'platform' })).toEqual({
      color: { semantic: 'label' },
    })
  })

  it('leaves non-color props and unparseable colors alone', () => {
    const props = { flexDirection: 'row', width: 10, color: 'nonsense' }
    expect(processStyleColors(props)).toEqual(props)
  })
})
