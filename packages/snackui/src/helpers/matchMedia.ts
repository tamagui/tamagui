export const matchMedia = typeof window !== 'undefined' ? window.matchMedia : () => ({} as any)
