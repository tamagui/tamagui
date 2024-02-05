export type NativePlatform = 'web' | 'mobile' | 'android' | 'ios';
export type ExplicitNativePlatform = Exclude<NativePlatform, 'mobile'>;
export type NativeValue<Platform extends NativePlatform = NativePlatform> = boolean | Platform | Platform[];
/**
 *
 * takes in what user has inputted the native-supporting component and returns the name of the native platform we should render
 *
 * @example ['android'] => 'android' (when current platform is android)
 * @example ['android'] => null      (when current platform is not android)
 * @example ['mobile']  => 'ios'     (when current platform is ios)
 *
 * @param supportedSpecificNativeValues the platforms your component/system supports
 * @param nativeProp the platforms your user is requesting you to use
 * @returns
 */
export declare function shouldRenderNativePlatform(nativeProp?: NativeValue): ExplicitNativePlatform | null;
//# sourceMappingURL=shouldRenderNativePlatform.d.ts.map