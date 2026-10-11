import { createRoot } from 'react-dom/client'
import { CardPanel } from './styled-export-lib'
import { cardName } from './styled-export-escape-lib'

document.title = `card: ${cardName}`

createRoot(document.getElementById('root')!).render(<CardPanel />)
