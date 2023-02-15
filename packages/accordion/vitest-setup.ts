import 'vitest-axe/extend-expect'

import jsmatchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)
expect.extend(jsmatchers)
