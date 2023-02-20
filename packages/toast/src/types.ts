interface CreateNativeToastsOptions {
  title: string
  body?: string
  actions?: {
    title: string
    action: () => any
  }[]
  preset: 'done' | 'error'
  duration: number
}
