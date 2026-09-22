import { H3 } from 'tamagui'

// keeps the last word from wrapping alone onto its own line
export const nbspLastWord = (sentence: string) => {
  if (typeof sentence !== 'string') {
    return sentence
  }
  const lastSpace = sentence.lastIndexOf(' ')
  if (lastSpace === -1) {
    return sentence
  }
  return `${sentence.slice(0, lastSpace)}\u00a0${sentence.slice(lastSpace + 1)}`
}

export const SubTitle = ({ children, ...props }) => {
  if (!children) {
    return null
  }

  // takes the text even if it's wrapped in `<p>`
  // https://github.com/wooorm/xdm/issues/47
  const childText =
    typeof children === 'string' ? children : children.props?.children || children

  return (
    <H3
      position="relative"
      maxW="100%"
      color="color-8"
      width="100% gtSm:max-content"
      size="7"
      fontSize={20}
      lineHeight="28px"
      fontWeight="400"
      letterSpacing={-0.2}
      pb="2"
      mb="4"
      textWrap="web:balance"
      render="p"
      {...props}
    >
      {nbspLastWord(childText)}
    </H3>
  )
}
