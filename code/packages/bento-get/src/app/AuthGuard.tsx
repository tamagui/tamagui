import React, { useContext } from 'react'
import { Alert } from '@inkjs/ui'
import { Box } from 'ink'
import { useLocation, useNavigate } from 'react-router-dom'

import { AppContext } from '../data/AppContext.js'
import { useInstallComponent } from '../hooks/useInstallComponent.js'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const appContext = useContext(AppContext)
  const { access_token } = appContext.tokenStore.get('token') || {}
  const navigate = useNavigate()
  const location = useLocation()

  React.useEffect(() => {
    if (!access_token) {
      navigate('/auth')
    }
  }, [access_token, location.pathname])

  const { error } = useInstallComponent()

  if (error) {
    if (error.status === 401) {
      navigate('/auth')
      return
    }

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
