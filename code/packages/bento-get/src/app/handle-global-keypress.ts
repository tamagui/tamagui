// Handle keypress events for the CLI
import open from 'open'
import { debugLog } from '../commands/index.js'

import type { AppContextType } from '../data/AppContext.js'

const apiBase = process.env.API_BASE || 'https://tamagui.dev'
const ACCESS_TOKEN_URL = `${apiBase}/account/items`

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

  if (modifier.ctrl && key === 'd') {
    appContext.tokenStore.clear()
    appContext.setAccessToken(null)
    appContext.setIsLoggedIn(false)
    console.warn('Cleared Auth Token')
    return navigate('/')
  }

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

  if (modifier.escape && location.pathname.includes('/auth')) {
    return navigate('/search')
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

  if (
    modifier.ctrl &&
    modifier.return &&
    !appContext.installState.installingComponent?.isOSS &&
    appContext.installState.shouldOpenBrowser &&
    location.pathname.includes('/auth')
  ) {
    return open(ACCESS_TOKEN_URL)
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
    if (location.pathname.includes('/search')) {
      setInstallState((prev) => ({
        ...prev,
        installingComponent: searchResults[selectedResultIndex]?.item,
      }))
      debugLog('Installing component', searchResults[selectedResultIndex]?.item)
      navigate(`/install-confirm/${searchResults[selectedResultIndex]?.item.fileName}`)
      return
    }
  }
}
