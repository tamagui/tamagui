/**
 * TamaguiStyleRegistry.mm
 *
 * iOS TurboModule bridge to the C++ TamaguiStyleRegistry.
 * Requires RN 0.81+ with New Architecture enabled.
 *
 * Installs JSI functions for direct ref access:
 * - __tamaguiLinkView(ref, stylesJson, scopeId) - links a view with ShadowNodeFamily persistence
 */

#import "TamaguiStyleRegistry.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTLog.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTSurfacePresenter.h>
#import <react/renderer/uimanager/UIManager.h>
#import <folly/json.h>
#import "../cpp/TamaguiStyleRegistry.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
// static storage for runtime pointer
static void* _storedRuntime = nullptr;
static bool _jsiBindingsInstalled = false;
#endif

@implementation TamaguiStyleRegistry

// synthesize bridge property from RCTBridgeModule protocol
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

#ifdef RCT_NEW_ARCH_ENABLED
/**
 * Install JSI bindings.
 * For now, we don't install any JSI functions - we use the tag-based approach
 * through the TurboModule bridge.
 */
+ (void)installJSIBindings:(facebook::jsi::Runtime&)rt {
  if (_jsiBindingsInstalled) {
    return;
  }

  NSLog(@"[TamaguiStyleRegistry] JSI bindings (no-op for now)");
  _jsiBindingsInstalled = true;
  NSLog(@"[TamaguiStyleRegistry] JSI bindings installed");
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
+ (void)setRuntime:(void *)runtime {
  _storedRuntime = runtime;
  NSLog(@"[TamaguiStyleRegistry] Runtime stored: %p", runtime);
}

+ (void *)getRuntime {
  return _storedRuntime;
}
#endif

- (instancetype)init {
  if (self = [super init]) {
    NSLog(@"[TamaguiStyleRegistry] init called - module instance created");
#ifdef RCT_NEW_ARCH_ENABLED
    NSLog(@"[TamaguiStyleRegistry] RCT_NEW_ARCH_ENABLED is defined");
#else
    NSLog(@"[TamaguiStyleRegistry] RCT_NEW_ARCH_ENABLED is NOT defined - TurboModule disabled");
#endif
  }
  return self;
}

#pragma mark - Native module methods

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(installBindings) {
#ifdef RCT_NEW_ARCH_ENABLED
  // in New Architecture (bridgeless), we can't directly access the runtime from here
  // the JSI bindings will be installed on first setTheme call instead
  // return YES to indicate we're in New Arch mode (bindings will be installed lazily)
  NSLog(@"[TamaguiStyleRegistry] installBindings called - will install lazily on first setTheme");
  return @YES;
#else
  return @NO;
#endif
}

RCT_EXPORT_METHOD(link:(double)tag
                  stylesJson:(NSString *)stylesJson
                  scopeId:(NSString * _Nullable)scopeId) {
#ifdef RCT_NEW_ARCH_ENABLED
  // this is the legacy tag-based link (won't persist through reconciliation)
  // prefer using __tamaguiLinkView JSI function for full ShadowNodeFamily support
  try {
    auto styles = folly::parseJson([stylesJson UTF8String]);
    tamagui::TamaguiStyleRegistry::getInstance().linkByTag(
        static_cast<facebook::react::Tag>(tag),
        styles,
        scopeId ? [scopeId UTF8String] : "");
  } catch (const std::exception& e) {
    RCTLogError(@"TamaguiStyleRegistry: Failed to parse styles: %s", e.what());
  }
#else
  RCTLogWarn(@"TamaguiStyleRegistry: Native module only available with New Architecture");
#endif
}

RCT_EXPORT_METHOD(unlink:(double)tag) {
#ifdef RCT_NEW_ARCH_ENABLED
  tamagui::TamaguiStyleRegistry::getInstance().unlink(
      static_cast<facebook::react::Tag>(tag));
#endif
}

RCT_EXPORT_METHOD(setTheme:(NSString *)themeName) {
#ifdef RCT_NEW_ARCH_ENABLED
  NSLog(@"[TamaguiStyleRegistry] setTheme called with: %@", themeName);

  // get the runtime from the bridge
  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;

  if (cxxBridge && cxxBridge.runtime) {
    auto& rt = *reinterpret_cast<facebook::jsi::Runtime*>(cxxBridge.runtime);

    // install JSI bindings on first call (lazy initialization)
    [TamaguiStyleRegistry installJSIBindings:rt];

    NSLog(@"[TamaguiStyleRegistry] calling C++ setTheme");
    tamagui::TamaguiStyleRegistry::getInstance().setTheme(rt, [themeName UTF8String]);
    NSLog(@"[TamaguiStyleRegistry] C++ setTheme completed");
  } else {
    NSLog(@"[TamaguiStyleRegistry] ERROR: No bridge or runtime available!");
  }
#endif
}

RCT_EXPORT_METHOD(setScopedTheme:(NSString *)scopeId
                  themeName:(NSString *)themeName) {
#ifdef RCT_NEW_ARCH_ENABLED
  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
  if (cxxBridge && cxxBridge.runtime) {
    auto& rt = *reinterpret_cast<facebook::jsi::Runtime*>(cxxBridge.runtime);
    tamagui::TamaguiStyleRegistry::getInstance().setScopedTheme(
        rt,
        [scopeId UTF8String],
        [themeName UTF8String]);
  }
#endif
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTheme) {
#ifdef RCT_NEW_ARCH_ENABLED
  std::string theme = tamagui::TamaguiStyleRegistry::getInstance().getTheme();
  return [NSString stringWithUTF8String:theme.c_str()];
#else
  return @"light";
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

#pragma mark - Bridge setup and initialization

- (void)initialize {
  // RCTInitializing protocol - called after module instantiation
  NSLog(@"[TamaguiStyleRegistry] initialize called, bridge: %@", self.bridge);
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeTamaguiStyleRegistrySpecJSI>(params);
}
#endif

@end
