import './polyfill'
import { createRoot } from 'react-dom/client'
import { App } from './src/App'

createRoot(document.querySelector('#root')).render(<App />)
