export type SessionSyncApi = {
  get: () => Record<string, string>
}

export type SessionApi = {
  get: () => Promise<Record<string, string>>
  set: (key: string, value: string) => Promise<void>
  destroy: () => Promise<void>
}

export type SessionStorageAdapter = {
  get: (request: Request) => Promise<Record<string, string>>
  set: (request: Request, value: Record<string, string>) => Promise<string>
  destroy: (request: Request) => Promise<string>
}
