type ToTailwindOptions = {
    patterns: string[];
    write?: boolean;
    cwd?: string;
    configPath?: string;
    useDefaultConfig?: boolean;
    renameDom?: boolean;
};
type ToTailwindResult = {
    files: number;
    changed: number;
    written: number;
};
export declare function toTailwind({ patterns, write, cwd, configPath, useDefaultConfig, renameDom, }: ToTailwindOptions): Promise<ToTailwindResult>;
export {};
//# sourceMappingURL=to-tailwind.d.ts.map