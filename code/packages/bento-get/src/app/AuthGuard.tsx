import React from 'react'
import { Alert } from '@inkjs/ui'
import { Box } from 'ink'
import { useInstallComponent } from '../hooks/useInstallComponent.js'
import { debugLog } from '../commands/index.js'
import { AppContext } from '../data/AppContext.js'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { error } = useInstallComponent()
  const { tokenStore, setAccessToken, setIsLoggedIn } = React.useContext(AppContext)

  React.useEffect(() => {
    // On initial boot set the token if we have one
    const token = tokenStore.get('accessToken')
    if (token) {
      setAccessToken(token)
      setIsLoggedIn(true)
      debugLog('Token found, setting isLoggedIn to true')
      debugLog({ token })
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  React.useEffect(() => {
    debugLog({
      errorStatus: error?.status,
      useInstallComponentError: error,
    })
  }, [error])

  if (error && error.status !== 401) {
    return (
      <Box flexDirection="column">
        <Alert variant="error">
          Error installing component: {JSON.stringify(error, null, 2)}
        </Alert>
        {children}
      </Box>
    )
  }

  return <>{children}</>
}
