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
import { Stack, Theme } from '@tamagui/core'
  
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

const snippetUsage2 = highlightCode(
  `
import { Stack, Theme } from '@tamagui/core'
  
export default () => (
  <Theme name="light">
    <MyWidget />
  </Theme>
)

const MyWidget = () => (
  <Stack backgroundColor="$background">
    Themed Background
  </Stack>
)
`,
  'tsx'
)

const snippetUsage3 = highlightCode(
  `
import { Stack, Theme } from '@tamagui/core'
  
export default () => (
  <Theme name="dark">
    <MyWidget />
  </Theme>
)

const MyWidget = () => (
  <Stack backgroundColor="$background">
    Themed Background
  </Stack>
)
`,
  'tsx'
)

const snippetUsageComplex = highlightCode(
  `
import { Stack, Text } from '@tamagui/core'
  
export default () => (
  <Theme name="light">
    <MyWidget />

    <Theme name="dark">
      <MyWidget />
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
    <MyWidget />

    <Theme inverse>
      <MyWidget />
    </Theme>
  </Theme>
)
`,
  'tsx'
)

const snippetUsageSub = highlightCode(
  `
import { Stack, Text } from '@tamagui/core'
  
export default () => (
  <Theme name="light">
    <Theme name="red">
      <MyWidget />
    </Theme>
  </Theme>
)

const MyWidget = () => (
  <Stack backgroundColor="$background">
    Light Red Background
  </Stack>
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
      <MyWidget />

      {/* Now make it dark_red */}
      <Theme inverse>
        <MyWidget />
      </Theme>
    </Theme>
  </Theme>
)

const MyWidget = () => (
  <Stack backgroundColor="$background">
    Light Red Background
  </Stack>
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
      theme="pink"
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
        ],

        [
          {
            type: 'code',
            content: snippetUsage2,
          },
        ],

        [
          {
            type: 'code',
            content: snippetUsage3,
          },
        ],

        [
          {
            type: 'callout',
            content: `dark:color300 👎`,
          },
        ],

        [
          {
            type: 'callout',
            content: `theme="dark" 👍`,
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
            type: 'callout',
            content: `Sub-themes`,
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
        ],

        [
          {
            type: 'code',
            content: snippetUsageSub,
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
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-1.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-1.5.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-2.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-3.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-4.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-5.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-6.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-7.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: require('../images/themes-8.png').default,
          },
        ],

        // [
        //   {
        //     type: 'content',
        //     content: (
        //       <YStack
        //         my={-100}
        //         als="center"
        //         mx="auto"
        //         ai="center"
        //         br="$4"
        //         ov="hidden"
        //         elevation="$5"
        //       >
        //         <video autoPlay loop style={{ width: 800, height: 800 }}>
        //           <source src="/talk/themes-demo.mp4" />
        //         </video>
        //       </YStack>
        //     ),
        //   },
        // ],

        // [
        //   {
        //     type: 'fullscreen',
        //     content: (
        //       <iframe
        //         width="100%"
        //         height="100%"
        //         src="https://www.youtube.com/embed/FqFLwud5l7g"
        //         title="beatgig-demo"
        //         frameBorder={0}
        //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        //         allowFullScreen
        //       />
        //     ),
        //   },
        // ],

        [
          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
            content: [
              {
                type: 'text',
                content: `Works with animation drivers`,
              },
            ],
          },

          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
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
            slim: true,
            content: [
              {
                type: 'text',
                content: `useTheme() hook escape hatch`,
              },
            ],
          },

          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
            content: [
              {
                type: 'text',
                content: `Nest as many times as you want`,
              },
            ],
          },
          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
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
