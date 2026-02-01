package com.tamagui.styleregistry

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule

/**
 * Native module for zero-re-render theme switching.
 *
 * Note: Full native implementation requires C++ JNI bindings.
 * This is the Kotlin bridge that exposes the API to JavaScript.
 */
@ReactModule(name = TamaguiStyleRegistryModule.NAME)
class TamaguiStyleRegistryModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "TamaguiStyleRegistry"

        // native method declarations (will be implemented in C++)
        init {
            try {
                System.loadLibrary("tamagui_styleregistry")
            } catch (e: UnsatisfiedLinkError) {
                // native library not available, will use JS fallback
            }
        }
    }

    override fun getName(): String = NAME

    // view registry
    private val views = mutableMapOf<String, ViewRegistration>()
    private val scopes = mutableMapOf<String, ThemeScope>()
    private var currentTheme = "light"
    private var scopeIdCounter = 0L

    private val GLOBAL_SCOPE_ID = "__global__"

    init {
        scopes[GLOBAL_SCOPE_ID] = ThemeScope("global", "", "light", mutableSetOf())
    }

    @ReactMethod
    fun register(viewId: String, stylesJson: String, scopeId: String?) {
        // in full implementation, this would call native code
        // for now, store in Kotlin for JS fallback compatibility
        val effectiveScopeId = scopeId ?: GLOBAL_SCOPE_ID
        views[viewId] = ViewRegistration(0, stylesJson, effectiveScopeId)
        scopes[effectiveScopeId]?.viewIds?.add(viewId)
    }

    @ReactMethod
    fun setNativeTag(viewId: String, tag: Double) {
        views[viewId]?.tag = tag.toInt()
    }

    @ReactMethod
    fun unregister(viewId: String) {
        val registration = views.remove(viewId) ?: return
        scopes[registration.scopeId]?.viewIds?.remove(viewId)
    }

    @ReactMethod
    fun setTheme(themeName: String) {
        if (currentTheme == themeName) return
        currentTheme = themeName
        scopes[GLOBAL_SCOPE_ID]?.currentTheme = themeName
        // in full implementation, this would call native code to update ShadowTree
    }

    @ReactMethod
    fun setThemeForScope(scopeId: String, themeName: String) {
        val scope = scopes[scopeId] ?: return
        if (scope.currentTheme == themeName) return
        scope.currentTheme = themeName
        // in full implementation, this would call native code to update ShadowTree
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun createScope(name: String, parentScopeId: String?): String {
        val scopeId = "scope_${++scopeIdCounter}"
        val effectiveParentId = parentScopeId ?: GLOBAL_SCOPE_ID
        val inheritedTheme = scopes[effectiveParentId]?.currentTheme ?: currentTheme

        scopes[scopeId] = ThemeScope(name, effectiveParentId, inheritedTheme, mutableSetOf())
        return scopeId
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getStats(): WritableNativeMap {
        return WritableNativeMap().apply {
            putInt("viewCount", views.size)
            putInt("scopeCount", scopes.size)
            putString("currentTheme", currentTheme)
        }
    }

    private data class ViewRegistration(
        var tag: Int,
        val stylesJson: String,
        val scopeId: String
    )

    private data class ThemeScope(
        val name: String,
        val parentId: String,
        var currentTheme: String,
        val viewIds: MutableSet<String>
    )
}
