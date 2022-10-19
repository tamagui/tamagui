export const animationCode = `import { Button, Square } from 'tamagui'

export default () => {
  const [positionI, setPositionI] = React.useState(0)
  return (
    <>
      <Square
        animation="bouncy"
        size={110}
        bc="$pink10"
        br="$9"
        hoverStyle={{
          scale: 1.1,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...positions[positionI]}
      >
        <LogoIcon />
      </Square>

      <Button
        pos="absolute"
        b={20}
        l={20}
        icon={require('@tamagui/lucide-icons').Play}
        size="$6"
        circular
        onPress={() => setPositionI(i => (i + 1) % positions.length)}
      />
    </>
  )
}

export const positions = [
  {
    x: 0,
    y: 0,
    scale: 1,
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: 0.5,
    rotate: '-45deg',
    hoverStyle: {
      scale: 0.6,
    },
    pressStyle: {
      scale: 0.4,
    },
  },
  {
    x: 50,
    y: 50,
    scale: 1,
    rotate: '180deg',
    hoverStyle: {
      scale: 1.1,
    },
    pressStyle: {
      scale: 0.9,
    },
  },
]
`

export const compilationCode = [
  {
    name: 'Styles',
    input: {
      description: 'A powerful `styled` constructor, inline props, shorthands and more.',
      examples: [
        {
          name: 'app.tsx',
          language: 'tsx',
          code: `import { styled, Stack } from '@tamagui/core'
import { Heading } from './Heading'

const App = (props) => (
  <Stack px="$2" w={550} $gtSm={{ px: '$6' }}>
    <Heading inverse={props.inverse}>
      Lorem ipsum dolor.
    </Text>
  </Stack>
)`,
        },

        {
          name: 'heading.tsx',
          language: 'tsx',
          code: `import { styled, Text } from '@tamagui/core'

export const Heading = styled(Text, {
  tag: 'h1',
  c: '$color',
  bc: '$background',

  variants: {
    inverse: {
      true: {
        bc: '$color',
        c: '$background',
      }
    }
  }
})`,
        },

        {
          name: 'tamagui.config.ts',
          language: 'tsx',
          code: `export default createTamagui({
  shorthands: {
    px: 'paddingHorizontal',
    w: 'width',
    c: 'color',
    bc: 'backgroundColor',
    fs: 'fontSize',
  },
  // ...the rest of your configuration
})`,
        },
      ],
    },
    output: {
      description:
        'Styles extracted, logic evaluated, and a flatter tree with atomic CSS styles per-file.',
      examples: [
        {
          name: 'app.js',
          code: `const _cn3 = " _color-scmqyp _d-1471scf _ff-187pbxx _fs-7uzi8p"
const _cn2 = " _color-scmqyp _d-1471scf _ff-187pbxx"
const _cn = " _d-6koalj _fd-eqz5dr _fs-1q142lx _pl-11jtx42 _pr-4a8ukp _w-11mp6g5 _pl-_gtSm_1hxi05q _pr-_gtSm_poy3ov"

const App = (props) => <div className={_cn}>
  <h1 className={_cn2 + ' ' + props.inverse ? _cn3 : _cn4}>
    Lorem ipsum dolor.
  </h1>
</div>`,
          language: 'tsx',
        },
        {
          name: 'app.css',
          code: `._d-6koalj{display:flex;}
._fd-eqz5dr{flex-direction:column;}
._fs-1q142lx{flex-shrink:0;}
._pl-11jtx42{padding-left:var(--space-2);}
._pr-4a8ukp{padding-right:var(--space-2);}
._w-11mp6g5{width:550px;}
@media screen and (min-width: 861px) { :root:root ._pl-_gtSm_1hxi05q{padding-left:var(--space-6);} }
@media screen and (min-width: 861px) { :root:root ._pr-_gtSm_poy3ov{padding-right:var(--space-6);} }
._d-1471scf{display:inline;}
._fontFamily-187pbxx{font-family:-apple-system,Helvetica,Arial,sans-serif;}
._fontSize-7uzi8p{font-size:var(--fontSize-2);}`,
          language: 'css',
        },
      ],
    },
  },

  {
    name: 'Logic',
    input: {
      description: `V8 partial evaluation of your rendered conditional expressions, spreads, imports, and more.`,
      examples: [
        {
          name: 'app.tsx',
          language: 'tsx',
          code: `import { Paragraph, YStack } from 'tamagui'

const App = (props) => (
  <YStack
    padding={props.big ? '$5' : '$3'}
    {...(props.colorful && {
      backgroundColor: 'green',
    })}
  >
    <Paragraph size="$2">
      Lorem ipsum dolor.
    </Paragraph>
  </YStack>
)
`,
        },
      ],
    },
    output: {
      description:
        'Reduced object and increased render performance, improved SSR with inlinable CSS per-page.',
      examples: [
        {
          name: 'app.js',
          code: `const _cn5 = " _color-scmqyp _d-1471scf _ff-xeweqh _fs-7uzi8p _lineHeight-1l6ykvy"
const _cn4 = "  _bc-1542mo4"
const _cn3 = " _pb-12bic3x _pl-7ztw5e _pr-g6vdx7 _pt-1vq430g"
const _cn2 = " _pb-z3qxl0 _pl-14km6ah _pr-1qpq1qc _pt-1medp4i"
const _cn = " _d-6koalj _fd-eqz5dr _fs-1q142lx "
import { concatClassName } from "@tamagui/helpers"
import { Paragraph, YStack } from 'tamagui'

const App = props => <div className={concatClassName(_cn + (props.big ? _cn2 : _cn3) + (" " + (props.colorful ? _cn4 : " ")))}>
    <span className={_cn5}>
      Lorem ipsum dolor.
    </span>
  </div>
`,
          language: 'tsx',
        },
        {
          name: 'app.css',
          code: `._d-6koalj{display:flex;}
._fd-eqz5dr{flex-direction:column;}
._fs-1q142lx{flex-shrink:0;}
._pb-z3qxl0{padding-bottom:var(--space-5);}
._pl-14km6ah{padding-left:var(--space-5);}
._pr-1qpq1qc{padding-right:var(--space-5);}
._pt-1medp4i{padding-top:var(--space-5);}
._pb-12bic3x{padding-bottom:var(--space-3);}
._pl-7ztw5e{padding-left:var(--space-3);}
._pr-g6vdx7{padding-right:var(--space-3);}
._pt-1vq430g{padding-top:var(--space-3);}
._bc-1542mo4{background-color:rgba(0,128,0,1.00);}
._d-1471scf{display:inline;}
._fontFamily-xeweqh{font-family:var(--font-body);}
._fontSize-7uzi8p{font-size:var(--fontSize-2);}
._lineHeight-1l6ykvy{line-height:var(--lineHeight-2);}`,
          language: 'css',
        },
      ],
    },
  },

  {
    name: 'Media',
    input: {
      description: `Inline media props & useMedia hook. Even with logic, it's evaluated, flattened, and turned into CSS.`,
      examples: [
        {
          name: 'app.tsx',
          language: 'tsx',
          code: `import { YStack } from 'tamagui'

const App = (props) => {
  const media = useMedia()
  return (
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
      {...props.shrinks && media.sm && {
        scale: 0.5
      }}
    />
  )
}
`,
        },
      ],
    },
    output: {
      description:
        'Custom defined media queries output to clean CSS that runs much faster (try resizing this site).',
      examples: [
        {
          name: 'app.js',
          code: `const _cn = " _bc-1g6456j _d-6koalj _fd-eqz5dr _fs-1q142lx _bc--hover-57dg7b _bc-_gtSm_1542mo4 _bc-_gtSm_-active-98uye2 _bc-_gtSm_abc1234"
import { YStack } from 'tamagui'

const App = (props) => <div className={_cn + (props.shrinks ? ' _bc-_gtSm_abc1234' : '')} />`,
          language: 'tsx',
        },
        {
          name: 'app.css',
          code: `
._bc-1g6456j{background-color:rgba(255,0,0,1.00);}
._d-6koalj{display:flex;}
._fd-eqz5dr{flex-direction:column;}
._fs-1q142lx{flex-shrink:0;}
@media not all and (hover: none) { :root  ._bc--hover-57dg7b:hover{background-color:rgba(0,0,255,1.00);} }
@media screen and (min-width: 861px) { :root:root ._bc-_gtSm_1542mo4{background-color:rgba(0,128,0,1.00);} }
@media screen and (min-width: 861px) { :root:root ._bc-_gtSm_-active-98uye2:active{background-color:rgba(255,255,0,1.00);} }
@media screen and (min-width: 861px) { :root:root ._bc-_gtSm_abc1234{background-color:rgba(0,128,0,1.00);} }`,
          language: 'css',
        },
      ],
    },
  },

  {
    name: 'Hooks',
    input: {
      description:
        'Theme and media query hooks, fully typed that work the same across native and web.',
      examples: [
        {
          name: 'app.tsx',
          language: 'tsx',
          code: `import { useMedia, useTheme, YStack } from 'tamagui'

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
      description:
        'If all hooks are used purely for styling, the compiler will remove the hook call entirely.',
      examples: [
        {
          name: 'app.js',
          code: `const _cn = " _d-6koalj _fd-eqz5dr _fs-1q142lx _t-_sm_1exagq _t-_sm0_1wpzndr _bc-_lg_no4z4g _bc-_lg0_1qoifqd _t-_xl_gqa6p0"
import { YStack, useMedia, useTheme } from 'tamagui'

const App = () => {
  return <div className={_cn} />
}`,
          language: 'tsx',
        },
        {
          name: 'app.css',
          code: `._d-6koalj{display:flex;}
._fd-eqz5dr{flex-direction:column;}
._fs-1q142lx{flex-shrink:0;}
@media screen and (max-width: 860px) { :root:root ._t-_sm_1exagq{transform:translateY(10px);} }
@media not all and (max-width: 860px) { :root:root ._t-_sm0_1wpzndr{transform:translateY(0px);} }
@media screen and (min-width: 1120px) { :root:root:root ._bc-_lg_no4z4g{background-color:var(--red);} }
@media not all and (min-width: 1120px) { :root:root:root ._bc-_lg0_1qoifqd{background-color:var(--blue);} }
@media screen and (min-width: 1280px) { :root:root:root:root ._t-_xl_gqa6p0{transform:translateY(var(--space2));} }`,
          language: 'css',
        },
      ],
    },
  },
]
