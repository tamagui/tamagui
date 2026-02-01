/**
 * Type tests for styled.a(), styled.button(), etc. API.
 *
 * These tests ensure type-safe inference for:
 * 1. HTML element-specific attributes (href for anchors, type for buttons, etc.)
 * 2. Style props based on element type (TextStyle for text-like, StackStyle for others)
 * 3. Variants support
 * 4. Standard HTML attributes like data-testid
 *
 * Run with: bun run test:types or vitest typecheck
 */

import { expectTypeOf, describe, test } from 'vitest'
import { styled, styledHtml } from './styled'
import type { GetProps } from './types'

// =============================================================================
// Test: styled.a() types
// =============================================================================

describe('styled.a() types', () => {
  const StyledAnchor = styled.a({
    color: '$blue10',
  })

  type AnchorProps = GetProps<typeof StyledAnchor>

  test('styled.a() accepts href prop', () => {
    expectTypeOf<AnchorProps>().toHaveProperty('href')
    expectTypeOf<AnchorProps['href']>().toMatchTypeOf<string | undefined>()
  })

  test('styled.a() accepts target prop', () => {
    expectTypeOf<AnchorProps>().toHaveProperty('target')
  })

  test('styled.a() accepts rel prop', () => {
    expectTypeOf<AnchorProps>().toHaveProperty('rel')
  })

  test('styled.a() accepts text style props', () => {
    // text-like elements should accept text style props
    expectTypeOf<AnchorProps>().toHaveProperty('color')
    expectTypeOf<AnchorProps>().toHaveProperty('fontSize')
    expectTypeOf<AnchorProps>().toHaveProperty('fontWeight')
    expectTypeOf<AnchorProps>().toHaveProperty('textDecorationLine')
  })
})

// =============================================================================
// Test: styled.button() types
// =============================================================================

describe('styled.button() types', () => {
  const StyledButton = styled.button({
    padding: '$4',
  })

  type ButtonProps = GetProps<typeof StyledButton>

  test('styled.button() accepts type prop', () => {
    expectTypeOf<ButtonProps>().toHaveProperty('type')
  })

  test('styled.button() accepts disabled prop', () => {
    expectTypeOf<ButtonProps>().toHaveProperty('disabled')
  })

  test('styled.button() accepts onClick prop', () => {
    expectTypeOf<ButtonProps>().toHaveProperty('onClick')
  })

  test('styled.button() accepts stack style props', () => {
    // non-text elements should accept stack style props
    expectTypeOf<ButtonProps>().toHaveProperty('padding')
    expectTypeOf<ButtonProps>().toHaveProperty('backgroundColor')
    expectTypeOf<ButtonProps>().toHaveProperty('borderRadius')
  })
})

// =============================================================================
// Test: styled.input() types
// =============================================================================

describe('styled.input() types', () => {
  const StyledInput = styled.input({
    padding: '$2',
  })

  type InputProps = GetProps<typeof StyledInput>

  test('styled.input() accepts type prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('type')
  })

  test('styled.input() accepts placeholder prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('placeholder')
  })

  test('styled.input() accepts maxLength prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('maxLength')
  })

  test('styled.input() accepts value prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('value')
  })

  test('styled.input() accepts onChange prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('onChange')
  })
})

// =============================================================================
// Test: styled.form() types
// =============================================================================

describe('styled.form() types', () => {
  const StyledForm = styled.form({
    gap: '$3',
  })

  type FormProps = GetProps<typeof StyledForm>

  test('styled.form() accepts action prop', () => {
    expectTypeOf<FormProps>().toHaveProperty('action')
  })

  test('styled.form() accepts method prop', () => {
    expectTypeOf<FormProps>().toHaveProperty('method')
  })

  test('styled.form() accepts onSubmit prop', () => {
    expectTypeOf<FormProps>().toHaveProperty('onSubmit')
  })
})

// =============================================================================
// Test: styled.label() types
// =============================================================================

describe('styled.label() types', () => {
  const StyledLabel = styled.label({
    fontSize: '$3',
  })

  type LabelProps = GetProps<typeof StyledLabel>

  test('styled.label() accepts htmlFor prop', () => {
    expectTypeOf<LabelProps>().toHaveProperty('htmlFor')
  })
})

