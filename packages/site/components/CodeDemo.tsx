// Inspired by https://github.com/rexxars/react-refractor
import React from 'react'

import { CodeBlock } from './CodeBlock'

type CodeDemoProps = React.ComponentProps<typeof CodeBlock>

export function CodeDemo({ css, line, ...props }: CodeDemoProps) {
  return <CodeBlock {...props} line="0" marginBottom={0} />
}
