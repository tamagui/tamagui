export const generateModels = {
  'gemini-2.0-pro-exp': true,
  'gemini-2.0-flash': true,
  'gemini-2.0-flash-exp': true,
  'gemini-2.0-flash-thinking-exp': true,
  'gemini-1.5-pro-latest': true,
  'grok-beta': true,
  'grok-2-1212': true,
  'deepseek-chat': true,
  'deepseek-reasoner': true,
  'claude-3-7-sonnet': true,
  'claude-3-5-sonnet-latest': true,
  'claude-3-5-haiku-latest': true,
  'gpt-4o-mini': true,
  'gpt-4o': true,
  'gpt-4': true,
  'gpt-4-turbo': true,
  o1: true,
  'o3-mini': true,
  'or-o3-mini': true,
  'or-o1-mini': true,
  'or-deepseek-r1-distill-llama-70b': true,
  'groq-r1-llama-70b': true,
} as const

export type ModelNames = keyof typeof generateModels

export const defaultModel: ModelNames = 'claude-3-7-sonnet'
