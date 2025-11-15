import type { CLIResolvedOptions } from '@tamagui/types';
export declare const build: (options: CLIResolvedOptions & {
    target?: "web" | "native" | "both";
    dir?: string;
    include?: string;
    exclude?: string;
}) => Promise<void>;
//# sourceMappingURL=build.d.ts.map