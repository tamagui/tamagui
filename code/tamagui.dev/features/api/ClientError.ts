// a user-facing error. apiRoute returns its message + status to the client, so
// throw this for validation / business errors the caller is meant to see (e.g.
// "This coupon has expired"). Plain Errors are treated as internal and return a
// generic 500 with no detail leaked.
export class ClientError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.name = 'ClientError'
    this.status = status
  }
}
