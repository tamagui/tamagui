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

test(`concatClassName - merge media queries with same property and breakpoint`, () => {
  // this is the bug: _pr-_lg_0px and _pr-_lg_260px should merge to just _pr-_lg_260px
  // because they both target the same property (pr) at the same breakpoint (lg)
  expect(
    concatClassName(`_pr-_lg_0px _dsp-flex _pr-_lg_260px`)
  ).toEqual(`_dsp-flex _pr-_lg_260px`)
})

test(`concatClassName - keep media queries with different breakpoints`, () => {
  // different breakpoints should be kept
  expect(
    concatClassName(`_pr-_lg_0px _pr-_md_260px`)
  ).toEqual(`_pr-_lg_0px _pr-_md_260px`)
})

test(`concatClassName - keep media queries with different properties`, () => {
  // different properties should be kept
  expect(
    concatClassName(`_pr-_lg_0px _pl-_lg_260px`)
  ).toEqual(`_pr-_lg_0px _pl-_lg_260px`)
})
