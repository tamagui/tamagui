/**
 * TamaguiStyleRegistry.h
 *
 * Native style registry for zero-re-render theme switching.
 * This C++ core manages view registrations and provides theme updates
 * that bypass React's reconciliation by directly updating the ShadowTree.
 *
 * Based on Unistyles' ShadowTreeManager approach.
 */

#pragma once

#include <folly/dynamic.h>
#include <jsi/jsi.h>
#include <react/renderer/core/ShadowNode.h>
#include <react/renderer/core/ShadowNodeFamily.h>
#include <react/renderer/mounting/ShadowTree.h>
#include <react/renderer/uimanager/UIManager.h>

#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace tamagui {

using namespace facebook;
using namespace facebook::react;

/**
 * Stores pre-computed styles for each theme variant.
 * The key is the theme name (e.g., "dark", "light", "dark_blue").
 */
using ThemeStyleMap = std::unordered_map<std::string, folly::dynamic>;

/**
 * A linked ShadowNode with its theme styles.
 */
struct LinkedNode {
  const ShadowNodeFamily* family;
  ThemeStyleMap styles;
  std::string scopeId;
};

/**
 * Theme scope for nested theme support.
 */
struct ThemeScope {
  std::string name;
  std::string parentId;
  std::string currentTheme;
  std::unordered_set<std::string> viewIds;
};

/**
 * Registry stats for debugging.
 */
struct RegistryStats {
  size_t viewCount;
  size_t scopeCount;
  std::string currentTheme;
};

/**
 * Core registry that manages ShadowNode registrations and theme updates.
 * Uses the same approach as Unistyles for ShadowTree manipulation.
 */
class TamaguiStyleRegistry {
 public:
  static TamaguiStyleRegistry& getInstance();

  // prevent copying
  TamaguiStyleRegistry(const TamaguiStyleRegistry&) = delete;
  TamaguiStyleRegistry& operator=(const TamaguiStyleRegistry&) = delete;

  /**
   * Set the JSI runtime reference.
   * Must be called during module initialization.
   */
  void setRuntime(jsi::Runtime* rt);

  /**
   * Link a ShadowNode with pre-computed theme styles.
   * Called from JS when a component mounts.
   *
   * @param family The ShadowNodeFamily from the React ref
   * @param stylesJson JSON string of theme->style map
   */
  void linkShadowNode(const ShadowNodeFamily* family, const std::string& stylesJson);

  /**
   * Unlink a ShadowNode when it unmounts.
   */
  void unlinkShadowNode(const ShadowNodeFamily* family);

  /**
   * Set the global theme. Queues an update for next flush.
   */
  void setTheme(const std::string& themeName);

  /**
   * Flush pending theme changes to the ShadowTree.
   * Call this after setTheme to apply the update.
   */
  void flush();

  /**
   * Create a new theme scope for nested themes.
   */
  std::string createScope(const std::string& name, const std::string& parentScopeId = "");

  /**
   * Get current registry statistics.
   */
  RegistryStats getStats() const;

  /**
   * Reset the registry (for testing).
   */
  void reset();

 private:
  TamaguiStyleRegistry();

  using AffectedNodes = std::unordered_map<const ShadowNodeFamily*, std::unordered_set<int>>;

  /**
   * Apply theme changes to the ShadowTree.
   * Uses UIManagerBinding::getBinding(rt) like Unistyles does.
   */
  void updateShadowTree(jsi::Runtime& rt);

  /**
   * Find nodes affected by updates (for tree cloning).
   */
  AffectedNodes findAffectedNodes(
      const RootShadowNode& rootNode,
      const std::unordered_map<const ShadowNodeFamily*, folly::dynamic>& updates);

  /**
   * Clone the ShadowTree with new props.
   */
  std::shared_ptr<ShadowNode> cloneShadowTree(
      const ShadowNode& shadowNode,
      const std::unordered_map<const ShadowNodeFamily*, folly::dynamic>& updates,
      AffectedNodes& affectedNodes);

  /**
   * Compute updated props for a node.
   */
  Props::Shared computeUpdatedProps(
      const ShadowNode& shadowNode,
      const std::unordered_map<const ShadowNodeFamily*, folly::dynamic>& updates);

  /**
   * Find the style for a given theme name, handling deduplication and fallbacks.
   */
  folly::dynamic findStyleForTheme(
      const LinkedNode& node,
      const std::string& themeName) const;

  mutable std::mutex mutex_;
  jsi::Runtime* runtime_{nullptr};

  // linked nodes: ShadowNodeFamily* -> LinkedNode
  std::unordered_map<const ShadowNodeFamily*, LinkedNode> linkedNodes_;

  // scope registry: scopeId -> ThemeScope
  std::unordered_map<std::string, ThemeScope> scopes_;

  // global theme
  std::string currentTheme_{"light"};

  // pending theme change flag
  bool pendingThemeChange_{false};

  // ID counter for scope generation
  uint64_t scopeIdCounter_{0};

  // global scope ID constant
  static constexpr const char* GLOBAL_SCOPE_ID = "__global__";
};

} // namespace tamagui
