import { FastForward, Plus } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { Button, H2, H4, InteractiveContainer, Paragraph, Text, XStack, YStack } from 'tamagui'

import { CodeDemo } from './CodeDemo'
import { ContainerLarge } from './Container'
import { IconStack } from './IconStack'

export function HeroExample() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeExample = examples[activeIndex]

  return (
    <ContainerLarge position="relative">
      <YStack
        position="absolute"
        zIndex={0}
        pointerEvents="none"
        opacity={0.1}
        top="10vh"
        right="-20%"
        width="80vw"
        height="80vw"
        scale={1.2}
        maxHeight={720}
        maxWidth={720}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle closest-side, var(--purple5), transparent)`,
          }}
        />
      </YStack>
      <YStack
        position="absolute"
        zi={0}
        pe="none"
        opacity={0.1}
        top="-60%"
        left="-15%"
        w="100%"
        h="100%"
        scale={1.5}
        maxHeight={650}
        maxWidth={520}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle closest-side, var(--blue5), transparent)`,
          }}
        />
      </YStack>

      <YStack zi={1} spacing="$6">
        <H2 als="center">Examples</H2>

        <InteractiveContainer mt={-5} als="center">
          {examples.map((example, i) => {
            return (
              <Button
                textProps={{ fontFamily: '$mono', fontSize: '$2' }}
                onPress={() => setActiveIndex(i)}
                theme={i === activeIndex ? 'active' : null}
                chromeless={i !== activeIndex}
                key={i}
                br={0}
              >
                {example.name}
              </Button>
            )
          })}
        </InteractiveContainer>

        <XStack jc="space-between">
          <YStack flex={1} maxWidth="49%" spacing="$4">
            <Paragraph size="$4" minHeight={50} ta="center" px="$6" color="$color2">
              {activeExample.input.description}
            </Paragraph>

            <H4 size="$1" bc="$pink3" py="$2" px="$3" br="$4" mb="$-7" zi="100" als="center">
              Input
            </H4>
            <YStack>
              {activeExample.input.examples.map((example, i) => (
                <React.Fragment key={example.code}>
                  <CodeDemo
                    language={example.language}
                    mode="interactive"
                    line="3-20"
                    maxHeight={500}
                    value={example.code}
                  />
                  {i < activeExample.input.examples.length - 1 && (
                    <YStack als="center" my="$-4" zIndex={1000}>
                      <Text color="$pink10">
                        <IconStack mb={0}>
                          <Plus size={20} color="currentColor" />
                        </IconStack>
                      </Text>
                    </YStack>
                  )}
                </React.Fragment>
              ))}
            </YStack>
          </YStack>
          <YStack mt={180} mx={-15} zIndex={1000}>
            <Text color="$pink10">
              {/* TODO */}
              <IconStack mb={0}>
                <FastForward size={20} color="currentColor" />
              </IconStack>
            </Text>
          </YStack>
          <YStack flex={1} maxWidth="49%" spacing="$4">
            <Paragraph size="$4" minHeight={50} ta="center" px="$6" color="$color2">
              {activeExample.output.description}
            </Paragraph>
            <H4 size="$1" bc="$pink3" py="$2" px="$3" br="$4" mb="$-7" zi="100" als="center">
              Output
            </H4>
            <YStack>
              {activeExample.output.outputs.map((example, i) => {
                const hasMore = activeExample.output.outputs.length - 1 > i
                return (
                  <React.Fragment key={`${activeIndex}${i}`}>
                    <CodeDemo
                      language={example.language as any}
                      mode="interactive"
                      line="3-20"
                      maxHeight={500}
                      value={example.code}
                    />
                    {hasMore && (
                      <YStack als="center" my="$-4" zIndex={1000}>
                        <Text color="$pink10">
                          <IconStack mb={0}>
                            <Plus size={20} color="currentColor" />
                          </IconStack>
                        </Text>
                      </YStack>
                    )}
                  </React.Fragment>
                )
              })}
            </YStack>
          </YStack>
        </XStack>
      </YStack>
    </ContainerLarge>
  )
}

