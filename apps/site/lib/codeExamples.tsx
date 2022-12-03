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
    <Heading size={props.big ? 'large' : 'small'}>Lorem ipsum dolor.</Heading>
  </Stack>
)`,
        },

        {
          name: 'heading.tsx',
          language: 'tsx',
          code: `import { Text, styled } from '@tamagui/core'

export const Heading = styled(Text, {
  tag: 'h1',
  color: '$color',
  backgroundColor: '$background',

  variants: {
    size: {
      large: {
        fontSize: 22,
      },
      small: {
        fontSize: 16,
      },
    },
  },
})
`,
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
          code: `import { concatClassName } from "@tamagui/helpers";
import { Stack } from '@tamagui/core';
import { Heading } from '@tamagui/sandbox-ui';

export default (props) => (
  <div className={_cn}>
    <span className={concatClassName(_cn2 + (_cn3 + (props.big ? _cn4 : _cn4)))}>Lorem ipsum dolor.</span>
  </div>
);

const _cn4 = " _col-b5vn3b _ff-4yewjq";
const _cn3 = " _ml-0px _mb-0px _mr-0px _mt-0px _col-b5vn3b _tt-3tb9js _ff-4yewjq _fow-3uqci0 _ls-3w5fg8 _fos-3slq2o _lh-3or5x5 _cur-text _ussel-text _ww-break-word _bxs-border-box _dsp-inline  ";
const _cn2 = "  is_Heading font_heading";
const _cn = "  is_Stack _fd-column _miw-0px _mih-0px _pos-relative _bxs-border-box _fb-auto _dsp-flex _fs-0 _ai-stretch _w-550px _pr-1aj148u _pl-1aj148u _pr-_gtSm_1aj14ca _pl-_gtSm_1aj14ca ";
`,
          language: 'tsx',
        },
        {
          name: 'app.css',
          code: ` ._fd-column{flex-direction:column;}
._miw-0px{min-width:0px;}
._mih-0px{min-height:0px;}
._pos-relative{position:relative;}
._bxs-border-box{box-sizing:border-box;}
._fb-auto{flex-basis:auto;}
._dsp-flex{display:flex;}
._fs-0{flex-shrink:0;}
._ai-stretch{align-items:stretch;}
._w-550px{width:550px;}
._pr-1aj148u{padding-right:var(--space-3);}
._pl-1aj148u{padding-left:var(--space-3);}
@media screen and (min-width: 801px) { :root:root ._pr-_gtSm_1aj14ca{padding-right:var(--space-7);} }
@media screen and (min-width: 801px) { :root:root ._pl-_gtSm_1aj14ca{padding-left:var(--space-7);} }
._ml-0px{margin-left:0px;}
._mb-0px{margin-bottom:0px;}
._mr-0px{margin-right:0px;}
._mt-0px{margin-top:0px;}
._col-b5vn3b{color:var(--color);}
._tt-3tb9js{text-transform:var(--f-tr-8);}
._ff-4yewjq{font-family:var(--f-fa);}
._fow-3uqci0{font-weight:var(--f-we-8);}
._ls-3w5fg8{letter-spacing:var(--f-yw-8);}
._fos-3slq2o{font-size:var(--f-si-8);}
._lh-3or5x5{line-height:var(--f-li-8);}
._cur-text{cursor:text;}
._ussel-text{user-select:text;-webkit-user-select:text;}
._ww-break-word{word-wrap:break-word;}
._dsp-inline{display:inline;}`,
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
