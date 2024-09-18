import React from 'react'
import Conf from 'conf'
import type { ComponentSchema } from '../components.js'

export interface FetchState {
  status: 'idle' | 'loading' | 'success' | 'error'
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  data?: any
  error?: Error
  statusCode?: number
}

export interface TokenStorageState {
  hasToken: boolean
  token: string | null
}

// Define the state for the installation process
export interface InstallState {
  installingComponent: ComponentSchema | null | undefined
  installedComponents: ComponentSchema[]
  shouldOpenBrowser: boolean
  isTokenInstalled: boolean
  componentToInstall: {
    name: string
    path: string
  } | null
}

// Define the context type for the application
export interface AppContextType {
  tokenStore: Conf<any>
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  accessToken: string | null
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
  isCopyingToClipboard: boolean
  setCopyingToClipboard: React.Dispatch<React.SetStateAction<boolean>>
  searchResults: Array<{ item: ComponentSchema }>
  setSearchResults: React.Dispatch<React.SetStateAction<Array<{ item: ComponentSchema }>>>
  selectedResultIndex: number
  setSelectedResultIndex: React.Dispatch<React.SetStateAction<number>>
  searchInput: string
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
  setInstallState: React.Dispatch<React.SetStateAction<InstallState>>
  installState: InstallState
  exitApp: () => void
  confirmationPending: boolean
  setConfirmationPending: React.Dispatch<React.SetStateAction<boolean>>
  fetchState: FetchState
  setFetchState: React.Dispatch<React.SetStateAction<FetchState>>
}

const schema = {
  accessToken: {
    type: 'string',
    minLength: 1024,
    maxLength: 1536,
  },
}

const tokenStore = new Conf({ projectName: 'bento-cli/v3.0', schema })

// Create the AppContext with default values
export const AppContext = React.createContext<AppContextType>({
  tokenStore: tokenStore,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  accessToken: '',
  setAccessToken: () => {},
  isCopyingToClipboard: false,
  setCopyingToClipboard: () => {},
  searchResults: [],
  setSearchResults: () => {},
  selectedResultIndex: -1,
  setSelectedResultIndex: () => {},
  searchInput: '',
  setSearchInput: () => {},
  setInstallState: () => {},
  installState: {
    installingComponent: null,
    installedComponents: [],
    shouldOpenBrowser: false,
    isTokenInstalled: false,
    componentToInstall: null,
  },
  exitApp: () => {},
  confirmationPending: false,
  setConfirmationPending: () => {},
  fetchState: {
    status: 'idle',
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
    error: undefined,
    statusCode: undefined,
  },
  setFetchState: () => {},
})
