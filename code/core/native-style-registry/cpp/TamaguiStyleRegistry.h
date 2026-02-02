/**
 * TamaguiStyleRegistry.h
 *
 * Native style registry for zero-re-render theme switching.
 * Uses UIManager.updateShadowTree() available in RN 0.81+.
 *
 * Key insight from Unistyles: to survive React reconciliation,
 * we must update ShadowNodeFamily::nativeProps_DEPRECATED
 * before calling updateShadowTree().
 */

#pragma once

#include <folly/dynamic.h>
#include <jsi/jsi.h>
#include <react/renderer/uimanager/primitives.h>
#include <react/renderer/uimanager/UIManagerBinding.h>
#include <react/renderer/bridging/bridging.h>
#include <react/renderer/core/ShadowNodeFamily.h>

#include <mutex>
#include <string>
#include <unordered_map>

namespace tamagui {

using namespace facebook::react;
namespace jsi = facebook::jsi;

/**
 * Registry stats for debugging.
 */
struct RegistryStats {
  size_t viewCount;
  size_t scopeCount;
  std::string currentTheme;
};

/**
 * View entry with ShadowNodeFamily pointer for persistent updates.
 */
struct LinkedView {
  const ShadowNodeFamily* family;  // used to update nativeProps_DEPRECATED
  folly::dynamic styles;           // { themeName: { prop: value, ... }, ... }
  std::string scopeId;             // optional scope for nested themes
};

/**
 * Minimal registry that uses RN 0.81's UIManager.updateShadowTree().
 *
 * Stores: tag -> LinkedView (with ShadowNodeFamily* for persistent updates)
 * On theme change: builds tag -> new style map, updates nativeProps_DEPRECATED,
 * then calls updateShadowTree()
 *
 * Key insight: updating nativeProps_DEPRECATED ensures changes survive
 * React reconciliation.
 */
class TamaguiStyleRegistry {
public:
  static TamaguiStyleRegistry& getInstance();

  TamaguiStyleRegistry(const TamaguiStyleRegistry&) = delete;
  TamaguiStyleRegistry& operator=(const TamaguiStyleRegistry&) = delete;

  /**
   * Link a view with pre-computed theme styles.
   * Uses JSI Bridging to extract ShadowNodeFamily from the ref.
   * styles is a folly::dynamic object: { themeName: { prop: value, ... }, ... }
   */
  void link(
      jsi::Runtime& rt,
      const jsi::Value& ref,
      const folly::dynamic& styles,
      const std::string& scopeId = "");

  /**
   * Legacy link by tag (for backwards compatibility, but won't persist through reconciliation).
   */
  void linkByTag(Tag tag, const folly::dynamic& styles, const std::string& scopeId = "");

  /**
   * Unlink a view when it unmounts.
   */
  void unlink(Tag tag);

  /**
   * Set the global theme and update all linked views.
   * Uses UIManager.updateShadowTree() for efficient batch update.
   */
  void setTheme(jsi::Runtime& rt, const std::string& themeName);

  /**
   * Get current theme name.
   */
  std::string getTheme() const;

  /**
   * Set theme for a specific scope.
   */
  void setScopedTheme(
      jsi::Runtime& rt,
      const std::string& scopeId,
      const std::string& themeName);

  /**
   * Get registry stats.
   */
  RegistryStats getStats() const;

  /**
   * Reset (for testing).
   */
  void reset();

private:
  TamaguiStyleRegistry() = default;

  /**
   * Get the style for a theme from the styles map.
   * Handles __themes array for deduplication.
   */
  folly::dynamic getStyleForTheme(
      const folly::dynamic& styles,
      const std::string& themeName) const;

  mutable std::mutex _mutex;
  std::string _currentTheme = "light";

  // tag -> LinkedView (contains ShadowNodeFamily*, styles, scopeId)
  std::unordered_map<Tag, LinkedView> _linkedViews;

  // scopeId -> themeName (for nested theme contexts)
  std::unordered_map<std::string, std::string> _scopeThemes;
};

} // namespace tamagui
