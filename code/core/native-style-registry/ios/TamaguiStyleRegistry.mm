/**
 * TamaguiStyleRegistry.mm
 *
 * iOS implementation of the native style registry.
 */

#import "TamaguiStyleRegistry.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTLog.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTScheduler.h>
#import <React/RCTSurfacePresenter.h>
#import <react/renderer/uimanager/UIManager.h>
#import <TamaguiStyleRegistry/TamaguiStyleRegistry.h>
#endif

using namespace facebook::react;

@implementation TamaguiStyleRegistry {
#ifdef RCT_NEW_ARCH_ENABLED
  __weak id<RCTSurfacePresenterStub> _surfacePresenter;
  BOOL _initialized;
#endif
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (void)initialize {
#ifdef RCT_NEW_ARCH_ENABLED
  if (_initialized) {
    return;
  }

  if (_surfacePresenter) {
    RCTScheduler *scheduler = [(RCTSurfacePresenter *)_surfacePresenter scheduler];
    if (scheduler && scheduler.uiManager) {
      auto uiManager = scheduler.uiManager;
      tamagui::TamaguiStyleRegistry::getInstance().initialize(uiManager);
      _initialized = YES;
      RCTLogInfo(@"TamaguiStyleRegistry: Initialized with UIManager");
    }
  }
#endif
}

#pragma mark - Bridgeless mode setup

- (void)setSurfacePresenter:(id<RCTSurfacePresenterStub>)surfacePresenter {
#ifdef RCT_NEW_ARCH_ENABLED
  _surfacePresenter = surfacePresenter;
#endif
}

#pragma mark - Native module methods

RCT_EXPORT_METHOD(register:(NSString *)viewId
                  stylesJson:(NSString *)stylesJson
                  scopeId:(NSString * _Nullable)scopeId) {
#ifdef RCT_NEW_ARCH_ENABLED
  // note: we need the native tag, but in the new architecture
  // this requires additional setup. for now, we use a placeholder
  // and will need to get the tag from the JS side
  tamagui::TamaguiStyleRegistry::getInstance().registerView(
      [viewId UTF8String],
      0, // tag will be set via setNativeTag method
      [stylesJson UTF8String],
      scopeId ? [scopeId UTF8String] : "");
#else
  RCTLogWarn(@"TamaguiStyleRegistry: Native module only available with New Architecture");
#endif
}

RCT_EXPORT_METHOD(setNativeTag:(NSString *)viewId
                  tag:(double)tag) {
#ifdef RCT_NEW_ARCH_ENABLED
  // update the tag for a registered view
  // this is called from JS after the view mounts
  // (implementation would need registry method to update tag)
  RCTLogInfo(@"TamaguiStyleRegistry: setNativeTag %@ -> %f", viewId, tag);
#endif
}

RCT_EXPORT_METHOD(unregister:(NSString *)viewId) {
#ifdef RCT_NEW_ARCH_ENABLED
  tamagui::TamaguiStyleRegistry::getInstance().unregisterView([viewId UTF8String]);
#endif
}

RCT_EXPORT_METHOD(setTheme:(NSString *)themeName) {
#ifdef RCT_NEW_ARCH_ENABLED
  tamagui::TamaguiStyleRegistry::getInstance().setTheme([themeName UTF8String]);
#endif
}

RCT_EXPORT_METHOD(setThemeForScope:(NSString *)scopeId
                  themeName:(NSString *)themeName) {
#ifdef RCT_NEW_ARCH_ENABLED
  tamagui::TamaguiStyleRegistry::getInstance().setThemeForScope(
      [scopeId UTF8String],
      [themeName UTF8String]);
#endif
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(createScope:(NSString *)name
                                        parentScopeId:(NSString * _Nullable)parentScopeId) {
#ifdef RCT_NEW_ARCH_ENABLED
  std::string scopeId = tamagui::TamaguiStyleRegistry::getInstance().createScope(
      [name UTF8String],
      parentScopeId ? [parentScopeId UTF8String] : "");
  return [NSString stringWithUTF8String:scopeId.c_str()];
#else
  return @"";
#endif
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getStats) {
#ifdef RCT_NEW_ARCH_ENABLED
  auto stats = tamagui::TamaguiStyleRegistry::getInstance().getStats();
  return @{
    @"viewCount": @(stats.viewCount),
    @"scopeCount": @(stats.scopeCount),
    @"currentTheme": [NSString stringWithUTF8String:stats.currentTheme.c_str()]
  };
#else
  return @{
    @"viewCount": @0,
    @"scopeCount": @0,
    @"currentTheme": @"light"
  };
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeTamaguiStyleRegistrySpecJSI>(params);
}
#endif

@end
