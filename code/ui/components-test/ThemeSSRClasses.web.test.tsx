import '@testing-library/jest-dom'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, Theme, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const base = getDefaultTamaguiConfig()

// the site model: the document element carries the scheme class (the v6 config
// default), so the root theme defers to it and server output stays neutral.
// a root that owns its class instead (isSubtreeRoot, or addThemeClassName unset)
// takes the forceClassName path, covered by the last test here.
const conf = createTamagui({
  ...base,
  settings: { ...(base as any).settings, addThemeClassName: 'html' },
  themes: {
    ...base.themes,
    light_blue: { background: 'lightblue', color: 'navy' },
    light_blue_Button: { background: 'skyblue', color: 'navy' },
    dark_blue_Button: { background: 'navy', color: 'skyblue' },
  },
} as any)

// the server does not know the reader's scheme, so it renders under a guessed
// root theme. a scheme-qualified class like t_light_blue outranks the root
// class the blocking scheme script sets on <html>, so an inherited scheme must
// never produce one: the markup has to read correctly under either root.
function themeClasses(ui: React.ReactElement) {
  const { container } = render(
    <TamaguiProvider config={conf} defaultTheme="light">
      {ui}
    </TamaguiProvider>
  )
  return [...container.querySelectorAll('span')].map((el) => el.className)
}

const flat = (classes: string[]) => classes.join(' ').split(/\s+/).filter(Boolean)

describe('theme classes under a server-guessed scheme', () => {
  it('a bare name inherits the scheme and stays scheme-relative', () => {
    const classes = flat(themeClasses(<Theme name="blue">x</Theme>))
    expect(classes).toContain('t_blue')
    expect(classes).not.toContain('t_light_blue')
    expect(classes).not.toContain('t_light')
  })

  it('an explicitly scheme-named theme pins its scheme', () => {
    const classes = flat(themeClasses(<Theme name="light_blue">x</Theme>))
    expect(classes).toContain('t_light_blue')
  })

  it('a bare scheme name pins the scheme it names', () => {
    const classes = flat(themeClasses(<Theme name="light">x</Theme>))
    expect(classes).toContain('t_light')
  })

  it('pinning is cumulative through descendants', () => {
    const classes = flat(
      themeClasses(
        <Theme name="dark_blue">
          <Theme name="Button">x</Theme>
        </Theme>
      )
    )
    expect(classes).toContain('t_dark_blue')
    expect(classes).toContain('t_dark_blue_Button')
  })

  it('an inherited scheme stays relative all the way down', () => {
    const classes = flat(
      themeClasses(
        <Theme name="blue">
          <Theme name="Button">x</Theme>
        </Theme>
      )
    )
    expect(classes).toContain('t_blue_Button')
    expect(classes).not.toContain('t_light_blue_Button')
    expect(classes).not.toContain('t_light_blue')
  })

  it('pins even when the name resolves to the one the parent already has', () => {
    // resolveThemeName returns null for a name that lands on the parent's own
    // name, so validity has to be read from the authored name itself
    const classes = flat(
      themeClasses(
        <Theme name="light_blue">
          <Theme name="light_blue">x</Theme>
        </Theme>
      )
    )
    expect(classes).toContain('t_light_blue')
  })

  it('a scheme-named theme that does not exist pins nothing', () => {
    const classes = flat(themeClasses(<Theme name="light_missing">x</Theme>))
    expect(classes).not.toContain('t_light_missing')
    expect(classes).not.toContain('t_light')
  })

  it('naming the scheme the parent only inherited gets its own scope', () => {
    // resolves to the same name its parent already has, but this node is the
    // one that pins, so it needs its own state and its own classes
    const classes = flat(
      themeClasses(
        <Theme name="blue">
          <Theme name="light_blue">x</Theme>
        </Theme>
      )
    )
    expect(classes).toContain('t_blue')
    expect(classes).toContain('t_light_blue')
  })

  it('pinning follows the authored name in both directions', () => {
    function App({ inner }: { inner: string }) {
      return (
        <TamaguiProvider config={conf} defaultTheme="light">
          <Theme name="blue">
            <Theme name={inner}>
              <Theme name="Button">x</Theme>
            </Theme>
          </Theme>
        </TamaguiProvider>
      )
    }
    const { container, rerender } = render(<App inner="light_blue" />)
    const read = () =>
      flat([...container.querySelectorAll('span')].map((el) => el.className))

    expect(read()).toContain('t_light_blue')
    expect(read()).toContain('t_light_blue_Button')

    // back to a bare name: nothing pins any more, so neither may the descendants
    rerender(<App inner="blue" />)
    expect(read()).not.toContain('t_light_blue')
    expect(read()).not.toContain('t_light_blue_Button')
    expect(read()).toContain('t_blue_Button')

    rerender(<App inner="light_blue" />)
    expect(read()).toContain('t_light_blue_Button')
  })

  it('a subtree root keeps its own scheme classes', () => {
    // nothing above a subtree root carries a theme class, so its scheme has to
    // survive: a dark subtree inside a light document stays dark
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="dark" isSubtreeRoot>
        <Theme name="blue">x</Theme>
      </TamaguiProvider>
    )
    const classes = flat(
      [...container.querySelectorAll('span')].map((el) => el.className)
    )
    expect(classes).toContain('t_dark')
    expect(classes).toContain('t_dark_blue')
  })
})
