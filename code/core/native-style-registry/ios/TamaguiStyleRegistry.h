/**
 * TamaguiStyleRegistry.h
 *
 * iOS bridge for the native style registry TurboModule.
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTInitializing.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTSurfacePresenterStub.h>
#import <rnstyleregistry/rnstyleregistry.h>
#import <ReactCommon/RCTTurboModule.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface TamaguiStyleRegistry : NSObject <
#ifdef RCT_NEW_ARCH_ENABLED
    NativeTamaguiStyleRegistrySpec,
    RCTTurboModule,
#endif
    RCTBridgeModule,
    RCTInitializing>

#ifdef RCT_NEW_ARCH_ENABLED
// store runtime pointer for setTheme calls
+ (void)setRuntime:(void *)runtime;
+ (void *)getRuntime;
#endif

@end

NS_ASSUME_NONNULL_END
