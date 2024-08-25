import { Alert } from '@inkjs/ui'
import { Box } from 'ink'
import { useNavigate } from 'react-router-dom'
import { useInstallComponent } from '../hooks/useInstallComponent.js'
import { debugLog } from '../commands/index.js'
import { useEffect } from 'react'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { error } = useInstallComponent()

  useEffect(() => {
    debugLog({
      errorStatus: error?.status,
      useInstallComponentError: error,
    })

    if (error && error.status === 401) {
      navigate('/auth')
    }
  }, [error, navigate])

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
