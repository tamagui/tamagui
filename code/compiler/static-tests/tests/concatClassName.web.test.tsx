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

test(`concatClassName - preserves distinct hashed atomic classes sharing prefix abbreviation`, () => {
  // _t-1731853650 (transition) and _t-2131811775 (translate) both start with _t-
  // but represent distinct CSS properties and rules; neither should be dropped
  expect(
    concatClassName([`_t-1731853650`, `_tx-961070088`, `_t-2131811775`, `_ty-1263730842`])
  ).toEqual(`_t-1731853650 _tx-961070088 _t-2131811775 _ty-1263730842`)

  // _mw-1000000001 (minWidth) and _mw-2000000002 (maxWidth) both start with _mw-
  expect(concatClassName([`_mw-1000000001`, `_mw-2000000002`])).toEqual(
    `_mw-1000000001 _mw-2000000002`
  )

  // _mh-1000000001 (minHeight) and _mh-2000000002 (maxHeight) both start with _mh-
  expect(concatClassName([`_mh-1000000001`, `_mh-2000000002`])).toEqual(
    `_mh-1000000001 _mh-2000000002`
  )
})

test(`concatClassName - deduplicates identical hashed atomic classes`, () => {
  expect(concatClassName([`_t-2131811775`, `_t-2131811775`])).toEqual(`_t-2131811775`)
  expect(concatClassName([`_mw-1000000001`, `_mw-1000000001`])).toEqual(`_mw-1000000001`)
})

test(`concatClassName - preserves numeric hashed atomic classes across the full hash range`, () => {
  expect(concatClassName([`_mw-0`, `_mw-9`, `_mw-463`, `_mw-999`])).toEqual(
    `_mw-0 _mw-9 _mw-463 _mw-999`
  )
  expect(concatClassName([`_mw-0`, `_mw-0`])).toEqual(`_mw-0`)
})

test(`concatClassName - keeps string property precedence beside generated identifiers`, () => {
  expect(concatClassName(`_w-1001 _w-2002`)).toEqual(`_w-2002`)
  expect(concatClassName(`_w-base`, [`_w-3003`], `_w-caller`)).toEqual(
    `_w-3003 _w-caller`
  )
})
