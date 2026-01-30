import { isWeb } from '@tamagui/constants'
import { Text, View, styled, TamaguiComponentState } from '@tamagui/core'
import { forwardRef } from 'react'

// Test: render prop with string in styled()
const StyledButton = styled(View, {
  render: 'button',
  padding: '$4',
  backgroundColor: '$background',
  borderRadius: '$4',
  cursor: 'pointer',
})

// Test: render prop with anchor tag
const StyledAnchor = styled(Text, {
  render: 'a',
  color: '$blue10',
  textDecorationLine: 'underline',
})

// Test: render prop with semantic elements
const StyledNav = styled(View, {
  render: 'nav',
  padding: '$2',
  backgroundColor: '$backgroundHover',
})

const StyledMain = styled(View, {
  render: 'main',
  padding: '$4',
  flex: 1,
})

const StyledSection = styled(View, {
  render: 'section',
  padding: '$3',
  borderWidth: 1,
  borderColor: '$borderColor',
})

const StyledArticle = styled(View, {
  render: 'article',
  padding: '$3',
})

const StyledFooter = styled(View, {
  render: 'footer',
  padding: '$2',
  backgroundColor: '$backgroundPress',
})

// Test: render prop with form elements
const StyledForm = styled(View, {
  render: 'form',
  gap: '$3',
})

const StyledLabel = styled(Text, {
  render: 'label',
  fontSize: '$3',
})

const StyledFieldset = styled(View, {
  render: 'fieldset',
  padding: '$3',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$2',
})

// Test: render prop with heading elements
const StyledH1 = styled(Text, {
  render: 'h1',
  fontSize: '$9',
  fontWeight: 'bold',
})

const StyledH2 = styled(Text, {
  render: 'h2',
  fontSize: '$7',
  fontWeight: 'bold',
})

// Test: render prop with list elements
const StyledUl = styled(View, {
  render: 'ul',
  paddingLeft: '$4',
})

const StyledLi = styled(View, {
  render: 'li',
  marginBottom: '$2',
})

// Test: render prop override at runtime
const RuntimeOverrideView = styled(View, {
  padding: '$2',
  backgroundColor: '$background',
})

// Custom component for function render test
const CustomButton = forwardRef<any, any>((props, ref) =>
  isWeb ? (
    <button ref={ref} {...props} data-custom-button="true" />
  ) : (
    <View ref={ref} {...props} aria-label="custom-button" />
  )
)
CustomButton.displayName = 'CustomButton'

export function RenderPropCase() {
  return (
    <View gap="$4" padding="$4" testID="render-prop-container">
      {/* Test styled() render prop */}
      <StyledButton testID="styled-button" data-testid="styled-button">
        <Text testID="styled-button-text">Styled Button (render='button')</Text>
      </StyledButton>

      {/* @ts-expect-error - href only valid on web */}
      <StyledAnchor
        testID="styled-anchor"
        data-testid="styled-anchor"
        href={isWeb ? '#' : undefined}
      >
        Styled Anchor (render='a')
      </StyledAnchor>

      {/* Test semantic elements */}
      <StyledNav testID="styled-nav" data-testid="styled-nav">
        <Text>Nav Element</Text>
      </StyledNav>

      <StyledMain testID="styled-main" data-testid="styled-main">
        <Text>Main Element</Text>
      </StyledMain>

      <StyledSection testID="styled-section" data-testid="styled-section">
        <Text>Section Element</Text>
      </StyledSection>

      <StyledArticle testID="styled-article" data-testid="styled-article">
        <Text>Article Element</Text>
      </StyledArticle>

      <StyledFooter testID="styled-footer" data-testid="styled-footer">
        <Text>Footer Element</Text>
      </StyledFooter>

      {/* Test form elements */}
      <StyledForm data-testid="styled-form">
        <StyledFieldset data-testid="styled-fieldset">
          <StyledLabel data-testid="styled-label" htmlFor="test-input">
            Label Element
          </StyledLabel>
        </StyledFieldset>
      </StyledForm>

      {/* Test heading elements */}
      <StyledH1 data-testid="styled-h1">H1 Heading</StyledH1>
      <StyledH2 data-testid="styled-h2">H2 Heading</StyledH2>

      {/* Test list elements */}
      <StyledUl data-testid="styled-ul">
        <StyledLi data-testid="styled-li-1">
          <Text>List Item 1</Text>
        </StyledLi>
        <StyledLi data-testid="styled-li-2">
          <Text>List Item 2</Text>
        </StyledLi>
      </StyledUl>

      {/* Test runtime render prop override */}
      <RuntimeOverrideView data-testid="runtime-button" render="button">
        <Text>Runtime Override to Button</Text>
      </RuntimeOverrideView>

      <RuntimeOverrideView data-testid="runtime-anchor" render="a">
        <Text>Runtime Override to Anchor</Text>
      </RuntimeOverrideView>

      {/* Test Stack with runtime render */}
      <View data-testid="stack-as-section" render="section" padding="$2">
        <Text>Stack as Section</Text>
      </View>

      <View data-testid="stack-as-aside" render="aside" padding="$2">
        <Text>Stack as Aside</Text>
      </View>

      {/* Test Text with runtime render */}
      <Text data-testid="text-as-span" render="span">
        Text as Span
      </Text>

      <Text data-testid="text-as-strong" render="strong">
        Text as Strong
      </Text>

      <Text data-testid="text-as-em" render="em">
        Text as Em
      </Text>

      {/* Test JSX element render prop */}
      <View
        data-testid="jsx-element-render"
        render={<a href="/test-link" data-jsx-element="true" />}
        padding="$2"
        backgroundColor="$blue5"
      >
        <Text>JSX Element Render (anchor with href)</Text>
      </View>

      <View
        data-testid="jsx-element-button"
        render={<button type="submit" data-jsx-button="true" />}
        padding="$3"
        backgroundColor="$green5"
      >
        <Text>JSX Element Render (button with type)</Text>
      </View>

      {/* Test function render prop */}
      <View
        testID="function-render"
        data-testid="function-render"
        render={(props) => <CustomButton {...props} />}
        padding="$2"
        backgroundColor="$red5"
      >
        <Text testID="function-render-text">Function Render (CustomButton)</Text>
      </View>

      {isWeb ? (
        <View
          data-testid="function-render-with-state"
          render={(props, state: TamaguiComponentState) => (
            <button
              {...props}
              data-hover={state.hover ? 'true' : 'false'}
              data-press={state.press ? 'true' : 'false'}
            />
          )}
          padding="$3"
          backgroundColor="$purple5"
          hoverStyle={{ backgroundColor: '$purple7' }}
          pressStyle={{ backgroundColor: '$purple9' }}
        >
          <Text>Function Render with State</Text>
        </View>
      ) : (
        <View
          testID="function-render-with-state"
          render={(props, state: TamaguiComponentState) => (
            <View
              {...props}
              aria-description={`hover:${state.hover},press:${state.press}`}
            />
          )}
          padding="$3"
          backgroundColor="$purple5"
          pressStyle={{ backgroundColor: '$purple9' }}
        >
          <Text testID="function-render-state-text">Function Render with State</Text>
        </View>
      )}
    </View>
  )
}
