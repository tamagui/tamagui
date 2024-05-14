// @ts-nocheck
import React, { useState, useContext, createContext, useEffect } from 'react'
import { Text, Box, useInput, Spacer, useApp } from 'ink'
import { Alert, Spinner, Badge } from '@inkjs/ui'
import TextInput from 'ink-text-input'
import Fuse from 'fuse.js'
import Link from 'ink-link'
import { useGetComponent } from '../hooks/useGetComponent.js'
import { componentsList } from '../components.js'
import { useGithubAuth } from '../hooks/useGithubAuth.js'
import { internalMutate } from 'swr/_internal'
import open from 'open'
import fetch from 'node-fetch'
import { useGithubAuthPooling } from '../hooks/useGithubAuthPooling.js'
import { copy } from 'copy-paste'
import Conf from 'conf'
import { mkdirSync, existsSync, promises as fs } from 'node:fs'
import path from 'node:path'

const tokenStore = new Conf({ projectName: 'bento-cli' })

const handleKeypress = (_, key, appContext) => {
  const {
    selectedId,
    setSelectedId,
    setInstall,
    results,
    copyToClipboard,
    setCopyToClipboard,
  } = appContext

  if (_ === 'c' && appContext.install.installingComponent) {
    setCopyToClipboard(true)
  }

  if (key.escape && !appContext.install.installingComponent?.isOSS) {
    appContext.setInstall((prev) => ({
      ...prev,
      installingComponent: null,
      enterToOpenBrowser: false,
    }))
    return
  }
  if (
    key.return &&
    !appContext.install.installingComponent?.isOSS &&
    appContext.install.enterToOpenBrowser
  ) {
    open('https://github.com/login/device')
  }
  if (appContext.install.installingComponent?.isOSS) return
  if (!key) return
  if (key.escape) {
    appContext.exit()
  }
  if (key.upArrow) {
    selectedId > -1 && setSelectedId(selectedId - 1)
  }
  if (key.downArrow) {
    selectedId < appContext.results.length - 1 && setSelectedId(selectedId + 1)
  }
  if (key.return) {
    setInstall((prev) => ({
      ...prev,
      installingComponent: results[selectedId]?.item,
    }))
  }
}

export const AppContext = createContext({
  tokenStore: {},
  copyToClipboard: false,
  setCopyToClipboard: () => {},
  results: [],
  setResults: () => {},
  selectedId: -1,
  setSelectedId: () => {},
  input: '',
  setInput: () => {},
  setInstallcomponent: () => {},
  install: null,
})

const SearchBar = () => {
  const appContext = useContext(AppContext)
  const search = (query) => {
    const fuse = new Fuse(componentsList, {
      keys: ['name', 'category', 'categorySection'],
    })
    return fuse.search(query)
  }
  const handleChange = (value) => {
    if (appContext.install.installingComponent?.isOSS) return
    appContext.setInput(value)
    const results = search(value)
    appContext.setResults(results)
    appContext.setSelectedId(-1)
  }
  return (
    <Box marginX={1} justifyContent="space-between">
      <Box>
        <Text bold>Search: </Text>
        <TextInput
          value={appContext.input}
          onChange={handleChange}
          marginRight={'auto'}
        />
      </Box>
      <ResultsCounter />
    </Box>
  )
}

const ResultsContainer = () => {
  const appContext = useContext(AppContext)
  return (
    <Box flexDirection="column" display={appContext.results.length ? 'flex' : 'none'}>
      <Box flexDirection="column" borderStyle="round" paddingX={1} gap={1}>
        {appContext.results.map((result, i) => (
          <ResultCard
            result={result}
            key={result.item.fileName}
            isSelected={appContext.selectedId === i}
          />
        ))}
      </Box>
      <Footer />
    </Box>
  )
}

const Footer = () => {
  return (
    <Box flexDirection="row" justifyContent="flex-end" marginRight={1}>
      <Text>
        <Text underline>ESC</Text> to exit
      </Text>
    </Box>
  )
}

const InstalledBadge = ({ item }) => {
  const appContext = useContext(AppContext)
  const componentIsInstalled = appContext.install?.installedComponents
    ?.map((component) => component.fileName)
    .includes(item.fileName)

  if (!appContext.install?.installedComponents) return null
  return (
    componentIsInstalled && (
      <Box marginLeft={1}>
        <Badge color="green">Installed</Badge>
      </Box>
    )
  )
}

const ResultCard = ({ result, isSelected }) => {
  const appContext = useContext(AppContext)
  return (
    <Box flexDirection="row" minWidth={'100%'}>
      <Box flexDirection="row">
        <Text textWrap="nowrap" bold style={{ textWrap: 'nowrap' }} color="gray">
          {(() => {
            switch (true) {
              case appContext.install.installingComponent && isSelected:
                return ''
              case appContext.install.installingComponent:
                return '  '
              case isSelected:
                return '❯ '
              default:
                return '  '
            }
          })()}
        </Text>
        {appContext.install.installingComponent && isSelected && <InstallComponent />}
        <Text bold style={{ textWrap: 'nowrap' }} color={isSelected ? 'white' : 'black'}>
          {result.item?.name}
        </Text>
        <InstalledBadge item={result.item} />
      </Box>
      <Spacer />
      <TypeOfComponentAccess item={result.item} />
      <CategorySectionBadge item={result.item} />
    </Box>
  )
}

