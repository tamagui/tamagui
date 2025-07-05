export class AbortError extends Error {
  constructor(message = '') {
    super(message)
    this.name = 'AbortError'
  }
}
