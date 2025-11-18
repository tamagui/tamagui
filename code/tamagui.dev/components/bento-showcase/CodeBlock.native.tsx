import React from 'react'
import type { GetProps } from 'tamagui'
import { YStack, Paragraph, styled } from 'tamagui'

const Code = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
  size: '$3',
  lineHeight: 18,
  cursor: 'inherit',
  whiteSpace: 'pre',
  padding: '$1',
  borderRadius: '$4',

  variants: {
    colored: {
      true: {
        color: '$color',
        backgroundColor: '$background',
      },
    },
  } as const,
})

const Pre = styled(YStack, {
  overflow: 'visible',
  tag: 'pre',
  padding: '$4',
  borderRadius: '$4',
  backgroundColor: '$background',
})

type PreProps = Omit<GetProps<typeof Pre>, 'css'>

export type CodeBlockProps = PreProps & {
  language: 'tsx'
  value: string
  line?: string
  css?: any
  mode?: 'static' // | 'typewriter' | 'interactive'
  showLineNumbers?: boolean
}

export default React.forwardRef<any, CodeBlockProps>(
  function CodeBlock(_props, forwardedRef) {
    const {
      language,
      value,
      line = '0',
      className = '',
      mode,
      showLineNumbers,
      ...props
    } = _props

    // For React Native, we just display the raw code without syntax highlighting
    // since the web-only dependencies (rehype-parse, parse5) aren't available
    return (
      <Pre
        ref={forwardedRef}
        className={className}
        data-line-numbers={showLineNumbers}
        {...props}
      >
        <Code className={className}>{value}</Code>
      </Pre>
    )
  }
)
