import { createRoot } from 'react-dom/client'
import { Theme, View } from 'tamagui'

const wantsDark = new URLSearchParams(location.search).get('theme') === 'dark'

function EnumerableThemeName() {
  return (
    <Theme name={wantsDark ? 'dark' : 'light'}>
      <View data-testid="zero-root" padding={24} />
    </Theme>
  )
}

createRoot(document.getElementById('root')!).render(<EnumerableThemeName />)
