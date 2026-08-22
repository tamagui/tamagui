// the unimported control: identical to global-main.tsx except that it never
// imports the artifact, which is the state the build check exists to catch
import { createRoot } from 'react-dom/client'
import { GlobalApp } from './GlobalApp'

createRoot(document.getElementById('root')!).render(<GlobalApp />)
