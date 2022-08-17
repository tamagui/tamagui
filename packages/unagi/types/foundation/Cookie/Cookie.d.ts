export declare type CookieOptions = {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Lax' | 'Strict' | 'None';
    path?: string;
    expires?: Date;
    domain?: string;
    maxAge?: number;
};
export declare class Cookie {
    name: string;
    options?: CookieOptions;
    data: Record<string, any>;
    constructor(name: string, options?: CookieOptions);
    parse(cookie: string): Record<string, any>;
    set(key: string, value: string): void;
    setAll(data: Record<string, string>): void;
    serialize(): string;
    destroy(): string;
    get expires(): number;
    setSessionid(sid: string): void;
    getSessionId(request: Request): string | null;
}
//# sourceMappingURL=Cookie.d.ts.map