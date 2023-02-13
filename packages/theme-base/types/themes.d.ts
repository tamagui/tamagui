import { GeneratedThemes } from '@tamagui/create-themes';
import { colorTokens } from './tokens';
type LightColorSets = typeof colorTokens.light;
type ColorNames = keyof LightColorSets;
type ColorShades = keyof UnionToIntersection<LightColorSets[keyof LightColorSets]>;
export declare const themes: GeneratedThemes<ColorNames, ColorShades>;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export {};
//# sourceMappingURL=themes.d.ts.map