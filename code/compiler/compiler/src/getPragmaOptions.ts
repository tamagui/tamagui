export function getPragmaOptions({
  source,
  path,
}: {
  source: string
  path: string
}) {
  let shouldPrintDebug: boolean | 'verbose' = false
  let shouldDisable = false

  // try and avoid too much parsing but sometimes esbuild adds helpers above..
  const firstLines = source.slice(0, 800)

  let pragma = ''
  for (const line of firstLines.split('\n')) {
    pragma =
      line
        .match(/(\/\/|\/\*)\s?\!?\s?(tamagui-ignore|debug|debug-verbose)(\n|\s|$).*/)?.[2]
        .trim() || ''
    if (pragma) {
      pragma = pragma.replace('!', '').trim()
      break
    }
  }

  switch (pragma) {
    case 'tamagui-ignore':
      shouldDisable = true
      break

    case 'debug':
      shouldPrintDebug = true
      break

    case 'debug-verbose':
      shouldPrintDebug = 'verbose'
      break
  }

  if (process.env.TAMAGUI_DEBUG_FILE) {
    if (path.includes(process.env.TAMAGUI_DEBUG_FILE)) {
      shouldPrintDebug = 'verbose'
    }
  }

  if (process.env.DEBUG?.includes('tamagui')) {
    shouldPrintDebug ||= true
  }

  if (process.env.DEBUG?.includes('tamagui-verbose')) {
    shouldPrintDebug = 'verbose'
  }

  return {
    shouldPrintDebug,
    shouldDisable,
  }
}
