import path from 'node:path'

// helper for webpack exclude specific to tamagui

export const shouldExclude = (filePath: string, projectRoot?: string) => {
  if (
    (projectRoot && filePath.includes(projectRoot) && filePath.endsWith('sx')) ||
    isTamaguiDistJSX(filePath)
  ) {
    return false
  }
  return true
}

function isTamaguiDistJSX(filePath: string) {
  return filePath.includes('/dist/jsx/'.replace(/\//g, path.sep))
}
