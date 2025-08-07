const prefix = '           '

export const logLines = (str: string, singleLine = false) => {
  if (singleLine) {
    return prefix + str.split(' ').join(`\n${prefix}`)
  }
  const lines: string[] = ['']
  const items = str.split(' ')
  for (const item of items) {
    if (item.length + lines[lines.length - 1].length > 85) {
      lines.push('')
    }
    lines[lines.length - 1] += item + ' '
  }
  return lines.map((line, i) => prefix + (i == 0 ? '' : ' ') + line.trim()).join('\n')
}
