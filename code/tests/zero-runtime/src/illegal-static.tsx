import { createRoot } from 'react-dom/client'
import { Text, View } from 'tamagui'
// illegal: a declared island is a separately built full-runtime entry, so the
// zero graph may only reach it through the generated loader
import SheetIsland from './islands/SheetIsland'

function IllegalStaticImport() {
  return (
    <View data-testid="zero-root" padding={24}>
      <Text data-testid="zero-text">illegal static island import</Text>
      <SheetIsland />
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<IllegalStaticImport />)
