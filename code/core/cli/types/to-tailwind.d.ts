type ToTailwindOptions = {
    patterns: string[];
    write?: boolean;
    cwd?: string;
};
type ToTailwindResult = {
    files: number;
    changed: number;
    written: number;
};
export declare function toTailwind({ patterns, write, cwd, }: ToTailwindOptions): Promise<ToTailwindResult>;
export {};
//# sourceMappingURL=to-tailwind.d.ts.map