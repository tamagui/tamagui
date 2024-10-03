import { View, styled } from 'tamagui'

export const ContainerDocs = styled(View, {
  py: '$8',
  px: '$5',
  mx: 'auto',
  width: '100%',
  pos: 'relative',
  maxWidth: 900,
  br: '$5',

  $gtSm: {
    mt: 20,
    maxWidth: 760,
    px: '$8',
  },

  $gtMd: {
    y: -50,
    maxWidth: `min(840px, calc(100vw - 250px))`,
    x: '15%',
  },

  $gtLg: {
    maxWidth: 840,
    y: -50,
    x: '2%',
  },
})

export const ContainerSm = styled(View, {
  // className: 'container-sm-shadow',
  mx: 'auto',
  px: '$5',
  py: '$3',
  width: '100%',
  pos: 'relative',
  maxWidth: 900,
  // background: '#fff',
  // background: 'rgba(255,255,255,0.5)',
  // backdropFilter: 'blur(20px)',
  br: '$10',

  // '$theme-dark': {
  //   // background: '#000',
  //   background: 'rgba(20,20,20, 0.88)',
  // },

  $gtSm: {
    px: '$10',
    py: '$6',
  },
})

export const Container = styled(View, {
  mx: 'auto',
  px: '$4',
  width: '100%',
  pos: 'relative',

  $gtSm: {
    maxWidth: 760,
    pr: '$2',
  },

  $gtMd: {
    maxWidth: 760,
    pr: '$2',
  },

  $gtLg: {
    maxWidth: 840,
    pr: '$10',
  },
})
