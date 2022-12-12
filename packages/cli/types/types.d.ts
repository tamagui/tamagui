import { TamaguiOptions } from '@tamagui/static';
export declare type UserOptions = {
    root?: string;
    host?: string;
    tsconfigPath?: string;
    tamaguiOptions: Partial<TamaguiOptions>;
    debug?: boolean | 'verbose';
};
export declare type ResolvedOptions = {
    root: string;
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