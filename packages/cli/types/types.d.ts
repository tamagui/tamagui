import { TamaguiOptions } from '@tamagui/static';
export type UserOptions = {
    root?: string;
    host?: string;
    tsconfigPath?: string;
    tamaguiOptions: Partial<TamaguiOptions>;
    debug?: boolean | 'verbose';
};
export type ResolvedOptions = {
    root: string;
    port?: number;
    host?: string;
    mode: 'development' | 'production';
    debug?: UserOptions['debug'];
    tsconfigPath: string;
    tamaguiOptions: TamaguiOptions;
    pkgJson: {
        name?: string;
        main?: string;
        module?: string;
        source?: string;
        exports?: Record<string, Record<string, string>>;
    };
    paths: {
        dotDir: string;
        conf: string;
        types: string;
    };
};
//# sourceMappingURL=types.d.ts.map