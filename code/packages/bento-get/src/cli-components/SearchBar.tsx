import Fuse from 'fuse.js'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { ResultsCounter } from '../cli-components/index.js'
import { componentsList } from '../components.js'
import { AppContext } from '../data/AppContext.js'

export const SearchBar = () => {
  const location = useLocation()
  const appContext = React.useContext(AppContext)

  // Perform search using Fuse.js for fuzzy matching
  const performSearch = (query: string) => {
    const fuse = new Fuse(componentsList, {
      keys: ['name', 'category', 'categorySection'],
    })
    return fuse.search(query)
  }

  React.useEffect(() => {
    // When navigation location changes, reset search Input
    appContext.setSearchInput('')
  }, [location.pathname])

  const handleInputChange = (value: string) => {
    if (location.pathname !== '/search') return
    if ((appContext.installState as any).installingComponent?.isOSS) return
    appContext.setSearchInput(value)
    const results = performSearch(value)
    appContext.setSearchResults(results)
    appContext.setSelectedResultIndex(-1)
  }

  return (
    <Box marginX={1} justifyContent="space-between">
      <Box>
        <Text bold>Search: </Text>
        <TextInput
          focus
          value={appContext.searchInput}
          onChange={handleInputChange}
          // @ts-ignore
          marginRight={'auto'}
        />
      </Box>
      <ResultsCounter />
    </Box>
  )
}
