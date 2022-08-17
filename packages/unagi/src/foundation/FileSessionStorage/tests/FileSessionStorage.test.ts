import { promises as fsp } from 'fs'
import path from 'path'

import { Logger } from '../../../utilities/log/index.js'
import { FileSessionStorage } from '../FileSessionStorage.js'

// TODO
const jest = {} as any

const options = {
  httponly: true,
  secure: true,
  samesite: 'Strict',
  path: '/',
  expires: new Date(1749343178614),
  domain: 'shopify.dev',
}

const sessionFilePath = path.resolve(
  __dirname,
  'sessions',
  'eca',
  '0b9ec-c013-4ea1-8236-df6ed02f00c4'
)

let request: Request
let log: Logger

describe('FileSessionStorage', () => {
  beforeEach(async () => {
    log = {
      warn: jest.fn(),
      error: () => {},
      trace: () => {},
      debug: () => {},
      fatal: () => {},
      options: () => {
        return {}
      },
    }

    await fsp.mkdir(path.resolve(__dirname, 'sessions'))

    request = new Request('', {
      headers: {
        cookie:
          '__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%2C%22sid%22%3A%22eca0b9ec-c013-4ea1-8236-df6ed02f00c4%22%7D; Expires=Tue, 05 Apr 2022 20:19:02 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly',
      },
    })
  })

  afterEach(async () => {
    await fsp.rm(path.resolve(__dirname, 'sessions'), { recursive: true })
  })

  it('creates a file with an empty session', async () => {
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log)

    const data = await session.get(request)

    expect(data).toStrictEqual({})
    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{},"expires":1749343178614}'
    )
  })

  it('writes a file with session data', async () => {
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log)

    const cookie = await session.set(request, { some: 'data' })
    expect(cookie).toMatchInlineSnapshot(
      `"__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%2C%22sid%22%3A%22eca0b9ec-c013-4ea1-8236-df6ed02f00c4%22%7D; Expires=Sun, 08 Jun 2025 00:39:38 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    )

    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{"some":"data"},"expires":1749343178614}'
    )
  })

  it('reads a previous session out of a file', async () => {
    await createSessionFile(
      sessionFilePath,
      '{"data":{"previous":"data"},"expires":16491899429650}'
    )
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log)

    const data = await session.get(request)

    expect(data).toStrictEqual({ previous: 'data' })
  })

  it('warns if a corrupt file is read', async () => {
    await createSessionFile(sessionFilePath, '{CORUPTDATA..}')

    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log)

    const data = await session.get(request)

    expect(data).toStrictEqual({})
    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{},"expires":1749343178614}'
    )

    expect((log.warn as any).mock.calls[0][0]).toContain('Cannot parse existing session file')
  })

  it('resets session when expired', async () => {
    await createSessionFile(
      sessionFilePath,
      `{"data":{"old": "data"},"expires":${new Date(0).getTime()}}`
    )
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log)

    const data = await session.get(request)

    expect(data).toStrictEqual({})
    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{},"expires":1749343178614}'
    )
  })

  it('destroys session', async () => {
    await createSessionFile(sessionFilePath, '{"data":{"old": "data"},"expires":164918994}')
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log)

    const cookieString = await session.destroy(request)

    expect(cookieString).toMatchInlineSnapshot(
      `"__session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    )

    expect(() => fsp.access(sessionFilePath)).rejects.toThrow()
  })
})

async function createSessionFile(sessionFilePath: string, contents: string) {
  await fsp.mkdir(path.dirname(sessionFilePath), {
    recursive: true,
  })
  await fsp.writeFile(sessionFilePath, contents, {
    encoding: 'utf-8',
    flag: 'w+',
  })
}

async function expectFileContentsToBe(sid: string, result: string) {
  expect(
    await fsp.readFile(path.resolve(__dirname, 'sessions', sid.slice(0, 3), sid.slice(3)), {
      encoding: 'utf-8',
    })
  ).toBe(result)
}
