import foo, { bar } from './modules/module'
import { foo as foo2 } from './modules/module'
import * as someModule from './modules/module'

import { foo as cjsFoo } from './modules/cjs-module'

// Will not be transformed
import { foo as packageFoo } from '@my-org/my-pkg'

// These will be transformed if `includePackages` includes `@my-org/my-pkg`.
import { someStuff } from '@my-org/my-pkg/lib'
// import { someOtherStuff } from '@my-org/my-pkg/lib/index' // TODO: Fix me
import { exampleFunction } from '@my-org/my-pkg/lib/exampleFunction'
