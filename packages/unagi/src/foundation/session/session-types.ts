export type SessionSyncApi = {
  get: () => Record<string, string>
  set: (data: Record<string, any>) => any
}

export type SessionApi = {
  get: () => Promise<Record<string, string>>
  set: (key: string, value: string) => Promise<void>
  destroy: () => Promise<void>
  getFlash: (key: string) => any
}

export type SessionStorageAdapter = {
  get: (request: Request) => Promise<Record<string, string>>
  set: (request: Request, value: Record<string, string>) => Promise<string>
  destroy: (request: Request) => Promise<string>
}
