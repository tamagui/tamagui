import { Alert, Spinner, TextInput } from '@inkjs/ui'
import { Box, Text } from 'ink'
import React from 'react'

import { AppContext } from '../data/AppContext.js'
import { debugLog } from '../commands/index.js'

export const CodeAuthScreen = () => {
  const appContext = React.useContext(AppContext)

  React.useEffect(() => {
    appContext.setInstallState((prev) => ({
      ...prev,
      shouldOpenBrowser: true,
    }))
    return () => {
      appContext.setCopyingToClipboard(false)
    }
  }, [])

  React.useEffect(() => {
    const unsubscribe = appContext.tokenStore.onDidChange('token', () => {
      appContext.setInstallState((prev) => ({
        ...prev,
        isTokenInstalled: true,
      }))
    })

    return () => {
      unsubscribe()
    }
  }, [appContext.tokenStore, appContext.setInstallState])

  const [accessToken, setAccessToken] = React.useState('')

  return (
    <Box flexDirection="column" display="flex">
      <Box justifyContent="space-between" paddingRight={1}>
        <Text>
          {' < '}
          <Text underline>ESC</Text> to go Back
        </Text>

        {appContext.isCopyingToClipboard ? (
          <Text color="green">copied!</Text>
        ) : (
          <Text>
            Hit <Text underline>c</Text> to copy to clipboard
          </Text>
        )}
      </Box>
      <Alert variant="info">
        Press <Text underline>o</Text> to open browser window and get your access token
        from your Tamagui account.
      </Alert>
      <Box flexDirection="row" borderStyle="round" paddingY={1} justifyContent="center">
        {appContext.installState.isTokenInstalled ? (
          <Box paddingY={1}>
            <Text color="green">
              Authentication Successful. Press <Text underline>ESC</Text> to go back ✔︎
            </Text>
          </Box>
        ) : (
          <Box flexDirection="column" gap={1} paddingX={2}>
            <Alert variant="info">Your are trying to install a Pro component.</Alert>
            <Text>Paste/Enter your Bento access token:</Text>
            <Box minHeight={10}>
              <TextInput
                defaultValue={accessToken}
                onChange={(value) => setAccessToken(value)}
                onSubmit={() => {
                  debugLog('accessToken', accessToken)
                  appContext.setInstallState((prev) => ({
                    ...prev,
                    accessToken,
                  }))
                  debugLog('installState', appContext.installState)
                }}
              />
            </Box>
            <Text color={'magenta'}>
              (Press <Text underline>o</Text> to retrieve your access token from
              tamagui.dev)
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
