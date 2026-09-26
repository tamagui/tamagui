// the integration-owned artifact, imported once from the client entry
import '../.tamagui/global/tamagui-global.css'
import { createRoot } from 'react-dom/client'
import { GlobalApp } from './GlobalApp'

createRoot(document.getElementById('root')!).render(<GlobalApp />)
