import { Alert } from '@inkjs/ui'
import { Box } from 'ink'
import { useNavigate } from 'react-router-dom'
import { useInstallComponent } from '../hooks/useInstallComponent.js'
import { debugLog } from '../commands/index.js'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const { error } = useInstallComponent()
  debugLog({
    useInstallComponentError: error,
  })

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
