import { themes as themesIn } from './themes'

// tree shake away themes in production
export const themes: typeof themesIn =
  typeof window !== 'undefined' ? ({} as any) : themesIn
