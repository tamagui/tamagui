import { TamaguiProvider, createTamagui, html, styled } from '@tamagui/core'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('web'))

/**
 * `html.*` from regular Tamagui, on web.
 *
 * On web there is no lowering: each tag is an ordinary Tamagui component that
 * renders the literal element, so what matters is that the real tag reaches the
 * document, that the element defaults from the tag table are applied, and that
 * an author's style props still win over them.
 */
const show = (ui: React.ReactNode) =>
  render(
    <TamaguiProvider config={config} defaultTheme="light">
      {ui}
    </TamaguiProvider>
  )

const find = (container: HTMLElement, selector: string) => {
  const found = container.querySelector(selector)
  if (!found) throw new Error(`no ${selector} in ${container.innerHTML}`)
  return found as HTMLElement
}

describe('semantic tags', () => {
  test('render the literal element, not a div for everything', () => {
    const { container } = show(
      <html.article data-testid="article">
        <html.h1 data-testid="heading">Title</html.h1>
        <html.p data-testid="para">
          Body with <html.strong data-testid="strong">weight</html.strong>
        </html.p>
        <html.ul data-testid="list">
          <html.li data-testid="item">one</html.li>
        </html.ul>
      </html.article>
    )
    for (const [testid, tag] of [
      ['article', 'ARTICLE'],
      ['heading', 'H1'],
      ['para', 'P'],
      ['strong', 'STRONG'],
      ['list', 'UL'],
      ['item', 'LI'],
    ]) {
      expect(find(container, `[data-testid="${testid}"]`).tagName, testid).toBe(tag)
    }
  })

  test('nest text inside a block element as the real dom would', () => {
    const { container } = show(
      <html.p data-testid="para">
        before <html.em data-testid="em">middle</html.em> after
      </html.p>
    )
    const para = find(container, '[data-testid="para"]')
    expect(para.textContent).toBe('before middle after')
    expect(find(container, '[data-testid="em"]').tagName).toBe('EM')
  })
})

describe('element defaults from the tag table', () => {
  test('reset the browser margin and padding on a block element', () => {
    const { container } = show(<html.p data-testid="para">x</html.p>)
    const style = getComputedStyle(find(container, '[data-testid="para"]'))
    expect(style.margin).toBe('0px')
    expect(style.padding).toBe('0px')
  })

  test('carry the decoration the browser stylesheet would have given the tag', () => {
    const { container } = show(
      <>
        <html.strong data-testid="strong">a</html.strong>
        <html.em data-testid="em">b</html.em>
        <html.del data-testid="del">c</html.del>
      </>
    )
    // the defaults become style props, so they resolve to atomic classes
    expect(find(container, '[data-testid="strong"]').className).not.toBe('')
    expect(find(container, '[data-testid="em"]').className).not.toBe('')
    expect(find(container, '[data-testid="del"]').className).not.toBe('')
  })

  test('lose to an author style prop, since they are only defaults', () => {
    const { container } = show(
      <html.p data-testid="para" margin={16}>
        x
      </html.p>
    )
    const style = getComputedStyle(find(container, '[data-testid="para"]'))
    expect(style.margin).toBe('16px')
  })
})

describe('element-specific props', () => {
  test('reach the dom element they belong to', () => {
    const { container } = show(
      <html.a
        data-testid="link"
        href="https://tamagui.dev"
        target="_blank"
        rel="noreferrer"
      >
        go
      </html.a>
    )
    const link = find(container, '[data-testid="link"]')
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('https://tamagui.dev')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
  })

  test('reach an image and an input', () => {
    const { container } = show(
      <>
        <html.img data-testid="img" src="a.png" alt="a picture" />
        <html.input data-testid="input" type="email" placeholder="you@example.com" />
      </>
    )
    const img = find(container, '[data-testid="img"]')
    expect(img.tagName).toBe('IMG')
    expect(img.getAttribute('src')).toBe('a.png')
    expect(img.getAttribute('alt')).toBe('a picture')

    const input = find(container, '[data-testid="input"]')
    expect(input.tagName).toBe('INPUT')
    expect(input.getAttribute('type')).toBe('email')
    expect(input.getAttribute('placeholder')).toBe('you@example.com')
  })

  test('drive a button click', () => {
    let clicked = 0
    const { container } = show(
      <html.button data-testid="button" onPress={() => clicked++}>
        press
      </html.button>
    )
    const button = find(container, '[data-testid="button"]')
    expect(button.tagName).toBe('BUTTON')
    button.click()
    expect(clicked).toBe(1)
  })
})

describe('the is_DOM host class', () => {
  const tags = (
    <>
      <html.p data-testid="para">x</html.p>
      <html.h1 data-testid="heading">x</html.h1>
      <html.span data-testid="inline">x</html.span>
      <html.button data-testid="button">x</html.button>
      <html.pre data-testid="pre">x</html.pre>
    </>
  )

  test('ssr renders is_DOM and never is_Text or is_View', () => {
    const out = renderToString(
      <TamaguiProvider config={config} defaultTheme="light">
        {tags}
      </TamaguiProvider>
    )
    const host = document.createElement('div')
    host.innerHTML = out
    for (const testid of ['para', 'heading', 'inline', 'button', 'pre']) {
      const className = host.querySelector(`[data-testid="${testid}"]`)?.className ?? ''
      expect(className, testid).toContain('is_DOM')
      expect(className, testid).not.toContain('is_Text')
      expect(className, testid).not.toContain('is_View')
    }
  })

  test('leaves display to the browser stylesheet', () => {
    const { container } = show(tags)
    // block tags regressed to inline when the hosts carried is_Text
    expect(getComputedStyle(find(container, '[data-testid="para"]')).display).toBe(
      'block'
    )
    expect(getComputedStyle(find(container, '[data-testid="heading"]')).display).toBe(
      'block'
    )
    expect(getComputedStyle(find(container, '[data-testid="pre"]')).display).toBe('block')
    // view-backed tags regressed to flex when the hosts carried is_View
    expect(getComputedStyle(find(container, '[data-testid="button"]')).display).toBe(
      'inline-block'
    )
    // happy-dom ships no UA display for span (real browsers say inline); the
    // pin is that Tamagui authors none, so the browser default wins
    expect(getComputedStyle(find(container, '[data-testid="inline"]')).display).toBe('')
  })
})

describe('styled(html.*)', () => {
  test('keeps the tag, the dom props and the host class', () => {
    // mirrors the kitchen-sink anchor case: styled(html.a) with an href
    const StyledAnchor = styled(html.a, { color: 'red', padding: 4 })
    const { container } = show(
      <StyledAnchor data-testid="anchor" href="#">
        x
      </StyledAnchor>
    )
    const link = find(container, '[data-testid="anchor"]')
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('#')
    expect(link.className).toContain('is_DOM')
    expect(link.className).not.toContain('is_Text')
  })
})

describe('the namespace', () => {
  test('exposes every tag in the contract', () => {
    // 49 semantic elements, the same set react strict dom exposes
    expect(Object.keys(html)).toHaveLength(49)
    for (const tag of [
      'div',
      'span',
      'a',
      'img',
      'input',
      'textarea',
      'select',
      'br',
      'hr',
    ]) {
      expect(typeof html[tag], tag).toBe('object')
    }
  })
})
