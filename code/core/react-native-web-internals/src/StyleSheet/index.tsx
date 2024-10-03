// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const staticStyleMap: WeakMap<Object, Object> = new WeakMap()

function insertRules(compiledOrderedRules) {}

function compileAndInsertAtomic(style) {}

function compileAndInsertReset(style, key) {}

/* ----- API ----- */

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

const absoluteFill = absoluteFillObject as any

/**
 * create
 */
function create(styles) {
  return styles
}

/**
 * compose
 */
function compose(style1: any, style2: any): any {
  return flatten(style1, style2)
}

/**
 * flatten
 */
export function flatten(...styles: any): { [key: string]: any } {
  return styles
    .flat()
    .flat()
    .flat()
    .flat()
    .reduce((acc, cur) => {
      if (cur) {
        Object.assign(acc, cur)
      }
      return acc
    }, {})
}

/**
 * getSheet
 */
function getSheet(): { id: string; textContent: string } {
  return {
    id: '',
    textContent: sheet.getTextContent(),
  }
}

/**
 * resolve
 */
type StyleProps = [string, { [key: string]: any } | null]
type Options = { writingDirection: 'ltr' | 'rtl' }

export default function StyleSheet(styles: any, options?: Options): StyleProps {}

StyleSheet.absoluteFill = absoluteFill
StyleSheet.absoluteFillObject = absoluteFillObject
StyleSheet.create = create
StyleSheet.compose = compose
StyleSheet.flatten = flatten
StyleSheet.getSheet = getSheet
// `hairlineWidth` is not implemented using screen density as browsers may
// round sub-pixel values down to `0`, causing the line not to be rendered.
StyleSheet.hairlineWidth = 1

export type IStyleSheet = {
  (styles: any, options?: Options): StyleProps
  absoluteFill: Object
  absoluteFillObject: Object
  create: typeof create
  compose: typeof compose
  flatten: typeof flatten
  getSheet: typeof getSheet
  hairlineWidth: number
}
