import { concatClassName } from '@tamagui/static'
import { expect, test } from 'vitest'

test(`concatClassName - leave regular`, () => {
  expect(concatClassName(`_width-10 _height-20`)).toEqual(`_width-10 _height-20`)
})

test(`concatClassName - merge regular`, () => {
  expect(concatClassName(`_width-10 _width-20`)).toEqual(`_width-20`)
})

test(`concatClassName - merge pseudo`, () => {
  expect(
    concatClassName(`_width-_pointerTouch_200vw _width-_pointerTouch_300vw`)
  ).toEqual(`_width-_pointerTouch_300vw`)
})

test(`concatClassName - leave pseudo`, () => {
  expect(
    concatClassName(`_height-_pointerTouch_200vw _width-_pointerTouch_300vw`)
  ).toEqual(`_height-_pointerTouch_200vw _width-_pointerTouch_300vw`)
})
