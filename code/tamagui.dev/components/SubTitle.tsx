import { Fragment } from 'react'
import { H3 } from '@tamagui/ui'

export const nbspLastWord = (sentence: string) => {
  if (typeof sentence !== 'string') {
    return sentence
  }
  const titleWords = sentence.split(' ')
  if (titleWords.length === 1) {
    return sentence
  }
  return titleWords.map((word, i) => {
    return i === titleWords.length - 1 ? (
      <Fragment key={i}>&nbsp;{word}</Fragment>
    ) : (
      <Fragment key={i}> {word}</Fragment>
    )
  })
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
      pos="relative"
      maxWidth="100%"
      color="$gray9"
      width="max-content"
      fontFamily="$mono"
      size="$7"
      ls={-0.25}
      tag="p"
      mb="$3"
      {...props}
    >
      {nbspLastWord(childText)}
    </H3>
  )
}
