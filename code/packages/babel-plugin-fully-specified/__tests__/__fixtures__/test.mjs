import foo, { bar } from './modules/module'
import { foo as foo2 } from './modules/module'
import * as someModule from './modules/module'

import { foo as cjsFoo } from './modules/cjs-module'

import { transform } from '@babel/core'

// Will be transformed if `includePackages` includes `@babel/core`.
import { transformFile } from '@babel/core/src/transform-file-browser'
