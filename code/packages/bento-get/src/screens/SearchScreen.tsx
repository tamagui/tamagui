import { UsageBanner, ResultsContainer } from '../cli-components/index.js'
import { SearchBar } from '../cli-components/SearchBar.js'

export const SearchScreen = () => (
  <>
    <UsageBanner />
    <SearchBar />
    <ResultsContainer />
  </>
)
