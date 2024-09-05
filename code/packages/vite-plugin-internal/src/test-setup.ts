import * as React from 'react'
import 'vitest-axe/extend-expect'

import { expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

globalThis.React = React
