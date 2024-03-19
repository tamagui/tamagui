import chalk from 'chalk'

import { rainbowColors } from './rainbowChalk'

export const tamaguiAsciiArt = `▀█▀ ▄▀█ █▀▄▀█ ▄▀█ █▀▀ █ █ █
 █  █▀█ █ ▀ █ █▀█ █▄█ █▄█ █`

export const tamaguiRainbowAsciiArt = (function () {
  const char0_1 = chalk.hex(rainbowColors[0])('▀█▀')
  const char0_2 = chalk.hex(rainbowColors[0])(' █ ')

  const char1_1 = chalk.hex(rainbowColors[1])('▄▀█')
  const char1_2 = chalk.hex(rainbowColors[1])('█▀█')

  const char2_1 = chalk.hex(rainbowColors[2])('█▀▄▀█')
  const char2_2 = chalk.hex(rainbowColors[2])('█ ▀ █')

  const char3_1 = chalk.hex(rainbowColors[3])('▄▀█')
  const char3_2 = chalk.hex(rainbowColors[3])('█▀█')

  const char4_1 = chalk.hex(rainbowColors[4])('█▀▀')
  const char4_2 = chalk.hex(rainbowColors[4])('█▄█')

  const char5_1 = chalk.hex(rainbowColors[5])('█ █')
  const char5_2 = chalk.hex(rainbowColors[5])('█▄█')

  const char6_1 = chalk.hex(rainbowColors[6])('█')
  const char6_2 = chalk.hex(rainbowColors[6])('█')
  return `${char0_1} ${char1_1} ${char2_1} ${char3_1} ${char4_1} ${char5_1} ${char6_1}
${char0_2} ${char1_2} ${char2_2} ${char3_2} ${char4_2} ${char5_2} ${char6_2}
`
})()

export const takeoutAsciiArt = `████████╗░█████╗░██╗░░██╗███████╗░█████╗░██╗░░░██╗████████╗
╚══██╔══╝██╔══██╗██║░██╔╝██╔════╝██╔══██╗██║░░░██║╚══██╔══╝
░░░██║░░░███████║█████═╝░█████╗░░██║░░██║██║░░░██║░░░██║░░░
░░░██║░░░██╔══██║██╔═██╗░██╔══╝░░██║░░██║██║░░░██║░░░██║░░░
░░░██║░░░██║░░██║██║░╚██╗███████╗╚█████╔╝╚██████╔╝░░░██║░░░
░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝░╚════╝░░╚═════╝░░░░╚═╝░░░`

export const tamaguiDuckAsciiArt = `        ████████████          
      ██            ██        
    ██            ██  ██████  
  ██        ██              ██
  ██                  ████████
  ██                        ██
  ██                    ████  
██                    ██      
██                    ██      `
