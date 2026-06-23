import { concatClassName } from '@tamagui/static'
import { expect, test } from 'vitest'

test(`concatClassName - leave regular`, () => {
  expect(concatClassName(`_width-10 _height-20`)).toEqual(`_width-10 _height-20`)
})

test(`concatClassName - merge regular`, () => {
  expect(concatClassName(`_width-10 _width-20`)).toEqual(`_width-20`)
})

test(`concatClassName - merge media`, () => {
  expect(
    concatClassName(`_width-_pointerTouch_200vw _width-_pointerTouch_300vw`)
  ).toEqual(`_width-_pointerTouch_300vw`)
})

test(`concatClassName - leave media`, () => {
  expect(
    concatClassName(`_height-_pointerTouch_200vw _width-_pointerTouch_300vw`)
  ).toEqual(`_height-_pointerTouch_200vw _width-_pointerTouch_300vw`)
})

test(`concatClassName - keeps base and pseudo styles for the same property`, () => {
  expect(concatClassName(`_col-0hover-color _col-color11`)).toEqual(
    `_col-0hover-color _col-color11`
  )
})

test(`concatClassName - merges duplicate pseudo styles for the same property`, () => {
  expect(concatClassName(`_col-0hover-color11 _col-0hover-color12`)).toEqual(
    `_col-0hover-color12`
  )
})

test(`concatClassName - scopes pseudo styles inside media queries`, () => {
  expect(concatClassName(`_col-_sm_0hover-color11 _col-_sm_color12`)).toEqual(
    `_col-_sm_0hover-color11 _col-_sm_color12`
  )
})

test(`concatClassName - keeps hyphenated pseudo names distinct`, () => {
  expect(concatClassName(`_col-0focus-visible-red _col-0focus-blue`)).toEqual(
    `_col-0focus-visible-red _col-0focus-blue`
  )
})

test(`concatClassName - merges duplicate hyphenated pseudo styles`, () => {
  expect(concatClassName(`_col-0focus-visible-red _col-0focus-visible-blue`)).toEqual(
    `_col-0focus-visible-blue`
  )
})

test(`concatClassName - keeps enter and exit pseudo styles distinct from base`, () => {
  expect(concatClassName(`_op-0enter-0 _op-0exit-0 _op-1`)).toEqual(
    `_op-0enter-0 _op-0exit-0 _op-1`
  )
})

test(`concatClassName - merge media queries with same property and breakpoint`, () => {
  // this is the bug: _pr-_lg_0px and _pr-_lg_260px should merge to just _pr-_lg_260px
  // because they both target the same property (pr) at the same breakpoint (lg)
  expect(concatClassName(`_pr-_lg_0px _dsp-flex _pr-_lg_260px`)).toEqual(
    `_dsp-flex _pr-_lg_260px`
  )
})

test(`concatClassName - keep media queries with different breakpoints`, () => {
  // different breakpoints should be kept
  expect(concatClassName(`_pr-_lg_0px _pr-_md_260px`)).toEqual(
    `_pr-_lg_0px _pr-_md_260px`
  )
})

test(`concatClassName - keep media queries with different properties`, () => {
  // different properties should be kept
  expect(concatClassName(`_pr-_lg_0px _pl-_lg_260px`)).toEqual(
    `_pr-_lg_0px _pl-_lg_260px`
  )
})
