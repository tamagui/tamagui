package com.tamagui.registry

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.margelo.nitro.tamagui.registry.tamaguiregistryOnLoad

// no react modules: this package exists so autolinking loads the C++ library,
// which registers the TamaguiRegistry nitro hybrid on JNI_OnLoad
class TamaguiRegistryPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return null
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider { HashMap() }
  }

  companion object {
    init {
      tamaguiregistryOnLoad.initializeNative()
    }
  }
}
