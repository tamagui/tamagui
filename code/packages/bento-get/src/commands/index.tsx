import React from 'react'
import { Box, useApp, useInput, Text } from 'ink'
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import type { ComponentSchema } from '../components.js'
import type { AppContextType, FetchState, InstallState } from '../data/AppContext.js'
import { AppContext } from '../data/AppContext.js'
import { InstallConfirmScreen } from '../screens/InstallConfirmScreen.js'
import { SearchScreen } from '../screens/SearchScreen.js'

import { handleGlobalKeyPress } from '../app/handle-global-keypress.js'

// wrapper function for conditional logging
export const debugLog = (...args: any[]) => {
  if (process.env.DEBUG === 'true') console.log(...args)
}

function BentoGet() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchResults, setSearchResults] = React.useState<
    Array<{ item: ComponentSchema }>
  >([])
  const [selectedResultIndex, setSelectedResultIndex] = React.useState(-1)
  const [searchInput, setSearchInput] = React.useState('')
  const [confirmationPending, setConfirmationPending] = React.useState(true)
  const [fetchState, setFetchState] = React.useState<FetchState>({
    status: 'idle',
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
    error: undefined,
    statusCode: undefined,
  })
  const [installState, setInstallState] = React.useState<InstallState>({
    installingComponent: null,
    installedComponents: [],
    shouldOpenBrowser: false,
    componentToInstall: null,
  })
  const [isCopyingToClipboard, setCopyingToClipboard] = React.useState(false)
  const { exit } = useApp()

  const appContextValues: AppContextType = React.useMemo(
    () => ({
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
      fetchState,
      setFetchState,
    }),
    [
      isCopyingToClipboard,
      searchResults,
      selectedResultIndex,
      searchInput,
      installState,
      confirmationPending,
      fetchState,
    ]
  )

  useInput((input, key) =>
    handleGlobalKeyPress(input, key, appContextValues, navigate, location)
  )

  return (
    <AppContext.Provider value={appContextValues}>
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/install-confirm/:fileName" element={<InstallConfirmScreen />} />
      </Routes>
      {process.env.DEBUG && (
        <Box borderStyle="round" borderColor="" padding={1}>
          <Text>Current Route: {location.pathname}</Text>
        </Box>
      )}
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
