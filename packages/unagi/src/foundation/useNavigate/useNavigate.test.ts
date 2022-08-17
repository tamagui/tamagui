import { buildPath } from './useNavigate.js'

describe('buildPath', () => {
  it('doesn\'t transform base path "/"', () => {
    expect(buildPath('/', '/')).toBe('/')
    expect(buildPath('/', '/path')).toBe('/path')
    expect(buildPath('/', '/path?params')).toBe('/path?params')
  })
  it('transforms with base path', () => {
    expect(buildPath('/base', '/')).toBe('/base/')
    expect(buildPath('/base', '/path')).toBe('/base/path')
    expect(buildPath('/base', 'path')).toBe('/base/path')
    expect(buildPath('/base/', '/path')).toBe('/base/path')
    expect(buildPath('/base', '/path?params')).toBe('/base/path?params')
  })
  it("doesn't transform fully qualified URLs", () => {
    expect(buildPath('/base', 'http://website.com')).toBe('http://website.com')
    expect(buildPath('/base', 'https://website.com')).toBe('https://website.com')
    expect(buildPath('/base', '//website.com')).toBe('//website.com')
    expect(buildPath('/', 'http://website.com')).toBe('http://website.com')
    expect(buildPath('/', 'https://website.com')).toBe('https://website.com')
    expect(buildPath('/', '//website.com')).toBe('//website.com')
  })
})
