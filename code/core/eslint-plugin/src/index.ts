export { validFlatValues } from './validFlatValues'

import type { Rule } from 'eslint'
import { validFlatValues } from './validFlatValues'

export interface TamaguiEslintRules {
  'valid-flat-values': Rule.RuleModule
}

export interface TamaguiEslintPlugin {
  meta: {
    name: string
  }
  rules: TamaguiEslintRules
}

export const rules: TamaguiEslintRules = {
  'valid-flat-values': validFlatValues,
}

const plugin: TamaguiEslintPlugin = {
  meta: {
    name: '@tamagui/eslint-plugin',
  },
  rules,
}

export default plugin
