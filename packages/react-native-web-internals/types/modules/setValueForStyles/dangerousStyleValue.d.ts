/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
declare function dangerousStyleValue(name: any, value: any, isCustomProperty: any): string;
export default dangerousStyleValue;
//# sourceMappingURL=dangerousStyleValue.d.ts.map