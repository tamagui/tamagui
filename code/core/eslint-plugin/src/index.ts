export { validFlatValues } from './validFlatValues'

import type { Rule } from 'eslint'
import { validFlatValues } from './validFlatValues'

export interface TamaguiEslintRules {
  'valid-flat-values': Rule.RuleModule
}

export interface TamaguiEslintPlugin {
  rules: TamaguiEslintRules
}

export const rules: TamaguiEslintRules = {
  'valid-flat-values': validFlatValues,
}

const plugin: TamaguiEslintPlugin = { rules }

export default plugin
