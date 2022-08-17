import { MemorySessionStorage } from '../MemorySessionStorage.js'

const options = {
  httponly: true,
  secure: true,
  samesite: 'Strict',
  path: '/',
  expires: new Date(1749343178614),
  domain: 'shopify.dev',
}

let request: Request

describe('MemorySessionStorage', () => {
  beforeEach(() => {
    request = new Request('', {
      headers: {
        cookie:
          '__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%2C%22sid%22%3A%22eca0b9ec-c013-4ea1-8236-df6ed02f00c4%22%7D; Expires=Tue, 05 Apr 2022 20:19:02 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly',
      },
    })
  })

  it('sets the cookie', async () => {
    const session = MemorySessionStorage('__session', options)()

    const cookieString = await session.set(request, { data: 'a' })

    const data = await session.get(request)

    expect(cookieString).toMatchInlineSnapshot(
      `"__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%2C%22sid%22%3A%22eca0b9ec-c013-4ea1-8236-df6ed02f00c4%22%7D; Expires=Sun, 08 Jun 2025 00:39:38 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    )
    expect(data).toStrictEqual({
      data: 'a',
    })
  })

  it('destroys the cookie', async () => {
    const session = MemorySessionStorage('__session', options)()
    const cookieString = await session.destroy(request)

    expect(cookieString).toMatchInlineSnapshot(
      `"__session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    )
  })

  it('resets session when expired', async () => {
    const session = MemorySessionStorage('__session', {
      ...options,
      expires: new Date(0),
    })()

    const cookieString = await session.set(request, { data: 'a' })
    const data = await session.get(request)
    expect(data).toStrictEqual({})

    expect(cookieString).toMatchInlineSnapshot(
      `"__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%2C%22sid%22%3A%22eca0b9ec-c013-4ea1-8236-df6ed02f00c4%22%7D; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    )
  })
})
