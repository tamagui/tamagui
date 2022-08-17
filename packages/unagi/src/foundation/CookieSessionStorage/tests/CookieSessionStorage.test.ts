import {CookieSessionStorage} from '../CookieSessionStorage.js';

const options = {
  httponly: true,
  secure: true,
  samesite: 'Strict',
  path: '/',
  expires: new Date(1749343178614),
  domain: 'shopify.dev',
};

let request: Request;

describe('CookieSessionStorage', () => {
  beforeEach(() => {
    request = new Request('', {
      headers: {
        cookie:
          '__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%7D; Expires=Thu, 05 May 2022 20:17:51 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly',
      },
    });
  });

  it('parses the cookie only once', async () => {
    const session = CookieSessionStorage('__session', options)();

    let data = await session.get(request);

    expect(data).toStrictEqual({
      a: 'b',
      c: 'd',
    });

    // clearing out the cookie shouldn't make a difference, because we already parsed the cookie
    request.headers.set('cookie', '');

    data = await session.get(request);

    expect(data).toStrictEqual({
      a: 'b',
      c: 'd',
    });
  });

  it('returns cookie string on setting data', async () => {
    const session = CookieSessionStorage('__session', options)();
    expect(await session.set(request, {some: 'data'})).toMatchInlineSnapshot(
      `"__session=%7B%22some%22%3A%22data%22%7D; Expires=Sun, 08 Jun 2025 00:39:38 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );
  });

  it('returns cookie string on destroying data', async () => {
    const session = CookieSessionStorage('__session', options)();
    expect(await session.destroy(request)).toMatchInlineSnapshot(
      `"__session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );
  });
});
