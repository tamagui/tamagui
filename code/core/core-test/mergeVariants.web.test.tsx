import { mergeVariants } from '../web/src/helpers/mergeVariants'
import { describe, expect, test } from 'vitest'

describe('mergeVariants', () => {
  test('should merge simple variants', () => {
    const parentVariants = {
      size: {
        small: { fontSize: 12 },
        medium: { fontSize: 16 },
      },
    }

    const ourVariants = {
      size: {
        large: { fontSize: 20 },
      },
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 12 },
        medium: { fontSize: 16 },
        large: { fontSize: 20 },
      },
    })
  })

  test('should override parent variants with our variants', () => {
    const parentVariants = {
      size: {
        small: { fontSize: 12, padding: 8 },
        medium: { fontSize: 16, padding: 12 },
      },
    }

    const ourVariants = {
      size: {
        small: { fontSize: 10 }, // override fontSize but keep padding
        medium: { fontSize: 18, margin: 4 }, // override fontSize, keep padding, add margin
      },
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 10, padding: 8 },
        medium: { fontSize: 18, padding: 12, margin: 4 },
      },
    })
  })

  test('should add new variant keys from our variants', () => {
    const parentVariants = {
      size: {
        small: { fontSize: 12 },
      },
    }

    const ourVariants = {
      color: {
        primary: { backgroundColor: 'blue' },
        secondary: { backgroundColor: 'gray' },
      },
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 12 },
      },
      color: {
        primary: { backgroundColor: 'blue' },
        secondary: { backgroundColor: 'gray' },
      },
    })
  })

  test('should handle function variants by overriding parent completely', () => {
    const parentVariants = {
      size: {
        small: { fontSize: 12 },
        medium: { fontSize: 16 },
      },
    }

    const sizeFunction = (val: any, config: any) => ({
      fontSize: val === 'tiny' ? 8 : 14,
    })
    const ourVariants = {
      size: sizeFunction as any,
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: sizeFunction,
    })
  })

  test('should handle empty parent variants', () => {
    const parentVariants = {}

    const ourVariants = {
      size: {
        small: { fontSize: 12 },
      },
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 12 },
      },
    })
  })

  test('should handle empty our variants', () => {
    const parentVariants = {
      size: {
        small: { fontSize: 12 },
      },
    }

    const ourVariants = {}

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 12 },
      },
    })
  })

  test('should handle undefined parent variants', () => {
    const parentVariants = undefined

    const ourVariants = {
      size: {
        small: { fontSize: 12 },
      },
    }

    const result = mergeVariants(parentVariants as any, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 12 },
      },
    })
  })

  test('should handle complex nested variants', () => {
    const parentVariants = {
      size: {
        small: {
          fontSize: 12,
          padding: 8,
          borderRadius: 4,
        },
        medium: {
          fontSize: 16,
          padding: 12,
          borderRadius: 6,
        },
      },
      variant: {
        primary: {
          backgroundColor: 'blue',
          color: 'white',
        },
        secondary: {
          backgroundColor: 'gray',
          color: 'black',
        },
      },
    }

    const ourVariants = {
      size: {
        small: { fontSize: 10 }, // override fontSize
        large: { fontSize: 20, padding: 16 }, // new size
      },
      variant: {
        primary: { backgroundColor: 'darkblue' }, // override backgroundColor
        tertiary: { backgroundColor: 'green' }, // new variant
      },
      theme: {
        dark: { backgroundColor: 'black' }, // completely new variant key
      },
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 10, padding: 8, borderRadius: 4 },
        medium: { fontSize: 16, padding: 12, borderRadius: 6 },
        large: { fontSize: 20, padding: 16 },
      },
      variant: {
        primary: { backgroundColor: 'darkblue', color: 'white' },
        secondary: { backgroundColor: 'gray', color: 'black' },
        tertiary: { backgroundColor: 'green' },
      },
      theme: {
        dark: { backgroundColor: 'black' },
      },
    })
  })

  test('should handle mixed function and object variants', () => {
    const parentVariants = {
      size: {
        small: { fontSize: 12 },
        medium: { fontSize: 16 },
      },
      color: ((val: any, config: any) => ({ color: val })) as any,
    }

    const ourVariants = {
      size: ((val: any, config: any) => ({ fontSize: val === 'tiny' ? 8 : 20 })) as any, // function overrides object
      color: {
        primary: { color: 'blue' }, // object will merge with parent function, but object wins due to spread order
      },
    }

    const result = mergeVariants(parentVariants, ourVariants) as any

    expect(result.size).toBeTypeOf('function') // function overrides object
    expect(result.color).toBeTypeOf('object') // object overwrites parent function due to spread order
    expect(result.color).toEqual({ primary: { color: 'blue' } })
  })

  test('should handle deep nesting levels correctly', () => {
    const parentVariants = {
      responsive: {
        mobile: {
          small: { fontSize: 12 },
          medium: { fontSize: 14 },
        },
        desktop: {
          small: { fontSize: 14 },
          medium: { fontSize: 16 },
        },
      },
    }

    const ourVariants = {
      responsive: {
        mobile: {
          small: { fontSize: 10 }, // override
          large: { fontSize: 16 }, // new
        },
        tablet: {
          small: { fontSize: 12 }, // completely new
        },
      },
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      responsive: {
        mobile: {
          small: { fontSize: 10 },
          medium: { fontSize: 14 },
          large: { fontSize: 16 },
        },
        desktop: {
          small: { fontSize: 14 },
          medium: { fontSize: 16 },
        },
        tablet: {
          small: { fontSize: 12 },
        },
      },
    })
  })

  test('should preserve parent variants not present in our variants', () => {
    const parentVariants = {
      size: {
        small: { fontSize: 12 },
        medium: { fontSize: 16 },
        large: { fontSize: 20 },
      },
      color: {
        primary: { backgroundColor: 'blue' },
        secondary: { backgroundColor: 'gray' },
      },
    }

    const ourVariants = {
      size: {
        medium: { fontSize: 18 }, // only override medium
      },
      // no color variants in our variants
    }

    const result = mergeVariants(parentVariants, ourVariants)

    expect(result).toEqual({
      size: {
        small: { fontSize: 12 }, // preserved
        medium: { fontSize: 18 }, // overridden
        large: { fontSize: 20 }, // preserved
      },
      color: {
        primary: { backgroundColor: 'blue' }, // preserved
        secondary: { backgroundColor: 'gray' }, // preserved
      },
    })
  })
})
