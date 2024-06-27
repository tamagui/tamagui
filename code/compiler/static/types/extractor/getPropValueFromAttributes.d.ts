import * as t from '@babel/types';
/**
 * getPropValueFromAttributes gets a prop by name from a list of attributes and accounts for potential spread operators.
 * Here's an example. Given this component:
 * ```
 * <Block coolProp="wow" {...spread1} neatProp="ok" {...spread2} />```
 * getPropValueFromAttributes will return the following:
 * - for propName `coolProp`:
 *   ```
 * accessSafe(spread1, 'coolProp') || accessSafe(spread2, 'coolProp') || 'wow'```
 * - for propName `neatProp`:
 *   ```
 * accessSafe(spread2, 'neatProp') || 'ok'```
 * - for propName `notPresent`: `null`
 *
 * The returned value should (obviously) be placed after spread operators.
 */
export declare function getPropValueFromAttributes(propName: string, attrs: (t.JSXAttribute | t.JSXSpreadAttribute)[]): t.Expression | null;
//# sourceMappingURL=getPropValueFromAttributes.d.ts.map