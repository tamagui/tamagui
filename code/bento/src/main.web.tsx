import { createRoot } from 'react-dom/client'

import App from './App'

// AppRegistry.registerComponent('main', () => App)
createRoot(document.querySelector('#root')!).render(<App />)
