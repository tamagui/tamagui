export interface Axis {
  min: number
  max: number
}

export interface Box {
  x: Axis
  y: Axis
}

export type VariantLabels = string | string[]

/**
 * @public
 */
export interface AnimatePresenceProps {
  /**
   * By passing `initial={false}`, `AnimatePresence` will disable any initial animations on children
   * that are present when the component is first rendered.
   *
   * ```jsx
   * <AnimatePresence initial={false}>
   *   {isVisible && (
   *     <motion.div
   *       key="modal"
   *       initial={{ opacity: 0 }}
   *       animate={{ opacity: 1 }}
   *       exit={{ opacity: 0 }}
   *     />
   *   )}
   * </AnimatePresence>
   * ```
   *
   * @public
   */
  initial?: boolean

  /**
   * When a component is removed, there's no longer a chance to update its props directly. So if you need to update
   * a variant for that component as it renders for the exit animation, set `custom` to an object value that
   * is applied to the animating childrens props before they render once more to determine their final exit styles.
   *
   * The custom value must be JSON.stringify-able!
   * This lets us memoize it and use it across workers for some animationd drivers.
   *
   * ```tsx
   * <AnimatePresence custom={{ direction: 10 }}>
   *   {isVisible && <Child />}
   * </AnimatePresence>
   *
   * const Child = styled(View, { variants: { direction: ... } })
   * ```
   *
   * @public
   */
  custom?: Object

  /**
   * Fires when all exiting nodes have completed animating out.
   *
   * @public
   */
  onExitComplete?: () => void

  /**
   * If set to `true`, `AnimatePresence` will only render one component at a time. The exiting component
   * will finish its exit animation before the entering component is rendered.
   *
   * ```jsx
   * const MyComponent = ({ currentItem }) => (
   *   <AnimatePresence exitBeforeEnter>
   *     <motion.div key={currentItem} exit={{ opacity: 0 }} />
   *   </AnimatePresence>
   * )
   * ```
   *
   * @beta
   */
  exitBeforeEnter?: boolean

  /**
   * Used in Framer to flag that sibling children *shouldn't* re-render as a result of a
   * child being removed.
   *
   * @internal
   */
  presenceAffectsLayout?: boolean

  /**
   * @deprecated use `custom` passing it an Object instead
   */
  exitVariant?: string | null

  /**
   * @deprecated use `custom` passing it an Object instead
   */
  enterVariant?: string | null

  /**
   * Will use a variant on the child component and apply the true styles for when its entering, false styles for when its exiting
   * @deprecated use `custom` passing it an Object instead
   */
  enterExitVariant?: string | null
}
