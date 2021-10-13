// import * as Collapsible from '@radix-ui/react-collapsible'
import { CheckCircle, Clipboard } from '@tamagui/feather-icons'
// import { getParameters } from 'codesandbox/lib/api/define'
import copy from 'copy-to-clipboard'
import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { Button, Text, YStack } from 'tamagui'

import { Code } from './Code'
import { FrontmatterContext } from './MDXComponents'
import { Pre } from './Pre'

export const DocCodeBlock = forwardRef((props: any, ref) => {
  const {
    className,
    children,
    id,
    showLineNumbers = false,
    isHero = false,
    isCollapsible = false,
    isScrollable = false,
    variant,
    isHighlightingLines,
  } = props
  const [isCollapsed, setIsCollapsed] = useState(isHero)
  const [hasCopied, setHasCopied] = useState(false)
  const [code, setCode] = useState(undefined)
  const preRef = useRef<any>(null)
  const frontmatter = useContext(FrontmatterContext)

  useEffect(() => {
    if (preRef.current) {
      const codeElement = preRef.current.querySelector('code')
      if (codeElement) {
        // remove double line breaks
        const code = codeElement.innerText.replace(/\n{3,}/g, '\n')
        setCode(code)
      } else {
        // not collapsible
      }
    }
  }, [preRef])

  useEffect(() => {
    if (hasCopied && code) copy(code)
    setTimeout(() => setHasCopied(false), 1500)
  }, [hasCopied])

  return (
    <YStack
      ref={ref}
      position="relative"
      {...(isHero && {
        px: '$4',
        $gtSm: {
          mx: '$-7',
        },
      })}
    >
      {isCollapsible && (
        <YStack
          position="absolute"
          display="inline-flex"
          alignItems="center"
          justifyContent="flex-end"
          gap="$1"
          top="$-7"
          right="$7"
          $sm={{
            right: '$2',
          }}
        >
          <Button
            theme="dark"
            className="text-shadow"
            chromeless
            onPress={() => setIsCollapsed((x) => !x)}
            textProps={{
              fontSize: '$2',
              color: '$color',
            }}
          >
            {isCollapsed ? 'Show code' : 'Hide code'}
          </Button>

          {/* {isHero && (
            <YStack
              as="form"
              css={{
                display: 'none',
                color: '$whiteA12',
                '@bp1': { display: 'inline-block' },
              }}
              action="https://codesandbox.io/api/v1/sandboxes/define"
              method="POST"
              target="_blank"
            >
              <input type="hidden" name="query" value="module=App.js" />
              <input type="hidden" name="parameters" value={makeCodeSandboxParams(frontmatter.name, code)} />
              <Tooltip content="Open demo in CodeSandbox">
                <Button type="submit" css={{ color: '$whiteA12' }}>
                  <CodeSandboxLogoIcon />
                </Button>
              </Tooltip>
            </Box>
          )} */}
        </YStack>
      )}

      {(!isCollapsed || !isCollapsible) && (
        // TODO this ternary is being compiled backwards!
        <YStack
          position="relative"
          //  {...(isCollapsible ? { top: '$2' } : { my: '$2' })}
        >
          <Pre
            ref={preRef}
            data-invert-line-highlight={isHighlightingLines}
            data-line-numbers={showLineNumbers}
            className={className}
            id={id}
          >
            <Code backgroundColor="transparent" className={className}>
              {children}
            </Code>
          </Pre>
          <Button
            aria-label="Copy code to clipboard"
            position="absolute"
            top="$2"
            right="$2"
            display="inline-flex"
            opacity={0}
            // css={{
            //   '*:hover > &, &:focus': { opacity: 1, transition: '150ms linear' },
            // }}
            onClick={() => setHasCopied(true)}
          >
            {hasCopied ? <CheckCircle /> : <Clipboard />}
          </Button>
        </YStack>
      )}
    </YStack>
  )
})

// const makeCodeSandboxParams = (name, code) => {
//   const css =
//     '*{box-sizing:border-box;margin:0;padding:0;}body{font-family:system-ui;width:100vw;height:100vh;background-image:linear-gradient(330deg, hsl(272,53%,50%) 0%, hsl(226,68%,56%) 100%);display:flex;align-items:flex-start;justify-content:center;}body>div{padding-top:120px}svg{display:block;}'

//   const parameters = getParameters({
//     files: {
//       'package.json': {
//         content: {
//           dependencies: {
//             react: 'latest',
//             'react-dom': 'latest',
//             '@stitches/react': 'latest',
//             '@radix-ui/colors': 'latest',
//             '@radix-ui/react-icons': 'latest',
//             [`@radix-ui/react-${name}`]: 'latest',
//           },
//         } as any,
//         isBinary: false,
//       },
//       'App.js': {
//         content: code,
//         isBinary: false,
//       },
//       'index.js': {
//         content: `import React from 'react';
// import ReactDOM from 'react-dom';

// import App from './App';
// import './styles.css';

// ReactDOM.render(<div><App /></div>, document.getElementById('root'));`,
//         isBinary: false,
//       },
//       'styles.css': {
//         content: css,
//         isBinary: false,
//       },
//     },
//     template: 'create-react-app',
//   })

//   return parameters
// }
