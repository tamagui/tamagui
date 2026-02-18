export const generateModels = {
  'claude-sonnet-4-6': true,
} as const

export type ModelNames = keyof typeof generateModels

export const defaultModel: ModelNames = 'claude-sonnet-4-6'
