/**
 * TamaguiStyleRegistry.h
 *
 * Native style registry for zero-re-render theme switching.
 * Uses UIManager.updateShadowTree() available in RN 0.81+.
 */

#pragma once

#include <folly/dynamic.h>
#include <jsi/jsi.h>
#include <react/renderer/uimanager/primitives.h>
#include <react/renderer/uimanager/UIManagerBinding.h>

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
 * Minimal registry that uses RN 0.81's UIManager.updateShadowTree().
 *
 * Stores: tag -> theme styles map
 * On theme change: builds tag -> new style map, calls updateShadowTree()
 */
class TamaguiStyleRegistry {
public:
  static TamaguiStyleRegistry& getInstance();

  TamaguiStyleRegistry(const TamaguiStyleRegistry&) = delete;
  TamaguiStyleRegistry& operator=(const TamaguiStyleRegistry&) = delete;

  /**
   * Link a view (by tag) with pre-computed theme styles.
   * styles is a folly::dynamic object: { themeName: { prop: value, ... }, ... }
   */
  void link(Tag tag, const folly::dynamic& styles, const std::string& scopeId = "");

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

  // tag -> { themeName: style, ... }
  std::unordered_map<Tag, folly::dynamic> _linkedViews;

  // tag -> scopeId
  std::unordered_map<Tag, std::string> _viewScopes;

  // scopeId -> themeName
  std::unordered_map<std::string, std::string> _scopeThemes;
};

} // namespace tamagui