const examples = [
  {
    name: 'Styles',
    input: {
      description:
        'Your own design system with media queries, themes, inline styles and variants all fully typed.',
      examples: [
        {
          language: 'jsx',
          code: `import { YStack, Text } from 'tamagui'

const App = () => (
  <YStack
    paddingHorizontal="$1"
    width={550}
  >
    <Text fontSize="$1" color="$color">
      Lorem ipsum dolor.
    </Text>
  </YStack>
)`,
        },

        {
          language: 'jsx',
          code: `const tokens = createTokens({
  space: { 1: 5, 2: 10, 3: 20 },
  fontSize: { 1: 12, 2: 14, 3: 16 },
  color: { white: '#fff' }
})

export default createTamagui({
  tokens,
  theme: {
    light: {
      color: tokens.color.white,
    }
  },
})`,
        },
      ],
    },

    output: {
      description: 'Compile-time optimized to atomic CSS, flattened components into div / span.',
      outputs: [
        {
          code: `const cn1 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"
const cn2 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"

function App() {
  return (
  <div className={cn1}>
    <span className={cn2}>
      Lorem ipsum dolor.
    </span>
  </div>
  )
}`,
          language: 'jsx',
        },
        {
          code: `_pLe_10px { padding-left: 10px }
_pRi_10px { padding-left: 10px }
_maWi_550px { padding-left: 10px }
_paTo--notSm--20px { padding-left: 10px }`,
          language: 'css',
        },
      ],
    },
  },

  {
    name: 'Conditionals',
    input: {
      description: `The compiler supports analyzing nested logical statements, imports, and non-dynamic expressions.`,
      examples: [
        {
          language: 'jsx',
          code: `import { YStack } from 'tamagui'

const App = (props) => (
  <YStack
    padding={props.big ? '$5' : '$3'}
    {...props.colored && {
      backgroundColor: 'green'
    }}
  >
    <Paragraph color="$color3" size="$2">
      Lorem ipsum dolor.
    </Paragraph>
  </YStack>
)`,
        },
      ],
    },
    output: {
      description:
        'Instead of large objects, your render function now just concats a single className string.',
      outputs: [
        {
          code: `const cn1 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"
const cn2 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"

function App() {
  return (
    <div className={cn1}>
      <span className={cn2}>
        Lorem ipsum dolor.
      </span>
    </div>
  )
}`,
          language: 'jsx',
        },
        {
          code: `_pLe_10px { padding-left: 10px }
_pRi_10px { padding-left: 10px }
_maWi_550px { padding-left: 10px }
_paTo--notSm--20px { padding-left: 10px }`,
          language: 'css',
        },
      ],
    },
  },

  {
    name: 'Responsive',
    input: {
      description:
        'Psuedo states styling and media queries extract at compile-time, but fallback gracefully at runtime.',
      examples: [
        {
          language: 'jsx',
          code: `import { YStack, Text } from 'tamagui'

const App = () => (
  <YStack
    backgroundColor="red"
    hoverStyle={{
      backgroundColor: 'blue',
    }}
    $gtSm={{
      backgroundColor: 'green',
      pressStyle: {
        backgroundColor: 'yellow',
      }
    }}
  />
)
`,
        },
      ],
    },
    output: {
      description:
        'Instead of large objects, your render function now just concats a single className string.',
      outputs: [
        {
          code: `const cn1 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"
const cn2 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"

function App() {
  return (
    <div className={cn1}>
      <span className={cn2}>
        Lorem ipsum dolor.
      </span>
    </div>
  )
}`,
          language: 'jsx',
        },
        {
          code: `_pLe_10px { padding-left: 10px }
_pRi_10px { padding-left: 10px }
_maWi_550px { padding-left: 10px }
_paTo--notSm--20px { padding-left: 10px }`,
          language: 'css',
        },
      ],
    },
  },

  {
    name: 'Shorthands',
    input: {
      description:
        'Inline styles work well with shorthands (think Tailwind) to prevent long lines. Define your own, fully typed.',
      examples: [
        {
          language: 'jsx',
          code: `import { YStack, Text } from 'tamagui'

const App = () => (
  <YStack px="$2" w={550} $gtSm={{ px: '$6' }}>
    <Text c="$color3" fs="$2">
      Lorem ipsum dolor.
    </Text>
  </YStack>
)`,
        },

        {
          language: 'jsx',
          code: `export default createTamagui({
  shorthands: {
    px: 'paddingHorizontal',
    w: 'width',
    c: 'color',
    fs: 'fontSize',
  }
})`,
        },
      ],
    },
    output: {
      description:
        'The compiler optimizes all objects into className + atomic CSS, flattening Stack and Text views into div and span.',
      outputs: [
        {
          code: `const cn1 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"
const cn2 = "_pLe_10px _pRi_10px _maWi_550px _paTo--notSm--20px"

function App() {
  return (
  <div className={cn1}>
    <span className={cn2}>
      Lorem ipsum dolor.
    </span>
  </div>
  )
}`,
          language: 'jsx',
        },
        {
          code: `_pLe_10px { padding-left: 10px }
_pRi_10px { padding-left: 10px }
_maWi_550px { padding-left: 10px }
_paTo--notSm--20px { padding-left: 10px }`,
          language: 'css',
        },
      ],
    },
  },

  {
    name: 'Hooks',
    input: {
      description:
        'Use theme and media queries naturally as hooks. The compiler optimizes purely style values away.',
      examples: [
        {
          language: 'jsx',
          code: `import { YStack } from 'tamagui'

const App = () => {
  const theme = useTheme()
  const media = useMedia()
  
  return (
    <YStack
      y={media.sm ? 10 : 0}
      backgroundColor={media.lg ? theme.red : theme.blue}
      {...media.xl && {
        y: theme.space2
      }}
    />
  )
}`,
        },
      ],
    },
    output: {
      description: 'The compiler optimizes everything away to CSS.',
      outputs: [
        {
          code: `const cn1 = ''

const App = () => {
  return (
    <div className={cn1} />
  )
}`,
          language: 'jsx',
        },
        {
          code: `@media`,
          language: 'css',
        },
      ],
    },
  },
]
