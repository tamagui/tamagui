// Handle keypress events for the CLI
import open from 'open'
import { debugLog } from '../commands/index.js'

import type { AppContextType } from '../data/AppContext.js'
import { tokenStore } from '../data/AppContext.js'

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

  if (modifier.control && key === 'd') {
    tokenStore.clear()
    console.warn('Cleared Github Token')
    return
  }

  if (key === 'c' && appContext.installState.shouldOpenBrowser) {
    setCopyingToClipboard(true)
    return
  }

  if (location.pathname === '/install-confirm') {
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

  // After token addition, go back to the previous screen on pressing ESC
  if (modifier.escape && appContext.installState.isTokenInstalled) {
    appContext.setInstallState((prev) => ({
      ...prev,
      installingComponent: null,
      isTokenInstalled: false,
    }))
    return navigate('/search')
  }

  if (
    modifier.escape &&
    appContext.installState.installingComponent !== null &&
    !appContext.installState.installingComponent?.isOSS
  ) {
    appContext.setInstallState((prev) => ({
      ...prev,
      installingComponent: null,
      shouldOpenBrowser: false,
    }))
    return
  }

  if (modifier.escape) {
    if (location.pathname === '/install-confirm') {
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

  if (
    modifier.return &&
    !appContext.installState.installingComponent?.isOSS &&
    appContext.installState.shouldOpenBrowser
  ) {
    open('https://github.com/login/device')
    return
  }

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
    setInstallState((prev) => ({
      ...prev,
      installingComponent: searchResults[selectedResultIndex]?.item,
    }))
    debugLog('Installing component', searchResults[selectedResultIndex]?.item)
    navigate('/install-confirm')
    return
  }
}
