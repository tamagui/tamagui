import React from 'react'
import { describe, expect, test } from 'vitest'
import { TamaguiProvider, createFont, createTamagui, styled } from '@tamagui/core'
import { Input, TextArea } from '../../ui/tamagui/src/components/Input'
import { getDefaultTamaguiConfig } from '../config-default'
import { render } from '@testing-library/react'

const defaults = getDefaultTamaguiConfig('web')
const config = createTamagui({
  ...defaults,
  fonts: {
    body: createFont({
      ...defaults.fonts.body,
      family: 'System',
      size: { ...defaults.fonts.body.size, 'Body-sm': 14, 'Body-md': 16, true: 16 },
      lineHeight: {
        ...defaults.fonts.body.lineHeight,
        'Body-sm': 20,
        'Body-md': 24,
        true: 24,
      },
      weight: {
        ...defaults.fonts.body.weight,
        'Body-sm': '500',
        'Body-md': '400',
        true: '400',
      },
    }),
  },
  settings: { defaultFont: 'body' },
})
const tokens = {
  fontSize: '$Body-sm',
  lineHeight: '$Body-sm',
  fontWeight: '$Body-sm',
} as const

describe('styled input font tokens', () => {
  for (const [name, Base] of Object.entries({ Input, TextArea })) {
    for (const placement of [
      'variant',
      'branch family',
      'root family',
      'inherited family',
      'root',
    ]) {
      test(`${name}: ${placement}`, () => {
        const Parent =
          placement === 'inherited family'
            ? styled(Base as any, { fontFamily: '$body' })
            : Base
        const Component = styled(
          Parent as any,
          {
            ...(placement === 'root' ? tokens : {}),
            ...(placement === 'root family' ? { fontFamily: '$body' } : {}),
            variants: {
              size: {
                sm: {
                  ...(placement === 'branch family' ? { fontFamily: '$body' } : {}),
                  ...tokens,
                },
              },
            },
          } as any
        )
        const tree = render(
          <TamaguiProvider config={config}>
            <Component
              testID="target"
              {...(placement === 'root' ? {} : { size: 'sm' })}
            />
          </TamaguiProvider>
        )
        const node = tree.getByTestId('target')
        const css = config.getCSS()
        for (const [property, value] of [
          ['font-size', 'var(--f-size-Body-sm)'],
          ['line-height', 'var(--f-lineHeight-Body-sm)'],
          ['font-weight', 'var(--f-weight-Body-sm)'],
        ]) {
          const matching =
            css
              .match(/[^{}]+\{[^{}]*\}/g)
              ?.filter(
                (rule) =>
                  rule.includes(`${property}:`) &&
                  [...node.classList].some((cls) => rule.includes(`.${cls}{`))
              ) ?? []
          expect(matching.join('\n'), `${name} ${placement} ${property}`).toContain(
            `${property}:${value}`
          )
        }
        tree.unmount()
      })
    }
    test.each([undefined, true, false, 'xs', 'sm', 'md', 'lg', 'xl'])(
      `%s keeps ${name} defaults`,
      (size) => {
        const tree = render(
          <TamaguiProvider config={config}>
            <Base testID="target" size={size as any} />
          </TamaguiProvider>
        )
        const node = tree.getByTestId('target')
        const expected =
          size === 'xs' ? 'xs' : size === 'lg' ? 'base' : size === 'xl' ? 'lg' : 'sm'
        const rules = config.getCSS().match(/[^{}]+\{[^{}]*\}/g) ?? []
        const matching = rules.filter((rule) =>
          [...node.classList].some((cls) => rule.includes(`.${cls}{`))
        )
        expect(matching.join('\n')).toContain(
          `line-height:var(--f-lineHeight-${expected})`
        )
        tree.unmount()
      }
    )
    test(`${name} gives call-site leading precedence over a variant`, () => {
      const Component = styled(Base, { variants: { size: { sm: tokens } } } as any)
      const tree = render(
        <TamaguiProvider config={config}>
          <Component testID="target" size="sm" lineHeight="32px" />
        </TamaguiProvider>
      )
      const node = tree.getByTestId('target')
      const rules = config.getCSS().match(/[^{}]+\{[^{}]*\}/g) ?? []
      const matching = rules.filter((rule) =>
        [...node.classList].some((cls) => rule.includes(`.${cls}{`))
      )
      expect(matching.join('\n')).toContain('line-height:32px')
      tree.unmount()
    })
  }
})
