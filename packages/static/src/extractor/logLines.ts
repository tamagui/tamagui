export const logLines = (str: string) => {
  let lines: string[] = ['']
  const items = str.split(' ')
  for (const item of items) {
    if (item.length + lines[lines.length - 1].length > 100) {
      lines.push('')
    }
    lines[lines.length - 1] += item + ' '
  }
  return lines.map((line, i) => '           ' + (i == 0 ? '' : ' ') + line.trim()).join('\n')
}
