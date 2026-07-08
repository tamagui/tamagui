import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { renderSafeHtml } from '../renderSafeHtml'

describe('renderSafeHtml', () => {
  it('preserves safe code-highlighting markup', () => {
    const html = renderToStaticMarkup(
      <code>
        {renderSafeHtml('<span class="token keyword" data-line="1">const</span>')}
      </code>
    )

    expect(html).toBe(
      '<code><span class="token keyword" data-line="1">const</span></code>'
    )
  })

  it('drops executable tags and attributes', () => {
    const html = renderToStaticMarkup(
      <code>
        {renderSafeHtml(
          '<span class="token keyword" onclick="alert(1)">const</span><script>alert(1)</script><img src=x onerror=alert(1)>'
        )}
      </code>
    )

    expect(html).toContain('<span class="token keyword">const</span>')
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('onerror')
  })

  it('filters unsafe classes and data values', () => {
    const html = renderToStaticMarkup(
      <code>
        {renderSafeHtml(
          '<span class="token evil:hover [bad]" data-line="1" data-bad="javascript:alert(1)">x</span>'
        )}
      </code>
    )

    expect(html).toBe('<code><span class="token" data-line="1">x</span></code>')
  })
})
