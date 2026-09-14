import type { GetTailwindNonStyleProps, GetTailwindRef, GetTailwindVariantProps, TailwindComponent, TailwindStyledOptions, TailwindVariantDefinitions, TailwindVariantProps } from './types';
/**
 * Class-first `styled()`. The base is a class string, variant values are class
 * strings, and the resulting component accepts `className` plus its variants —
 * never Tamagui inline style props.
 *
 * The class base and variant values are parsed once per (component, config) pair
 * by the frontend's `normalizeStaticConfig`, so authoring cost is not per render.
 */
export declare function styled<Parent extends TailwindComponent<any, any, any>, Variants extends TailwindVariantDefinitions = {}>(Component: Parent, baseClassName: string, options?: TailwindStyledOptions<Variants>): TailwindComponent<GetTailwindRef<Parent>, GetTailwindNonStyleProps<Parent>, GetTailwindVariantProps<Parent> & TailwindVariantProps<Variants>>;
export declare function styled<Parent extends TailwindComponent<any, any, any>, Variants extends TailwindVariantDefinitions = {}>(Component: Parent, options?: TailwindStyledOptions<Variants>): TailwindComponent<GetTailwindRef<Parent>, GetTailwindNonStyleProps<Parent>, GetTailwindVariantProps<Parent> & TailwindVariantProps<Variants>>;
//# sourceMappingURL=styled.d.ts.map