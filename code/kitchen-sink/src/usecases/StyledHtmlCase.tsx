import { styled } from '@tamagui/core'

// Test: styled.a() with proper href typing
const StyledAnchor = styled.a({
  color: '$blue10',
  textDecorationLine: 'underline',
})

// Test: styled.button() with proper type/disabled typing
const StyledButton = styled.button({
  padding: '$4',
  backgroundColor: '$background',
  borderRadius: '$4',
  cursor: 'pointer',
})

// Test: styled.div() basic
const StyledDiv = styled.div({
  padding: '$2',
  backgroundColor: '$backgroundHover',
})

// Test: styled.span() text-like element
const StyledSpan = styled.span({
  color: '$color',
  fontWeight: 'bold',
})

// Test: styled.input() with proper input attributes
const StyledInput = styled.input({
  padding: '$2',
  borderWidth: 1,
  borderColor: '$borderColor',
})

// Test: styled.form() with proper form attributes
const StyledForm = styled.form({
  gap: '$3',
})

// Test: styled.label() with proper htmlFor typing
const StyledLabel = styled.label({
  fontSize: '$3',
})

// Test: styled.nav/main/section/article/footer semantic elements
const StyledNav = styled.nav({
  padding: '$2',
})

const StyledMain = styled.main({
  padding: '$2',
})

const StyledSection = styled.section({
  padding: '$3',
})

// Test: styled.a() with variants
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

export function StyledHtmlCase() {
  return (
    <StyledDiv data-testid="styled-html-container">
      {/* Test styled.a() */}
      <StyledAnchor
        data-testid="styled-a"
        href="https://example.com"
        target="_blank"
        rel="noopener"
      >
        Anchor Link
      </StyledAnchor>

      {/* Test styled.button() */}
      <StyledButton data-testid="styled-button" type="submit" disabled={false}>
        Submit Button
      </StyledButton>

      {/* Test styled.div() */}
      <StyledDiv data-testid="styled-div">Styled Div</StyledDiv>

      {/* Test styled.span() */}
      <StyledSpan data-testid="styled-span">Styled Span</StyledSpan>

      {/* Test styled.input() */}
      <StyledInput
        data-testid="styled-input"
        type="text"
        placeholder="Enter text"
        maxLength={100}
      />

      {/* Test styled.form() */}
      <StyledForm data-testid="styled-form" action="/submit" method="post">
        <StyledLabel data-testid="styled-label" htmlFor="test-input">
          Label
        </StyledLabel>
      </StyledForm>

      {/* Test semantic elements */}
      <StyledNav data-testid="styled-nav">Navigation</StyledNav>

      <StyledMain data-testid="styled-main">Main Content</StyledMain>

      <StyledSection data-testid="styled-section">Section Content</StyledSection>

      {/* Test styled.a() with variants */}
      <StyledAnchorWithVariants
        data-testid="styled-a-variants"
        href="/internal"
        size="large"
        underline={false}
      >
        Large Link No Underline
      </StyledAnchorWithVariants>

      <StyledAnchorWithVariants
        data-testid="styled-a-variants-small"
        href="/small"
        size="small"
      >
        Small Link With Underline
      </StyledAnchorWithVariants>
    </StyledDiv>
  )
}
