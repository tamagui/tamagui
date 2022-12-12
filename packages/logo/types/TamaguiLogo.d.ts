/// <reference types="react" />
import { ThemeName, XStackProps } from 'tamagui';
export declare const tints: ThemeName[];
export declare const logoColors: string[];
type LogoProps = {
    onHoverLetter?: (i: number) => void;
    showWords?: boolean;
    color?: string;
    downscale?: number;
    pathPrefix?: string;
    animated?: boolean;
} & XStackProps;
export declare const TamaguiLogo: import("react").ForwardRefExoticComponent<Pick<LogoProps, string | number | symbol> & import("react").RefAttributes<any>>;
export declare const LogoWords: ({ color, downscale, onHoverLetter, animated, }: {
    color?: string | undefined;
    downscale?: number | undefined;
    onHoverLetter?: any;
    animated?: boolean | undefined;
}) => JSX.Element;
export declare const LogoIcon: ({ downscale, pathPrefix }: any) => JSX.Element;
export {};
//# sourceMappingURL=TamaguiLogo.d.ts.map