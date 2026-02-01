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
#endif

NS_ASSUME_NONNULL_BEGIN

@interface TamaguiStyleRegistry : NSObject <
#ifdef RCT_NEW_ARCH_ENABLED
    NativeTamaguiStyleRegistrySpec,
#endif
    RCTBridgeModule,
    RCTInitializing>

@end

NS_ASSUME_NONNULL_END
