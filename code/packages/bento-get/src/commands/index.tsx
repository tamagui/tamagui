import React from 'react'
import { Alert, Badge, Spinner } from '@inkjs/ui'
import Conf from 'conf'
import { copy } from 'copy-paste'
import Fuse from 'fuse.js'
import { Box, Spacer, Text, useApp, useInput } from 'ink'
import TextInput from 'ink-text-input'
import open from 'open'

import { componentsList } from '../components.js'
import type { ComponentSchema } from '../components.js'
import { useGithubAuth } from '../hooks/useGithubAuth.js'
import { useInstallComponent } from '../hooks/useInstallComponent.js'

export interface InstallState {
  installingComponent: ComponentSchema | null | undefined
  installedComponents: ComponentSchema[]
  enterToOpenBrowser: boolean
  tokenIsInstalled: boolean
}

interface AppContextType {
  tokenStore: Conf<any>
  copyToClipboard: boolean
  setCopyToClipboard: React.Dispatch<React.SetStateAction<boolean>>
  results: Array<{ item: ComponentSchema }>
  setResults: React.Dispatch<React.SetStateAction<Array<{ item: ComponentSchema }>>>
  selectedId: number
  setSelectedId: React.Dispatch<React.SetStateAction<number>>
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  setInstall: React.Dispatch<React.SetStateAction<InstallState>>
  setInstallcomponent: React.Dispatch<React.SetStateAction<ComponentSchema>>

  install: InstallState
  exit: () => void
}

const tokenStore = new Conf({ projectName: 'bento-cli' })

const handleKeypress = (key: string, modifier: any, appContext: AppContextType) => {
  const { selectedId, setSelectedId, setInstall, results, setCopyToClipboard } =
    appContext

  if (modifier.shift + key === 'l') {
    tokenStore.clear()
    return
  }

  if (key === 'c' && appContext.install.enterToOpenBrowser) {
    setCopyToClipboard(true)
    return
  }

  // after token addition on pressing esc go back to previous screen
  if (modifier.escape && appContext.install.tokenIsInstalled) {
    appContext.setInstall((prev) => ({
      ...prev,
      installingComponent: null,
      tokenIsInstalled: false,
    }))
    return
  }

  if (
    modifier.escape &&
    appContext.install.installingComponent !== null &&
    !appContext.install.installingComponent?.isOSS
  ) {
    appContext.setInstall((prev) => ({
      ...prev,
      installingComponent: null,
      enterToOpenBrowser: false,
    }))
    return
  }

  if (modifier.escape) {
    appContext.exit()
    return
  }

  if (appContext.install.installingComponent && (modifier.upArrow || modifier.downArrow))
    return

  if (
    modifier.return &&
    !appContext.install.installingComponent?.isOSS &&
    appContext.install.enterToOpenBrowser
  ) {
    open('https://github.com/login/device')
    return
  }

  if (appContext.install.installingComponent?.isOSS) {
    return
  }

  if (modifier.upArrow) {
    selectedId > -1 && setSelectedId(selectedId - 1)
    return
  }

  if (modifier.downArrow) {
    selectedId < appContext.results.length - 1 && setSelectedId(selectedId + 1)
    return
  }

  if (modifier.return) {
    setInstall((prev) => ({
      ...prev,
      installingComponent: results[selectedId]?.item,
    }))
    return
  }
}

// TODO type this properly!
export const AppContext = React.createContext<AppContextType>({
  tokenStore: {} as typeof tokenStore,
  copyToClipboard: false,
  setCopyToClipboard: () => {},
  results: [],
  setResults: () => {},
  selectedId: -1,
  setSelectedId: () => {},
  input: '',
  setInput: () => {},
  setInstall: () => {},
  setInstallcomponent: () => {},
  install: {
    installingComponent: null,
    installedComponents: [],
    enterToOpenBrowser: false,
    tokenIsInstalled: false,
  },
  exit: () => {},
})

