import { createCodeHighlighter } from '@lib/highlightCode'
import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'
import { YStack } from 'tamagui'

const highlightCode = createCodeHighlighter()

const inputSnippet = highlightCode(
  `
const themes = {
  light: {
    background: '#fff',
    color: '#000',
  },
  dark: {
    background: '#000',
    color: '#fff'
  }
}
`,
  'tsx'
)

const outputSnippet = highlightCode(
  `.t_light {
  --background: #fff;
  --color: #000;
}

.t_dark {
  --background: #000;
  --color: #fff;
}
`,
  'tsx'
)

const inputSnippetSub = highlightCode(
  `
const themes = {
  light_red: {
    background: 'lightred',
    color: 'darkred',
  },
  dark_red: {
    background: 'darkred',
    color: 'lightred'
  }
}
`,
  'tsx'
)

const outputSnippetSub = highlightCode(
  `.t_light_red {
  --background: lightred;
  --color: darkred;
}

.t_dark_red {
  --background: darkred;
  --color: lightred;
}
`,
  'tsx'
)

const snippetUsage = highlightCode(
  `
import { Stack } from '@tamagui/core'
  
export default () => (
  <Theme name="light">
    <Stack backgroundColor="$background">
      Light Background
    </Stack>
  </Theme>
)
`,
  'tsx'
)

const snippetUsageComplex = highlightCode(
  `
import { Stack, Text } from '@tamagui/core'
  
export default () => (
  <Theme name="light">
    <Stack backgroundColor="$background">
      Light Background
    </Stack>

    <Theme name="dark">
      <Text color="$color">
        Dark text
      </Text>
    </Theme>
  </Theme>
)
`,
  'tsx'
)

const snippetUsageInverse = highlightCode(
  `
import { Stack, Text } from '@tamagui/core'
  
export default () => (
  <Theme name="light">
    <Stack backgroundColor="$background">
      Light Background
    </Stack>

    <Theme inverse>
      <Text color="$color">
        Dark text
      </Text>
    </Theme>
  </Theme>
)
`,
  'tsx'
)

const snippetUsageInverseSub = highlightCode(
  `
import { Stack, Text } from '@tamagui/core'
  
export default () => (
  <Theme name="light">
    <Theme name="red">
      <Stack backgroundColor="$background">
        Light Red Background
      </Stack>

      <Theme inverse>
        <Text color="$color">
          Dark red text
        </Text>
      </Theme>
    </Theme>
  </Theme>
)
`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="Core: Themes"
      subTitle="Generics for styling"
      stepsStrategy="replace"
      theme="yellow"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: inputSnippet,
              },
              {
                type: 'code',
                content: outputSnippet,
              },
            ],
          },
        ],

        [
          {
            type: 'code',
            content: snippetUsage,
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: `Don't hardcode dark:color-300, instead change your theme`,
              },
            ],
          },
        ],

        [
          {
            type: 'code',
            content: snippetUsageComplex,
          },
        ],

        [
          {
            type: 'code',
            content: snippetUsageInverse,
          },
        ],

        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: inputSnippetSub,
              },
              {
                type: 'code',
                content: outputSnippetSub,
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: `Nest as many sub-themes as you want, eg`,
              },
              {
                type: 'code-inline',
                props: {
                  color: '$color2',
                },
                content: `dark_red_subtle`,
              },
            ],
          },
        ],

        [
          {
            type: 'code',
            content: snippetUsageInverseSub,
          },
        ],

        [
          {
            type: 'content',
            content: (
              <YStack
                my={-100}
                als="center"
                mx="auto"
                ai="center"
                br="$4"
                ov="hidden"
                elevation="$5"
              >
                <video autoPlay loop style={{ width: 800, height: 800 }}>
                  <source src="/talk/themes-demo.mp4" />
                </video>
              </YStack>
            ),
          },
        ],

        [
          {
            type: 'bullet-point',
            size: '$10',
            content: [
              {
                type: 'text',
                content: `Avoids re-renders on web`,
              },
            ],
          },

          {
            type: 'bullet-point',
            size: '$10',
            content: [
              {
                type: 'text',
                content: `Invertable`,
              },
            ],
          },

          {
            type: 'bullet-point',
            size: '$10',
            content: [
              {
                type: 'text',
                content: `Nested as many times as you want`,
              },
            ],
          },
          {
            type: 'bullet-point',
            size: '$10',
            content: [
              {
                type: 'text',
                content: `Target individual components`,
              },

              {
                type: 'code-inline',
                props: {
                  color: '$color2',
                },
                content: `light_Button`,
              },
            ],
          },
        ],
      ]}
    />
  )
})
