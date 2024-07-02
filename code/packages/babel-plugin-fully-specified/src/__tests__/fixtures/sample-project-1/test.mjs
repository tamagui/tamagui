import foo, { bar } from './modules/module'
import { foo as foo2 } from './modules/module'
import * as someModule from './modules/module'

import { foo as cjsFoo } from './modules/cjs-module'

import { foo as packageFoo } from '@my-org/my-pkg'

// Will be transformed if `includePackages` includes `@my-org/my-pkg`.
import { transformFile } from '@my-org/my-pkg/lib'
