// @ts-ignore
import { Alert } from '@inkjs/ui'
import { Box, Text } from 'ink'
import React, { useContext, useState } from 'react'
import TextInput from 'ink-text-input'

import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { debugLog } from '../commands/index.js'
import { AppContext } from '../data/AppContext.js'
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '../constants.js'
import Spinner from 'ink-spinner'

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

export const CodeAuthScreen = () => {
  const appContext = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()
  const { fileName } = useParams()
  const [localAccessToken, setLocalAccessToken] = useState(appContext.accessToken)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = async (value: string) => {
    debugLog('----\nauth input change ----\n', {
      value,
      at: appContext.accessToken,
    })

    if (!location.pathname.includes('/auth/')) return

    try {
      setLoading(true)

      if (error) setError(null)

      // verify token
      const { error: errorData } = await supabase.auth.getUser(value)
      if (errorData) {
        setError(errorData?.message)
        return
      }

      appContext.setAccessToken(value)
      appContext.setIsLoggedIn(true)
      appContext.tokenStore.set('accessToken', value)
      appContext.tokenStore.onDidChange('accessToken', (newValue) => {
        debugLog('tokenStore changed', newValue)
      })
      debugLog('navigating to install-confirm', { fileName })
      navigate(`/install-confirm/${fileName}`)
    } catch (error) {
      // /
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box flexDirection="column" display="flex">
      <Box justifyContent="space-between" paddingRight={1}>
        <Text>
          {' < '}
          <Text underline>ESC</Text> to go Back
        </Text>
      </Box>
      <Box flexDirection="row" borderStyle="round" paddingY={1} justifyContent="center">
        {appContext.installState.isTokenInstalled ? (
          <Box paddingY={1}>
            <Text color="green">
              Authentication Successful. Press <Text underline>ESC</Text> to go back ✔︎
            </Text>
          </Box>
        ) : (
          <Box w="50%" flexDirection="column" gap={1} paddingX={2}>
            <Alert variant="info">
              Your are trying to install a Pro component. ({fileName})
            </Alert>
            <Text>Paste/Enter your Bento access token:</Text>

            {error && (
              <Text fontFamily="monospace" fontWeight="bold" color="red">
                {error}
              </Text>
            )}

            <Box minHeight={10}>
              {!loading ? (
                <TextInput
                  focus
                  placeholder={Array(10).fill('*').join('')}
                  value={localAccessToken ?? ''}
                  onChange={(value) => {
                    setLocalAccessToken(value)
                  }}
                  onSubmit={handleInputChange}
                />
              ) : (
                <Text color="yellow">
                  <Spinner type="dots" /> Verifying token...
                </Text>
              )}
            </Box>

            <Text color={'magenta'}>
              Retrieve your access token from https://tamagui.dev/account
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
