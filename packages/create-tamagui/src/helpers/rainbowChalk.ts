import chalk from 'chalk'

export const rainbowColors = [
  '#f76808',
  '#f5d90a',
  '#30a46c',
  '#0091ff',
  '#8e4ec6',
  '#d6409f',
  '#e5484d',
]

export const makeRainbowChalk = (text: string) =>
  text
    .split('')
    .map((char, idx) => chalk.hex(rainbowColors[idx % rainbowColors.length])(char))
    .join('')
