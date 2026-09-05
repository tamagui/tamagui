import { hydrateRoot } from 'react-dom/client'

import { StreamingRoot } from './StreamingRoot'

hydrateRoot(document.querySelector('#root')!, <StreamingRoot />)
// the test waits on this rather than on a timer, so it can assert that styles
// are still right *after* the client has taken over
document.documentElement.dataset.hydrated = 'true'
