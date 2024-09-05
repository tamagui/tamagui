import { Alert, Spinner } from '@inkjs/ui'
import { copy } from 'copy-paste'
import { Box, Text } from 'ink'
import React from 'react'

import { useGithubAuth } from '../hooks/useGithubAuth.js'
import { AppContext } from '../data/AppContext.js'

export const CodeAuthScreen = () => {
  const { data, isLoading } = useGithubAuth()
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

  React.useEffect(() => {
    if (appContext.isCopyingToClipboard) {
      copy(data?.user_code)
      console.warn(`Copied to clipboard`)
    }
  }, [appContext.isCopyingToClipboard])

  return (
    <Box flexDirection="column" display="flex">
      <Alert variant="info">
        Press <Text underline>Enter</Text> to open browser window and authenticate to your
        Github account with the following auth code.
      </Alert>
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
      <Box flexDirection="row" borderStyle="round" paddingY={1} justifyContent="center">
        {appContext.installState.isTokenInstalled ? (
          <Box paddingY={1}>
            <Text color="green">
              Github Authentication Successful. Press <Text underline>ESC</Text> to go
              back ✔︎
            </Text>
          </Box>
        ) : isLoading ? (
          <Box paddingY={1}>
            <Spinner label="Loading..." />
          </Box>
        ) : (
          data?.user_code?.split('')?.map((item, key) => (
            <Box
              key={key}
              flexDirection="column"
              {...(item !== '-' && { borderStyle: 'round' })}
              paddingX={1}
              gap={1}
              width={item !== '-' ? 5 : 3}
              height={3}
              alignItems="center"
              justifyContent="center"
            >
              <Text>{item}</Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
