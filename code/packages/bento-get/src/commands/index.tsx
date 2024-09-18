import React from 'react'
import { useApp, useInput } from 'ink'
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { AuthGuard } from '../app/AuthGuard.js'
import type { ComponentSchema } from '../components.js'
import type { InstallState } from '../data/AppContext.js'
import { AppContext, tokenStore } from '../data/AppContext.js'
import { CodeAuthScreen } from '../screens/CodeAuthScreen.js'
import { InstallConfirmScreen } from '../screens/InstallConfirmScreen.js'
import { SearchScreen } from '../screens/SearchScreen.js'

import { handleGlobalKeyPress } from '../app/handle-global-keypress.js'

// Wrapper function for conditional logging
export const debugLog = (...args: any[]) => {
  // biome-ignore lint/suspicious/noConsoleLog: This is a debug logging function
  if (process.env.DEBUG === 'true') console.log(...args)
}

function BentoGet() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<
    Array<{ item: ComponentSchema }>
  >([])
  const [selectedResultIndex, setSelectedResultIndex] = React.useState(-1)
  const [searchInput, setSearchInput] = React.useState('')
  const [confirmationPending, setConfirmationPending] = React.useState(true)
  const [installState, setInstallState] = React.useState<InstallState>({
    installingComponent: null,
    installedComponents: [],
    shouldOpenBrowser: false,
    isTokenInstalled: false,
    componentToInstall: null,
  })
  const [isCopyingToClipboard, setCopyingToClipboard] = React.useState(false)
  const { exit } = useApp()

  const [accessToken, setAccessToken] = React.useState<string | null>(null)

  const appContextValues = React.useMemo(
    () => ({
      tokenStore,
      isCopyingToClipboard,
      setCopyingToClipboard,
      exitApp: exit,
      searchResults,
      setSearchResults,
      selectedResultIndex,
      setSelectedResultIndex,
      searchInput,
      setSearchInput,
      setInstallState,
      installState,
      confirmationPending,
      setConfirmationPending,
      isLoggedIn,
      setIsLoggedIn,
      accessToken,
      setAccessToken,
    }),
    [
      isCopyingToClipboard,
      searchResults,
      selectedResultIndex,
      searchInput,
      installState,
      confirmationPending,
      accessToken,
    ]
  )

  useInput((input, key) =>
    handleGlobalKeyPress(input, key, appContextValues, navigate, location)
  )

  return (
    <AppContext.Provider value={appContextValues}>
      <AuthGuard>
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/install-confirm" element={<InstallConfirmScreen />} />
          <Route path="/auth" element={<CodeAuthScreen />} />
        </Routes>
      </AuthGuard>
    </AppContext.Provider>
  )
}

export default function App() {
  return (
    <MemoryRouter>
      <BentoGet />
    </MemoryRouter>
  )
}
