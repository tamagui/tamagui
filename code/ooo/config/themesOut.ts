import { themes as themesIn } from './themes'

// tree shake away themes in production
export const themes: typeof themesIn =
  process.env.VITE_ENVIRONMENT === 'client' ? ({} as any) : themesIn
