import { Anchor, styled } from 'tamagui'

const StyledAnchor1 = styled(Anchor, {
  color: 'red',
})

const StyledAnchor2 = styled(Anchor, {
  target: '_blank',
})

export function StyledAnchor() {
  return (
    <>
      <StyledAnchor1
        testID="test-anchor"
        href="https://tamagui.dev/test-link"
        target="_blank"
      >
        hi
      </StyledAnchor1>

      <StyledAnchor2 testID="test-anchor2" href="https://tamagui.dev/test-link">
        hi
      </StyledAnchor2>
    </>
  )
}
