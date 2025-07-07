/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 * Handles a couple special tamagui cases
 *   - classNames can be extracted out separately
 *   - shorthands can be expanded before merging
 *   - pseudo props and variants maintain runtime order for proper priority
 *
 * Example of variant/pseudo prop ordering importance:
 *   const StyledButton = styled(Button, {
 *     pressStyle: { bg: '$blue10' },
 *     variants: {
 *       variant: {
 *         default: { pressStyle: { bg: 'red', scale: 1.05 } }
 *       }
 *     }
 *   })
 *
 *   case 1: variant first, then pressStyle
 *   <StyledButton variant='default' pressStyle={{ bg: 'orange' }} />
 *   output: {variant: 'default', pressStyle: {bg: 'orange'}}
 *
 *   case 2: pressStyle first, then variant
 *   <StyledButton pressStyle={{ bg: 'orange' }} variant='default' />
 *   output: {pressStyle: {bg: 'orange'}, variant: 'default'}
 */
type AnyRecord = Record<string, any>;
export declare const mergeProps: (a: Object, b?: Object, inverseShorthands?: AnyRecord) => AnyRecord;
export {};
//# sourceMappingURL=mergeProps.d.ts.map