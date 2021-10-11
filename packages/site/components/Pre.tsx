export const Pre = () => <div />

// import { styled, theme } from '@modulz/design-system';

// export const Pre = styled('pre', {
//   $$background: '$loContrast',
//   $$text: '$colors$hiContrast',
//   $$outline: '0 0 0 1px $colors$slate6',
//   $$syntax1: '$colors$blue11',
//   $$syntax2: '$colors$cyan11',
//   $$syntax3: '$colors$blue11',
//   $$syntax4: '$colors$blue11',
//   $$comment: '$colors$slate10',
//   $$removed: '$colors$red11',
//   $$added: '$colors$green11',
//   $$lineNumbers: '$colors$indigo5',
//   $$fadedLines: '$colors$slate10',
//   $$highlightedWord1Bg: '$colors$violet4',
//   $$highlightedWord1BgActive: '$colors$violet6',
//   $$highlightedWord1Text: '$colors$violet11',
//   $$highlightedWord2Bg: '$colors$red3',
//   $$highlightedWord2BgActive: '$colors$red5',
//   $$highlightedWord2Text: '$colors$red11',
//   $$highlightedWord3Bg: '$colors$green3',
//   $$highlightedWord3BgActive: '$colors$green5',
//   $$highlightedWord3Text: '$colors$green11',

//   boxSizing: 'border-box',
//   borderRadius: '$3',
//   padding: '$3',
//   overflow: 'auto',
//   fontFamily: '$mono',
//   fontSize: '$2',
//   lineHeight: '21px',
//   whiteSpace: 'pre',
//   position: 'relative',
//   backgroundColor: '$$background',
//   color: '$$text',
//   boxShadow: '$$outline',

//   '& > code': {
//     display: 'block',
//   },

//   '.token.parameter': {
//     color: '$$text',
//   },

//   '.token.tag, .token.class-name, .token.selector, .token.selector .class, .token.function': {
//     color: '$$syntax1',
//   },

//   '.token.attr-value, .token.class, .token.string, .token.number, .token.unit, .token.color': {
//     color: '$$syntax2',
//   },

//   '.token.attr-name, .token.keyword, .token.rule, .token.operator, .token.pseudo-class, .token.important': {
//     color: '$$syntax3',
//   },

//   '.token.punctuation, .token.module, .token.property': {
//     color: '$$syntax4',
//   },

//   '.token.comment': {
//     color: '$$comment',
//   },

//   '.token.atapply .token:not(.rule):not(.important)': {
//     color: 'inherit',
//   },

//   '.language-shell .token:not(.comment)': {
//     color: 'inherit',
//   },

//   '.language-css .token.function': {
//     color: 'inherit',
//   },

//   '.token.deleted:not(.prefix), .token.inserted:not(.prefix)': {
//     display: 'block',
//     px: '$4',
//     mx: '-20px',
//   },

//   '.token.deleted:not(.prefix)': {
//     color: '$$removed',
//   },

//   '.token.inserted:not(.prefix)': {
//     color: '$$added',
//   },

//   '.token.deleted.prefix, .token.inserted.prefix': {
//     userSelect: 'none',
//   },

//   // Styles for highlighted word
//   '.highlight-word': {
//     $$bgAndShadow: '$$highlightedWord1Bg',
//     $$xOffset: '1px',
//     color: '$$highlightedWord1Text',
//     backgroundColor: '$$bgAndShadow',
//     display: 'inline-block',
//     boxShadow: '$$xOffset 0 0 0 $$bgAndShadow, -$$xOffset 0 0 0 $$bgAndShadow',

//     // reset the color for tokens inside highlighted words
//     '.token': {
//       color: 'inherit',
//     },

//     '&.on': {
//       $$bgAndShadow: '$$highlightedWord1BgActive',
//       transition: 'all 100ms ease',
//       cursor: 'pointer',
//     },
//   },

//   '.token.deleted .highlight-word': {
//     $$bgAndShadow: '$$highlightedWord2Bg',
//     color: '$$highlightedWord2Text',

//     '&.on': {
//       $$bgAndShadow: '$$highlightedWord2BgActive',
//     },
//   },

//   '.token.inserted .highlight-word': {
//     $$bgAndShadow: '$$highlightedWord3Bg',
//     color: '$$highlightedWord3Text',

//     '&.on': {
//       $$bgAndShadow: '$$highlightedWord3BgActive',
//     },
//   },

//   // Line numbers
//   '&[data-line-numbers=true]': {
//     '.highlight-line': {
//       position: 'relative',
//       paddingLeft: '$4',

//       '&::before': {
//         content: 'attr(data-line)',
//         position: 'absolute',
//         left: -5,
//         top: 0,
//         color: '$$lineNumbers',
//       },
//     },
//   },

//   // Styles for highlighted lines
//   '.highlight-line': {
//     '&, *': {
//       transition: 'color 150ms ease',
//     },
//     '&[data-highlighted=false]': {
//       '&, *': {
//         color: '$$fadedLines',
//       },
//     },
//   },

