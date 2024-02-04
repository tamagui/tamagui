import { themes as themesv3 } from '@tamagui/themes/v3-themes'

const light_tan_palette = [
  'hsla(40, 40%, 93%, 1)',
  'hsla(40, 36%, 90%, 1)',
  'hsla(38, 35%, 87%, 1)',
  'hsla(36, 34%, 84%, 1)',
  'hsla(36, 33%, 80%, 1)',
  'hsla(35, 32%, 77%, 1)',
  'hsla(35, 31%, 74%, 1)',
  'hsla(34, 30%, 70%, 1)',
  'hsla(35, 30%, 67%, 1)',
  'hsla(34, 29%, 47%, 1)',
  'hsla(35, 28%, 37%, 1)',
  'hsla(35, 27%, 20%, 1)',
]

const light_tan = {
  color1: light_tan_palette[0],
  color2: light_tan_palette[1],
  color3: light_tan_palette[2],
  color4: light_tan_palette[3],
  color5: light_tan_palette[4],
  color6: light_tan_palette[5],
  color7: light_tan_palette[6],
  color8: light_tan_palette[7],
  color9: light_tan_palette[8],
  color10: light_tan_palette[9],
  color11: light_tan_palette[10],
  color12: light_tan_palette[11],
  color: light_tan_palette[11],
  background: light_tan_palette[0],
}

const dark_tan_palette = [
  'hsla(30, 10%, 14%, 1)',
  'hsla(30, 13%, 16%, 1)',
  'hsla(31, 15%, 22%, 1)',
  'hsla(30, 18%, 25%, 1)',
  'hsla(30, 21%, 32%, 1)',
  'hsla(30, 22%, 36%, 1)',
  'hsla(30, 23%, 49%, 1)',
  'hsla(30, 24%, 50%, 1)',
  'hsla(30, 25%, 52%, 1)',
  'hsla(29, 28%, 65%, 1)',
  'hsla(34, 24%, 71%, 1)',
  'hsla(11, 16%, 74%, 1)',
]

const dark_tan = {
  color1: dark_tan_palette[0],
  color2: dark_tan_palette[1],
  color3: dark_tan_palette[2],
  color4: dark_tan_palette[3],
  color5: dark_tan_palette[4],
  color6: dark_tan_palette[5],
  color7: dark_tan_palette[6],
  color8: dark_tan_palette[7],
  color9: dark_tan_palette[8],
  color10: dark_tan_palette[9],
  color11: dark_tan_palette[10],
  color12: dark_tan_palette[11],
  color: dark_tan_palette[11],
  background: dark_tan_palette[0],
}

export const themes = {
  ...themesv3,
  light_tan,
  dark_tan,
}
