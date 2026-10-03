import { createRoot } from 'react-dom/client'
import { Theme, View } from 'tamagui'

// Rule 4. An open-ended runtime theme name: nothing enumerates it at build time,
// so no set of static classes can stand in for it.
const themeName = new URLSearchParams(location.search).get('theme') || 'light'

function DynamicThemeName() {
  return (
    <Theme name={themeName}>
      <View data-testid="zero-root" padding={24} />
    </Theme>
  )
}

createRoot(document.getElementById('root')!).render(<DynamicThemeName />)
