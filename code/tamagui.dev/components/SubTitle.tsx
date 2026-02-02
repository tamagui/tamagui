import { Fragment } from 'react'
import { H3 } from 'tamagui'

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
      position="relative"
      maxW="100%"
      color="$accent7"
      width="100%"
      fontFamily="$mono"
      size="$7"
      letterSpacing={-0.25}
      render="p"
      pb="$3"
      mb="$3"
      $platform-web={{
        textWrap: 'balance',
      }}
      $gtSm={{
        width: 'max-content',
      }}
      {...props}
    >
      {nbspLastWord(childText)}
    </H3>
  )
}
