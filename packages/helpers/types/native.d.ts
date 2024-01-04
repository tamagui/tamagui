export type NativePlatform = 'web' | 'mobile' | 'android' | 'ios';
export type ExplicitNativePlatform = Exclude<NativePlatform, 'mobile'>;
export type NativeValue<Platform extends NativePlatform = NativePlatform> = boolean | Platform | Platform[];
/**
 *
 * @param supportedSpecificNativeValues the platforms your component/system supports
 * @param nativeProp the platforms your user is requesting you to use
 * @returns
 */
export declare function shouldRenderNativePlatform(nativeProp?: NativeValue): ExplicitNativePlatform | null;
//# sourceMappingURL=native.d.ts.map