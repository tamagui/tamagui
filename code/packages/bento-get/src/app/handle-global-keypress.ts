// Handle keypress events for the CLI
import { debugLog } from '../commands/index.js'

import type { AppContextType } from '../data/AppContext.js'

export const handleGlobalKeyPress = (
  key: string,
  modifier: any,
  appContext: AppContextType,
  navigate: (path: string) => void,
  location: { pathname: string }
) => {
  const {
    selectedResultIndex,
    setSelectedResultIndex,
    setInstallState,
    searchResults,
    setCopyingToClipboard,
    setConfirmationPending,
  } = appContext

  debugLog({
    modifier,
    key,
  })

  if (key === 'c' && appContext.installState.shouldOpenBrowser) {
    setCopyingToClipboard(true)
    return
  }

  if (location.pathname.includes('/install-confirm')) {
    if (key === 'y') {
      setConfirmationPending(false)
      navigate('/search')
      return
    }
    if (key === 'n') {
      setConfirmationPending(true)
      navigate('/search')
      setSelectedResultIndex(-1)
      setInstallState((prev) => ({
        ...prev,
        componentToInstall: null,
        installingComponent: null,
      }))
      return
    }
    return
  }

  if (modifier.escape) {
    if (location.pathname.includes('/install-confirm')) {
      navigate('/search')
      return
    }
    appContext.exitApp()
    return
  }

  if (
    appContext.installState.installingComponent &&
    (modifier.upArrow || modifier.downArrow)
  )
    return

  if (modifier.upArrow) {
    selectedResultIndex > -1 && setSelectedResultIndex(selectedResultIndex - 1)
    return
  }

  if (modifier.downArrow) {
    selectedResultIndex < appContext.searchResults.length - 1 &&
      setSelectedResultIndex(selectedResultIndex + 1)
    return
  }

  if (modifier.return) {
    if (location.pathname.includes('/search')) {
      setInstallState((prev) => ({
        ...prev,
        installingComponent: searchResults[selectedResultIndex]?.item,
      }))

      const fileName = searchResults?.[selectedResultIndex]?.item.fileName

      if (!fileName) {
        console.error('No component found')
        return
      }

      debugLog('Installing component', searchResults[selectedResultIndex]?.item)
      navigate(`/install-confirm/${fileName}`)
      return
    }
  }
}
