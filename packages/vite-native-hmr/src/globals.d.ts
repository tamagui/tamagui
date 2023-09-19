interface HMRInfo {
  type: string
  chain: Array<string | number>
  error?: Error
  moduleId: string | number
}

interface HotApi {
  status():
    | 'idle'
    | 'check'
    | 'prepare'
    | 'ready'
    | 'dispose'
    | 'apply'
    | 'abort'
    | 'fail'
  check(autoPlay: boolean): Promise<Array<string | number>>
  apply(options: {
    ignoreUnaccepted?: boolean
    ignoreDeclined?: boolean
    ignoreErrored?: boolean
    onDeclined?: (info: HMRInfo) => void
    onUnaccepted?: (info: HMRInfo) => void
    onAccepted?: (info: HMRInfo) => void
    onDisposed?: (info: HMRInfo) => void
    onErrored?: (info: HMRInfo) => void
  }): Promise<Array<string | number>>
}

interface NodeModule {
  hot?: HotApi
}
