import { themes as themesv3 } from '@tamagui/themes/v3-themes'

const light_tan_palette = [
  'hsla(40, 30%, 98%, 1)',
  'hsla(40, 24%, 94%, 1)',
  'hsla(38, 23%, 91%, 1)',
  'hsla(36, 20%, 90%, 1)',
  'hsla(36, 20%, 88%, 1)',
  'hsla(35, 20%, 85%, 1)',
  'hsla(35, 21%, 74%, 1)',
  'hsla(34, 20%, 70%, 1)',
  'hsla(35, 20%, 67%, 1)',
  'hsla(34, 19%, 47%, 1)',
  'hsla(35, 18%, 37%, 1)',
  'hsla(35, 17%, 20%, 1)',
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
  'hsla(30, 9%, 10%, 1)',
  'hsla(30, 10%, 12%, 1)',
  'hsla(31, 11%, 18%, 1)',
  'hsla(30, 12%, 23%, 1)',
  'hsla(30, 14%, 28%, 1)',
  'hsla(30, 16%, 33%, 1)',
  'hsla(30, 18%, 38%, 1)',
  'hsla(30, 20%, 45%, 1)',
  'hsla(30, 21%, 50%, 1)',
  'hsla(29, 22%, 58%, 1)',
  'hsla(34, 24%, 70%, 1)',
  'hsla(11, 12%, 79%, 1)',
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