//   // Typewriter styles
//   '.typewriter': {
//     opacity: 0,
//   },

//   variants: {
//     variant: {
//       violet: {
//         $$background: theme.colors.mauve12.value,
//         $$text: theme.colors.gray5.value,
//         $$outline: 'none',
//         $$syntax1: theme.colors.cyan8.value,
//         $$syntax2: theme.colors.violet8.value,
//         $$syntax3: theme.colors.cyan8.value,
//         $$syntax4: theme.colors.cyan8.value,
//         $$comment: theme.colors.mauve9.value,
//         $$removed: '$colors$red9',
//         $$added: '$colors$green9',
//         $$lineNumbers: 'hsl(210 37% 35%)',
//         $$fadedLines: theme.colors.slate11.value,
//         $$highlightedWord1Bg: '$colors$indigo12',
//         $$highlightedWord1BgActive: '$colors$indigo11',
//         $$highlightedWord1Text: '$colors$indigo4',
//         $$highlightedWord2Bg: '$colors$red12',
//         $$highlightedWord2BgActive: '$colors$red11',
//         $$highlightedWord2Text: '$colors$red4',
//         $$highlightedWord3Bg: '$colors$green12',
//         $$highlightedWord3BgActive: '$colors$green11',
//         $$highlightedWord3Text: '$colors$green4',
//       },
//       cyan: {
//         $$background: theme.colors.slate12.value,
//         $$text: theme.colors.gray5.value,
//         $$outline: 'none',
//         $$syntax1: theme.colors.yellow7.value,
//         $$syntax2: theme.colors.cyan7.value,
//         $$syntax3: theme.colors.yellow7.value,
//         $$syntax4: theme.colors.yellow7.value,
//         $$comment: theme.colors.slate10.value,
//         $$removed: '$colors$red9',
//         $$added: '$colors$green9',
//         $$lineNumbers: 'hsl(210 37% 35%)',
//         $$fadedLines: theme.colors.slate11.value,
//         $$highlightedWord1Bg: '$colors$indigo12',
//         $$highlightedWord1BgActive: '$colors$indigo11',
//         $$highlightedWord1Text: '$colors$indigo4',
//         $$highlightedWord2Bg: '$colors$red12',
//         $$highlightedWord2BgActive: '$colors$red11',
//         $$highlightedWord2Text: '$colors$red4',
//         $$highlightedWord3Bg: '$colors$green12',
//         $$highlightedWord3BgActive: '$colors$green11',
//         $$highlightedWord3Text: '$colors$green4',
//       },
//       yellow: {
//         $$background: 'hsl(50 10% 5%)',
//         $$text: theme.colors.gray5.value,
//         $$outline: 'none',
//         $$syntax1: theme.colors.red8.value,
//         $$syntax2: theme.colors.yellow7.value,
//         $$syntax3: theme.colors.red8.value,
//         $$syntax4: theme.colors.red8.value,
//         $$comment: theme.colors.sand9.value,
//         $$removed: '$colors$red9',
//         $$added: '$colors$green9',
//         $$lineNumbers: theme.colors.yellow10.value,
//         $$fadedLines: theme.colors.sand11.value,
//         $$highlightedWord1Bg: '$colors$indigo12',
//         $$highlightedWord1BgActive: '$colors$indigo11',
//         $$highlightedWord1Text: '$colors$indigo4',
//         $$highlightedWord2Bg: '$colors$red12',
//         $$highlightedWord2BgActive: '$colors$red11',
//         $$highlightedWord2Text: '$colors$red4',
//         $$highlightedWord3Bg: '$colors$green12',
//         $$highlightedWord3BgActive: '$colors$green11',
//         $$highlightedWord3Text: '$colors$green4',
//       },
//       blue: {
//         $$background: theme.colors.slate12.value,
//         $$text: theme.colors.gray5.value,
//         $$outline: 'none',
//         $$syntax1: theme.colors.blue8.value,
//         $$syntax2: theme.colors.pink8.value,
//         $$syntax3: theme.colors.blue8.value,
//         $$syntax4: theme.colors.blue8.value,
//         $$comment: theme.colors.slate9.value,
//         $$removed: '$colors$red9',
//         $$added: '$colors$green9',
//         $$lineNumbers: 'hsl(210 37% 35%)',
//         $$fadedLines: theme.colors.slate11.value,
//         $$highlightedWord1Bg: '$colors$indigo12',
//         $$highlightedWord1BgActive: '$colors$indigo11',
//         $$highlightedWord1Text: '$colors$indigo4',
//         $$highlightedWord2Bg: '$colors$red12',
//         $$highlightedWord2BgActive: '$colors$red11',
//         $$highlightedWord2Text: '$colors$red4',
//         $$highlightedWord3Bg: '$colors$green12',
//         $$highlightedWord3BgActive: '$colors$green11',
//         $$highlightedWord3Text: '$colors$green4',
//       },
//     },
//   },
// });