const CategorySectionBadge = ({ item }) => {
  const appContext = useContext(AppContext)
  return (
    <Box marginLeft={1} gap={1}>
      <Text color={'black'} backgroundColor={'white'}>
        {' '}
        {item?.category.charAt(0).toUpperCase() + item?.category.slice(1)} {'>'}{' '}
        {item?.categorySection.charAt(0).toUpperCase() +
          item?.categorySection.slice(1)}{' '}
      </Text>
    </Box>
  )
}
const TypeOfComponentAccess = ({ item }) => {
  const appContext = useContext(AppContext)
  return (
    <Box marginLeft={1} gap={1} display={item?.isOSS ? 'flex' : 'none'}>
      <Text color={'black'} backgroundColor={'gray'}>
        OSS
      </Text>
    </Box>
  )
}

const ResultsCounter = () => {
  const appContext = useContext(AppContext)
  return (
    <Box>
      {!!appContext.results.length && (
        <Text bold color="gray">
          {appContext.results.length} result
          {appContext.results.length > 1 ? 's' : ''}
        </Text>
      )}
    </Box>
  )
}

const InstallComponent = () => {
  const appContext = useContext(AppContext)
  return (
    <Box>
      {appContext.install.installingComponent ? (
        <Box>
          <Spinner label="Installing " />
        </Box>
      ) : (
        <Box marginRight={2} />
      )}
    </Box>
  )
}

const UsageBanner = () => {
  return (
    <Alert variant="info">
      Search any component by category, section or name. <Text underline>Up</Text> and{' '}
      <Text underline>down</Text> arrows to select. <Text underline>Enter</Text> to
      install.
    </Alert>
  )
}

const CodeAuthScreen = () => {
  const appContext = useContext(AppContext)
  const { data, isLoading } = useGithubAuth()

  useEffect(() => {
    appContext.setInstall((prev) => ({
      ...prev,
      enterToOpenBrowser: true,
    }))
    return () => {
      appContext.setCopyToClipboard(false)
    }
  }, [])

  // const [tokenIsInstalled, setTokenIsInstalled] = useState(false);

  // useEffect(() => {
  // 	if (appContext.install.tokenIsInstalled) {
  // 	}
  // }, [tokenIsInstalled]);

  appContext.tokenStore.onDidChange('token', (newvalue, oldvalue) => {
    appContext.setInstall((prev) => ({
      ...prev,
      tokenIsInstalled: true,
    }))
  })

  if (appContext.copyToClipboard) copy(data?.user_code)

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

        {appContext.copyToClipboard ? (
          <Text color="green">copied!</Text>
        ) : (
          <Text>
            Hit <Text underline>c</Text> to copy to clipboard
          </Text>
        )}
      </Box>
      <Box flexDirection="row" borderStyle="round" paddingY={1} justifyContent="center">
        {appContext.install.tokenIsInstalled ? (
          <Box paddingY={1}>
            <Text color="green">Github Authentication Successful ✔︎</Text>
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
              <Text width={5}>{item}</Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
export default function Search() {
  const [results, setResults] = useState([])
  const [selectedId, setSelectedId] = useState(-1)
  const [input, setInput] = useState('')
  const [install, setInstall] = useState({
    installingComponent: null,
    installedComponents: [],
    enterToOpenBrowser: false,
    tokenIsInstalled: false,
  })
  const [copyToClipboard, setCopyToClipboard] = useState(false)
  const { exit } = useApp()
  const { access_token } = tokenStore.get('token') ?? {}
  // tokenStore.delete("token");

  useInput((_, key) =>
    handleKeypress(_, key, {
      tokenStore,
      copyToClipboard,
      setCopyToClipboard,
      exit,
      results,
      setResults,
      selectedId,
      setSelectedId,
      input,
      setInput,
      setInstall,
      install,
    })
  )

  // useEffect(() => {
  // if (appContext.install.tokenIsInstalled) {
  // 	appContext.setInstall((prev) => ({
  // 		...prev,
  // 		enterToOpenBrowser: true,
  // 	}));
  // }
  // setTimeout(() => {
  // 	setInstall((prev) => ({
  // 		installingComponent: null,
  // 		installedComponents: [
  // 			...prev.installedComponents,
  // 			install.installingComponent,
  // 		],
  // 	}));
  // }, 3000);

  return (
    <AppContext.Provider
      value={{
        tokenStore,
        copyToClipboard,
        setCopyToClipboard,
        results,
        setResults,
        selectedId,
        setSelectedId,
        input,
        setInput,
        install,
        setInstall,
      }}
    >
      <Box flexDirection="column">
        {(install.installingComponent?.isOSS ?? true) || access_token ? (
          <Box flexDirection="column">
            <UsageBanner />
            <SearchBar />
            <ResultsContainer />
          </Box>
        ) : (
          <Box flexDirection="column">
            <CodeAuthScreen />
          </Box>
        )}
      </Box>
    </AppContext.Provider>
  )
}