// =============================================================================
// Test: styled.div() types (stack-like element)
// =============================================================================

describe('styled.div() types', () => {
  const StyledDiv = styled.div({
    padding: '$4',
  })

  type DivProps = GetProps<typeof StyledDiv>

  test('styled.div() accepts stack style props', () => {
    expectTypeOf<DivProps>().toHaveProperty('padding')
    expectTypeOf<DivProps>().toHaveProperty('margin')
    expectTypeOf<DivProps>().toHaveProperty('flex')
    expectTypeOf<DivProps>().toHaveProperty('backgroundColor')
  })
})

// =============================================================================
// Test: styled.span() types (text-like element)
// =============================================================================

describe('styled.span() types', () => {
  const StyledSpan = styled.span({
    color: '$color',
  })

  type SpanProps = GetProps<typeof StyledSpan>

  test('styled.span() accepts text style props', () => {
    expectTypeOf<SpanProps>().toHaveProperty('color')
    expectTypeOf<SpanProps>().toHaveProperty('fontSize')
    expectTypeOf<SpanProps>().toHaveProperty('fontWeight')
    expectTypeOf<SpanProps>().toHaveProperty('lineHeight')
  })
})

// =============================================================================
// Test: variants support
// =============================================================================

describe('styled.element() with variants', () => {
  const StyledAnchorWithVariants = styled.a({
    color: '$blue10',

    variants: {
      size: {
        small: { fontSize: '$2' },
        large: { fontSize: '$6' },
      },
      underline: {
        true: { textDecorationLine: 'underline' },
        false: { textDecorationLine: 'none' },
      },
    } as const,

    defaultVariants: {
      underline: true,
    },
  })

  type VariantProps = GetProps<typeof StyledAnchorWithVariants>

  test('styled.a() with variants accepts size variant', () => {
    expectTypeOf<VariantProps>().toHaveProperty('size')
  })

  test('styled.a() with variants accepts underline variant', () => {
    expectTypeOf<VariantProps>().toHaveProperty('underline')
  })

  test('styled.a() with variants still accepts href', () => {
    expectTypeOf<VariantProps>().toHaveProperty('href')
  })
})

// =============================================================================
// Test: styledHtml() function (alternative API)
// =============================================================================

describe('styledHtml() function', () => {
  const StyledAnchor = styledHtml('a', {
    color: '$blue10',
  })

  type AnchorProps = GetProps<typeof StyledAnchor>

  test('styledHtml("a") accepts href prop', () => {
    expectTypeOf<AnchorProps>().toHaveProperty('href')
  })
})

// =============================================================================
// Test: semantic elements
// =============================================================================

describe('semantic HTML elements', () => {
  test('styled.nav() creates nav element component', () => {
    const StyledNav = styled.nav({ padding: '$2' })
    type NavProps = GetProps<typeof StyledNav>
    expectTypeOf<NavProps>().toHaveProperty('padding')
  })

  test('styled.main() creates main element component', () => {
    const StyledMain = styled.main({ flex: 1 })
    type MainProps = GetProps<typeof StyledMain>
    expectTypeOf<MainProps>().toHaveProperty('flex')
  })

  test('styled.section() creates section element component', () => {
    const StyledSection = styled.section({ padding: '$3' })
    type SectionProps = GetProps<typeof StyledSection>
    expectTypeOf<SectionProps>().toHaveProperty('padding')
  })

  test('styled.article() creates article element component', () => {
    const StyledArticle = styled.article({ padding: '$3' })
    type ArticleProps = GetProps<typeof StyledArticle>
    expectTypeOf<ArticleProps>().toHaveProperty('padding')
  })

  test('styled.header() creates header element component', () => {
    const StyledHeader = styled.header({ padding: '$2' })
    type HeaderProps = GetProps<typeof StyledHeader>
    expectTypeOf<HeaderProps>().toHaveProperty('padding')
  })

  test('styled.footer() creates footer element component', () => {
    const StyledFooter = styled.footer({ padding: '$2' })
    type FooterProps = GetProps<typeof StyledFooter>
    expectTypeOf<FooterProps>().toHaveProperty('padding')
  })
})
