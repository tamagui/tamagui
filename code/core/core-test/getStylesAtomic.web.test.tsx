import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  createTamagui,
  getStylesAtomic,
} from '../core/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

test(`should expand webkit user-select`, () => {
  expect(
    getStylesAtomic({
      // @ts-ignore
      userSelect: 'none',
    })
  ).toMatchInlineSnapshot(`
    [
      [
        "userSelect",
        "none",
        "_ussel-none",
        undefined,
        [
          ":root ._ussel-none{user-select:none;-webkit-user-select:none;}",
        ],
      ],
    ]
  `)
})

test(`should handle decimal placement differently`, () => {
  const out = getStylesAtomic({
    left: 1.11,
    right: 11.1,
  })

  expect(out[0][StyleObjectIdentifier]).toBe(`_l-1--11px`)
  expect(out[1][StyleObjectIdentifier]).toBe(`_r-11--1px`)
})

test(`should turn columnGap into gap-column`, () => {
  const out = getStylesAtomic({
    columnGap: 10,
  })
  expect(out[0][StyleObjectRules].includes(`column-gap:10px`))
})

// test(`should be fast`, () => {
//   // need to compare it in a cpu-insensitive way, so compare to common operations

//   const start0 = performance.now()

//   function baseline() {
//     return new Array().fill(1000).map(() => {
//       return [...new Set([`${Math.random() * Math.random() * Math.random()}`])]
//     })
//   }

//   for (let i = 0; i < 100; i++) {
//     baseline()
//   }

//   const end0 = performance.now() - start0

//   console.log('end0', end0)

//   const start = performance.now()

//   function run() {
//     getStylesAtomic({
//       backgroundColor: 'red',
//       width: 100,
//       height: 200,
//       scale: 2,

//       $gtLg: {
//         backgroundColor: 'green',
//       },

//       hoverStyle: {
//         margin: 20,
//         padding: 20,
//       },
//     })
//   }

//   for (let i = 0; i < 100; i++) {
//     run()
//   }

//   console.log('took', performance.now() - start)
// })
