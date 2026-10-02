export declare const LUCIDE_VERSION = "1.49.0";
export declare const HEROICONS_VERSION = "2.2.0";
export declare const PHOSPHOR_VERSION = "2.1.1";
export type AddIconsOptions = {
    names: string[];
    from?: string;
    weight?: string;
    variant?: string;
    out?: string;
    cwd?: string;
};
export declare function addIcons(options: AddIconsOptions): Promise<void>;
export declare function svgToComponent(name: string, svg: string): string;
//# sourceMappingURL=icons.d.ts.map