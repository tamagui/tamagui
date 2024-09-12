export const greet = (name: string): string => {
  return `Hello, ${name}!`
}

export const paltformGreeter = (name: string): string => {
  let salutation
  process.env.TAMAGUI_TARGET === 'web' ? (salutation = 'Hi') : (salutation = 'Hello')
  process.env.TAMAGUI_TARGET === 'native' ? (salutation = 'Hey') : (salutation = 'Hello')
  return `${salutation}, ${name}!`
}
