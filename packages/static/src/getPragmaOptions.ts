export function getPragmaOptions({
  source,
  path,
  disableCommentCheck,
}: {
  source: string
  path: string
  disableCommentCheck?: boolean
}) {
  if (!disableCommentCheck && !source.startsWith('//') && !source.startsWith('/*')) {
    return {
      shouldPrintDebug: false,
      shouldDisable: false,
    }
  }

  let shouldPrintDebug: boolean | 'verbose' = false
  let shouldDisable = false

  const firstLine = source.split('\n', 1)[0]

  if (firstLine.includes('tamagui-ignore')) {
    shouldDisable = true
  }

  if (firstLine.includes('debug')) {
    shouldPrintDebug = true
  }

  if (firstLine.includes('debug-verbose')) {
    shouldPrintDebug = 'verbose'
  }

  if (process.env.TAMAGUI_DEBUG_FILE) {
    if (path.includes(process.env.TAMAGUI_DEBUG_FILE)) {
      shouldPrintDebug = 'verbose'
    }
  }

  if (process.env.DEBUG?.includes('tamagui')) {
    shouldPrintDebug = true
  }

  if (process.env.DEBUG?.includes('tamagui-verbose')) {
    shouldPrintDebug = 'verbose'
  }

  return {
    shouldPrintDebug,
    shouldDisable,
  }
}
