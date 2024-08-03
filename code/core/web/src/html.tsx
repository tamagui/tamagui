import React from 'react'
import type {
  ComponentProps,
  ForwardRefExoticComponent,
  RefAttributes,
  PropsWithoutRef,
  CSSProperties,
} from 'react'
import type { StaticConfig, WithThemeShorthandsPseudosMedia } from './types'

type JSXIntrisicComponenProps<
  T extends keyof JSX.IntrinsicElements,
  P = Pick<ComponentProps<T>, Exclude<keyof ComponentProps<T>, 'key' | 'ref'>>,
> = P

type TypeFromRefType<
  RefType extends { current: any } | undefined | string | null | Function,
  P = Exclude<Exclude<RefType, undefined | string | null | Function>['current'], null>,
> = P

// type JSXIntrisicComponenRef<
//   T extends keyof JSX.IntrinsicElements,
//   P = TypeFromRefType<ComponentProps<T>['ref']>,
// > = P

// function createHTMLFromString<TAG extends keyof JSX.IntrinsicElements>(TagName: TAG) {
//   type T = TypeFromRefType<JSX.IntrinsicElements[TAG]['ref']>
//   type P = JSXIntrisicComponenProps<TAG>
//   type Component = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> & {
//     staticConfig?: StaticConfig
//     name: string
//   }
//   type StyledProps = WithThemeShorthandsPseudosMedia<CSSProperties>
//   type TamaguiMeta = {
//     __tama: [
//       StyledProps, // Props
//       T, // Ref
//       P, // NonStyledProps
//       {}, // BaseStyles
//       {}, // Variants
//       {}, // ParentStaticProperties
//     ]
//   }
//   return TagName as unknown as Component & TamaguiMeta
// }

function createHTML<TAG extends keyof JSX.IntrinsicElements>(TagName: TAG) {
  type T = TypeFromRefType<JSX.IntrinsicElements[TAG]['ref']>
  type P = JSXIntrisicComponenProps<TAG>
  type Component = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> & {
    staticConfig?: StaticConfig
    name: string
  }
  type StyledProps = WithThemeShorthandsPseudosMedia<CSSProperties>
  type TamaguiMeta = {
    __tama: [
      StyledProps, // Props
      T, // Ref
      P, // NonStyledProps
      StyledProps, // BaseStyles
      {}, // Variants
      {}, // ParentStaticProperties
    ]
  }

  const component: Component = React.forwardRef<T, P>(
    (props: P, forwardedRef: React.ForwardedRef<T>) => {
      // console.log("=> rendering:", TagName)
      const TagComponent = TagName as unknown as React.FunctionComponent<P>
      return <TagComponent {...props} ref={forwardedRef} />
    }
  )
  component.staticConfig = {
    componentName: TagName,
    Component: component as any,
    isText: true,
    acceptsClassName: true,
  }
  component.name = TagName
  component.displayName = TagName
  return component as Component & TamaguiMeta
}

