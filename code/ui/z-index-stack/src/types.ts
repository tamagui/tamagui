/**
 * Tamagui will attempt to stack z-index in a smart way when true, it does this
 * by automatically increasing z-index both horizontally and vertically in the component tree.
 *
 * Basically - if two stackable items are at the same level, then the order of mounting
 * determines their z-index (later is higher). This is the horizontal logic.
 *
 * Below a stackable item, the z-index will always be above that specific item, but below
 * other horizontal items that come after it.
 *
 * - false will avoid the stacking behavior.
 * - number will keep the behavior, but add to the stacked z-index the given amount
 * - 'global' will not stack things vertically and instead only stack them horizontally
 *
 */
export type StackZIndexProp = boolean | number | 'global'