const SearchBar = () => {
  const appContext = React.useContext(AppContext)
  const search = (query: string) => {
    const fuse = new Fuse(componentsList, {
      keys: ['name', 'category', 'categorySection'],
    })
    return fuse.search(query)
  }
  const handleChange = (value: string) => {
    if ((appContext.install as any).installingComponent?.isOSS) return
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
          // @ts-ignore
          marginRight={'auto'}
        />
      </Box>
      <ResultsCounter />
    </Box>
  )
}

const ResultsContainer = () => {
  const appContext = React.useContext(AppContext)
  return (
    <Box flexDirection="column" display={appContext.results.length ? 'flex' : 'none'}>
      <Box flexDirection="column" borderStyle="round" paddingX={1} gap={1}>
        {appContext.results.slice(0, 5).map((result, i) => (
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

const InstalledBadge = ({ item }: { item: ComponentSchema }) => {
  const appContext = React.useContext(AppContext)
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

const ResultCard = ({
  result,
  isSelected,
}: {
  result: { item: ComponentSchema }
  isSelected: boolean
}) => {
  const appContext = React.useContext(AppContext)
  return (
    <Box flexDirection="row" minWidth={'100%'}>
      <Box flexDirection="row">
        <Text bold color="gray">
          {(() => {
            switch (true) {
              case appContext.install.installingComponent && isSelected:
                return ''
              case Boolean(appContext.install.installingComponent):
                return '  '
              case isSelected:
                return '❯ '
              default:
                return '  '
            }
          })()}
        </Text>
        {appContext.install.installingComponent && isSelected && <InstallComponent />}
        <Text bold color={isSelected ? 'white' : 'black'}>
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

const CategorySectionBadge = ({ item }: { item: ComponentSchema }) => {
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
const TypeOfComponentAccess = ({ item }: { item: ComponentSchema }) => {
  return (
    <Box marginLeft={1} gap={1} display={item?.isOSS ? 'flex' : 'none'}>
      <Text color={'black'} backgroundColor={'gray'}>
        OSS
      </Text>
    </Box>
  )
}

const ResultsCounter = () => {
  const appContext = React.useContext(AppContext)
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
  const appContext = React.useContext(AppContext)
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
  const appContext = React.useContext(AppContext)
  const { data, isLoading } = useGithubAuth()

  React.useEffect(() => {
    appContext.setInstall((prev) => ({
      ...prev,
      enterToOpenBrowser: true,
    }))
    return () => {
      appContext.setCopyToClipboard(false)
    }
  }, [])

  appContext.tokenStore.onDidChange('token', () => {
    appContext.setInstall((prev) => ({
      ...prev,
      tokenIsInstalled: true,
    }))
  })

  React.useEffect(() => {
    if (appContext.copyToClipboard) {
      copy(data?.user_code)
      console.warn(`Copied to clipboard`)
    }
  }, [appContext.copyToClipboard])

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

export default function Search() {
  const [results, setResults] = React.useState<Array<{ item: ComponentSchema }>>([])
  const [selectedId, setSelectedId] = React.useState(-1)
  const [input, setInput] = React.useState('')
  const [install, setInstall] = React.useState<InstallState>({
    installingComponent: null,
    installedComponents: [],
    enterToOpenBrowser: false,
    tokenIsInstalled: false,
  })
  const [copyToClipboard, setCopyToClipboard] = React.useState(false)
  const { exit } = useApp()

  useInput((input, key) =>
    handleKeypress(input, key, {
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
      setInstallcomponent: () => {}, // Add this line
    })
  )

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
        setInstallcomponent: () => {},
        exit: () => {},
      }}
    >
      <Provider>
        <Box flexDirection="column">
          <Box flexDirection="column">
            <UsageBanner />
            <SearchBar />
            <ResultsContainer />
          </Box>
        </Box>
      </Provider>
    </AppContext.Provider>
  )
}

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { error } = useInstallComponent()

  if (error) {
    if (error.status === 401) {
      return (
        <Box flexDirection="column">
          <CodeAuthScreen />
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        <Alert variant="error">Error installing component: {JSON.stringify(error)}</Alert>
        {children}
      </Box>
    )
  }

  return <>{children}</>
}