export const a = createHTML('a')
export const abbr = createHTML('abbr')
export const address = createHTML('address')
export const area = createHTML('area')
export const article = createHTML('article')
export const aside = createHTML('aside')
export const audio = createHTML('audio')
export const b = createHTML('b')
export const base = createHTML('base')
export const bdi = createHTML('bdi')
export const bdo = createHTML('bdo')
export const big = createHTML('big')
export const blockquote = createHTML('blockquote')
export const body = createHTML('body')
export const br = createHTML('br')
export const button = createHTML('button')
export const canvas = createHTML('canvas')
export const caption = createHTML('caption')
export const center = createHTML('center')
export const cite = createHTML('cite')
export const code = createHTML('code')
export const col = createHTML('col')
export const colgroup = createHTML('colgroup')
export const data = createHTML('data')
export const datalist = createHTML('datalist')
export const dd = createHTML('dd')
export const del = createHTML('del')
export const details = createHTML('details')
export const dfn = createHTML('dfn')
export const dialog = createHTML('dialog')
export const div = createHTML('div')
export const dl = createHTML('dl')
export const dt = createHTML('dt')
export const em = createHTML('em')
export const embed = createHTML('embed')
export const fieldset = createHTML('fieldset')
export const figcaption = createHTML('figcaption')
export const figure = createHTML('figure')
export const footer = createHTML('footer')
export const form = createHTML('form')
export const h1 = createHTML('h1')
export const h2 = createHTML('h2')
export const h3 = createHTML('h3')
export const h4 = createHTML('h4')
export const h5 = createHTML('h5')
export const h6 = createHTML('h6')
export const head = createHTML('head')
export const header = createHTML('header')
export const hgroup = createHTML('hgroup')
export const hr = createHTML('hr')
export const html = createHTML('html')
export const i = createHTML('i')
export const iframe = createHTML('iframe')
export const img = createHTML('img')
export const input = createHTML('input')
export const ins = createHTML('ins')
export const kbd = createHTML('kbd')
export const keygen = createHTML('keygen')
export const label = createHTML('label')
export const legend = createHTML('legend')
export const li = createHTML('li')
export const link = createHTML('link')
export const main = createHTML('main')
export const map = createHTML('map')
export const mark = createHTML('mark')
export const menu = createHTML('menu')
export const menuitem = createHTML('menuitem')
export const meta = createHTML('meta')
export const meter = createHTML('meter')
export const nav = createHTML('nav')
export const noindex = createHTML('noindex')
export const noscript = createHTML('noscript')
export const object = createHTML('object')
export const ol = createHTML('ol')
export const optgroup = createHTML('optgroup')
export const option = createHTML('option')
export const output = createHTML('output')
export const p = createHTML('p')
export const param = createHTML('param')
export const picture = createHTML('picture')
export const pre = createHTML('pre')
export const progress = createHTML('progress')
export const q = createHTML('q')
export const rp = createHTML('rp')
export const rt = createHTML('rt')
export const ruby = createHTML('ruby')
export const s = createHTML('s')
export const samp = createHTML('samp')
export const search = createHTML('search')
export const slot = createHTML('slot')
export const script = createHTML('script')
export const section = createHTML('section')
export const select = createHTML('select')
export const small = createHTML('small')
export const source = createHTML('source')
export const span = createHTML('span')
export const strong = createHTML('strong')
export const style = createHTML('style')
export const sub = createHTML('sub')
export const summary = createHTML('summary')
export const sup = createHTML('sup')
export const table = createHTML('table')
export const template = createHTML('template')
export const tbody = createHTML('tbody')
export const td = createHTML('td')
export const textarea = createHTML('textarea')
export const tfoot = createHTML('tfoot')
export const th = createHTML('th')
export const thead = createHTML('thead')
export const time = createHTML('time')
export const title = createHTML('title')
export const tr = createHTML('tr')
export const track = createHTML('track')
export const u = createHTML('u')
export const ul = createHTML('ul')
const var_ = createHTML('var')
export { var_ as var }
export const video = createHTML('video')
export const wbr = createHTML('wbr')
export const webview = createHTML('webview')
export const svg = createHTML('svg')
export const animate = createHTML('animate')
export const animateMotion = createHTML('animateMotion')
export const animateTransform = createHTML('animateTransform')
export const circle = createHTML('circle')
export const clipPath = createHTML('clipPath')
export const defs = createHTML('defs')
export const desc = createHTML('desc')
export const ellipse = createHTML('ellipse')
export const feBlend = createHTML('feBlend')
export const feColorMatrix = createHTML('feColorMatrix')
export const feComponentTransfer = createHTML('feComponentTransfer')
export const feComposite = createHTML('feComposite')
export const feConvolveMatrix = createHTML('feConvolveMatrix')
export const feDiffuseLighting = createHTML('feDiffuseLighting')
export const feDisplacementMap = createHTML('feDisplacementMap')
export const feDistantLight = createHTML('feDistantLight')
export const feDropShadow = createHTML('feDropShadow')
export const feFlood = createHTML('feFlood')
export const feFuncA = createHTML('feFuncA')
export const feFuncB = createHTML('feFuncB')
export const feFuncG = createHTML('feFuncG')
export const feFuncR = createHTML('feFuncR')
export const feGaussianBlur = createHTML('feGaussianBlur')
export const feImage = createHTML('feImage')
export const feMerge = createHTML('feMerge')
export const feMergeNode = createHTML('feMergeNode')
export const feMorphology = createHTML('feMorphology')
export const feOffset = createHTML('feOffset')
export const fePointLight = createHTML('fePointLight')
export const feSpecularLighting = createHTML('feSpecularLighting')
export const feSpotLight = createHTML('feSpotLight')
export const feTile = createHTML('feTile')
export const feTurbulence = createHTML('feTurbulence')
export const filter = createHTML('filter')
export const foreignObject = createHTML('foreignObject')
export const g = createHTML('g')
export const image = createHTML('image')
export const line = createHTML('line')
export const linearGradient = createHTML('linearGradient')
export const marker = createHTML('marker')
export const mask = createHTML('mask')
export const metadata = createHTML('metadata')
export const mpath = createHTML('mpath')
export const path = createHTML('path')
export const pattern = createHTML('pattern')
export const polygon = createHTML('polygon')
export const polyline = createHTML('polyline')
export const radialGradient = createHTML('radialGradient')
export const rect = createHTML('rect')
export const stop = createHTML('stop')
const switch_ = createHTML('switch')
export { switch_ as switch }
export const symbol = createHTML('symbol')
export const text = createHTML('text')
export const textPath = createHTML('textPath')
export const tspan = createHTML('tspan')
export const use = createHTML('use')
export const view = createHTML('view')
