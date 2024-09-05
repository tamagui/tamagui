import { Alert, Badge, Spinner } from '@inkjs/ui'
import { Box, Spacer, Text } from 'ink'
import React from 'react'
import { AppContext } from '../data/AppContext.js'
import type { ComponentSchema } from '../components.js'

export const ResultsContainer = () => {
  const appContext = React.useContext(AppContext)
  return (
    <Box
      flexDirection="column"
      display={appContext.searchResults.length ? 'flex' : 'none'}
    >
      <Box flexDirection="column" borderStyle="round" paddingX={1} gap={1}>
        {appContext.searchResults.slice(0, 5).map((result, i) => (
          <ResultCard
            result={result}
            key={result.item.fileName}
            isSelected={appContext.selectedResultIndex === i}
          />
        ))}
      </Box>
      <Footer />
    </Box>
  )
}

export const Footer = () => {
  return (
    <Box flexDirection="row" justifyContent="flex-end" marginRight={1}>
      <Text>
        <Text underline>ESC</Text> to exit
      </Text>
    </Box>
  )
}

export const InstalledBadge = ({ item }: { item: ComponentSchema }) => {
  const appContext = React.useContext(AppContext)
  const isComponentInstalled = appContext.installState?.installedComponents
    ?.map((component) => component.fileName)
    .includes(item.fileName)

  if (!appContext.installState?.installedComponents) return null
  return (
    isComponentInstalled && (
      <Box marginLeft={1}>
        <Badge color="green">Installed</Badge>
      </Box>
    )
  )
}

export const ResultCard = ({
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
              case appContext.installState.installingComponent && isSelected:
                return ''
              case Boolean(appContext.installState.installingComponent):
                return '  '
              case isSelected:
                return '❯ '
              default:
                return '  '
            }
          })()}
        </Text>
        {appContext.installState.installingComponent && isSelected && (
          <InstallingSpinnerLabel />
        )}
        <Text bold color={isSelected ? 'white' : 'black'}>
          {result.item?.name}
        </Text>
        <InstalledBadge item={result.item} />
      </Box>
      <Spacer />
      <ComponentAccessType item={result.item} />
      <CategorySectionBadge item={result.item} />
    </Box>
  )
}

export const CategorySectionBadge = ({ item }: { item: ComponentSchema }) => {
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <Box marginLeft={1} gap={1}>
      <Text color={'black'} backgroundColor={'white'}>
        {' '}
        {capitalizeFirstLetter(item?.category)} {'>'}{' '}
        {capitalizeFirstLetter(item?.categorySection)}{' '}
      </Text>
    </Box>
  )
}

export const ComponentAccessType = ({ item }: { item: ComponentSchema }) => {
  return (
    <Box marginLeft={1} gap={1}>
      <Text color={'black'} backgroundColor={item?.isOSS ? 'green' : 'blue'}>
        {item?.isOSS ? 'FREE' : 'PRO'}
      </Text>
    </Box>
  )
}

export const ResultsCounter = () => {
  const appContext = React.useContext(AppContext)
  const resultCount = appContext.searchResults.length
  return (
    <Box>
      {!!resultCount && (
        <Text bold color="gray">
          {resultCount} result{resultCount > 1 ? 's' : ''}
        </Text>
      )}
    </Box>
  )
}

export const InstallingSpinnerLabel = () => {
  const appContext = React.useContext(AppContext)
  return (
    <Box>
      {appContext.installState.installingComponent ? (
        <Box>
          <Spinner label="Installing " />
        </Box>
      ) : (
        <Box marginRight={2} />
      )}
    </Box>
  )
}

export const UsageBanner = () => {
  return (
    <Alert variant="info">
      Search any component by category, section or name. <Text underline>Up</Text> and{' '}
      <Text underline>down</Text> arrows to select. <Text underline>Enter</Text> to
      install.
    </Alert>
  )
}
