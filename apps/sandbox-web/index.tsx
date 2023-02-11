import { createRoot } from 'react-dom/client'

import { Sandbox } from './SandboxWeb'

createRoot(document.querySelector('#root')!).render(<Sandbox />)
