export const generateModels = {
  'claude-opus-4-5': true,
} as const

export type ModelNames = keyof typeof generateModels

export const defaultModel: ModelNames = 'claude-opus-4-5'
