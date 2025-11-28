import type { ColorProp } from './useCurrentColor';
export type IconProps = {
    width: number;
    height: number;
    color: string;
};
type IconPropsTransformer = (el: any, props: IconProps) => Record<string, any>;
/**
 * Configure how icon props are transformed before being passed to icon components.
 * This allows customization for different icon libraries that may expect different props.
 *
 * @example
 * // For a library that uses 'size' instead of width/height:
 * configureIconProps((el, props) => ({
 *   size: props.width,
 *   color: props.color,
 * }))
 */
export declare function configureIconProps(transformer: IconPropsTransformer | null): void;
export declare const useGetThemedIcon: (props: {
    color: ColorProp;
    size: number;
}) => (el: any) => any;
export {};
//# sourceMappingURL=useGetThemedIcon.d.ts.map