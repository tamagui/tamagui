/**
 * TamaguiStyleRegistry.cpp
 *
 * Implementation of the native style registry.
 * Based on Unistyles' ShadowTreeManager approach.
 */

#include "TamaguiStyleRegistry.h"

#include <folly/json.h>
#include <glog/logging.h>
#include <react/renderer/uimanager/UIManagerBinding.h>
#include <cxxreact/ReactNativeVersion.h>

namespace tamagui {

using namespace facebook::react;

TamaguiStyleRegistry& TamaguiStyleRegistry::getInstance() {
  static TamaguiStyleRegistry instance;
  return instance;
}

TamaguiStyleRegistry::TamaguiStyleRegistry() {
  // initialize global scope
  scopes_[GLOBAL_SCOPE_ID] = ThemeScope{
      .name = "global",
      .parentId = "",
      .currentTheme = "light",
      .viewIds = {}};
}

void TamaguiStyleRegistry::setRuntime(jsi::Runtime* rt) {
  std::lock_guard<std::mutex> lock(mutex_);
  runtime_ = rt;
}

void TamaguiStyleRegistry::linkShadowNode(
    const ShadowNodeFamily* family,
    const std::string& stylesJson) {
  std::lock_guard<std::mutex> lock(mutex_);

  // parse styles JSON
  ThemeStyleMap styles;

  try {
    auto parsed = folly::parseJson(stylesJson);
    if (parsed.isObject()) {
      for (const auto& [themeName, style] : parsed.items()) {
        styles[themeName.asString()] = style;
      }
    }
  } catch (const std::exception& e) {
    LOG(ERROR) << "TamaguiStyleRegistry: Failed to parse styles JSON: " << e.what();
    return;
  }

  // store registration
  linkedNodes_[family] = LinkedNode{
      .family = family,
      .styles = std::move(styles),
      .scopeId = GLOBAL_SCOPE_ID};
}

void TamaguiStyleRegistry::unlinkShadowNode(const ShadowNodeFamily* family) {
  std::lock_guard<std::mutex> lock(mutex_);
  linkedNodes_.erase(family);
}

void TamaguiStyleRegistry::setTheme(const std::string& themeName) {
  std::lock_guard<std::mutex> lock(mutex_);

  if (currentTheme_ == themeName) {
    return; // no change
  }

  currentTheme_ = themeName;
  scopes_[GLOBAL_SCOPE_ID].currentTheme = themeName;

  // queue update
  pendingThemeChange_ = true;
}

void TamaguiStyleRegistry::flush() {
  std::lock_guard<std::mutex> lock(mutex_);

  if (!pendingThemeChange_ || !runtime_) {
    return;
  }

  pendingThemeChange_ = false;
  updateShadowTree(*runtime_);
}

void TamaguiStyleRegistry::updateShadowTree(jsi::Runtime& rt) {
  if (linkedNodes_.empty()) {
    return;
  }

  // collect updates: family -> new props
  std::unordered_map<const ShadowNodeFamily*, folly::dynamic> updates;

  for (const auto& [family, node] : linkedNodes_) {
    auto style = findStyleForTheme(node, currentTheme_);
    if (!style.empty()) {
      // wrap in "style" prop
      updates[family] = folly::dynamic::object("style", style);
    }
  }

  if (updates.empty()) {
    return;
  }

#if REACT_NATIVE_VERSION_MINOR >= 81
  // RN 0.81+ has updateShadowTree API
  std::unordered_map<Tag, folly::dynamic> tagToProps;

  for (const auto& [family, props] : updates) {
    tagToProps.insert({family->getTag(), props});

    // persist props on family (like Unistyles/Reanimated do)
    auto* mutableFamily = const_cast<ShadowNodeFamily*>(family);
    if (mutableFamily->nativeProps_DEPRECATED) {
      mutableFamily->nativeProps_DEPRECATED->update(props);
    } else {
      mutableFamily->nativeProps_DEPRECATED = std::make_unique<folly::dynamic>(props);
    }
  }

  UIManagerBinding::getBinding(rt)->getUIManager().updateShadowTree(std::move(tagToProps));
#else
  // older RN - need to clone shadow tree manually
  const auto& shadowTreeRegistry = UIManagerBinding::getBinding(rt)->getUIManager().getShadowTreeRegistry();

  shadowTreeRegistry.enumerate([this, &updates](const ShadowTree& shadowTree, bool& stop) {
    auto transaction = [this, &updates](const RootShadowNode& oldRootShadowNode) {
      auto affectedNodes = findAffectedNodes(oldRootShadowNode, updates);

      // persist props on families
      for (const auto& [family, props] : updates) {
        auto* mutableFamily = const_cast<ShadowNodeFamily*>(family);
        if (mutableFamily->nativeProps_DEPRECATED) {
          mutableFamily->nativeProps_DEPRECATED->update(props);
        } else {
          mutableFamily->nativeProps_DEPRECATED = std::make_unique<folly::dynamic>(props);
        }
      }

      return std::static_pointer_cast<RootShadowNode>(
          cloneShadowTree(oldRootShadowNode, updates, affectedNodes));
    };

    // commit with mountSynchronously=true
    shadowTree.commit(transaction, {false, true});
    stop = true; // single surface assumption
  });
#endif
}

TamaguiStyleRegistry::AffectedNodes TamaguiStyleRegistry::findAffectedNodes(
    const RootShadowNode& rootNode,
    const std::unordered_map<const ShadowNodeFamily*, folly::dynamic>& updates) {
  AffectedNodes affectedNodes;

  for (const auto& [family, _] : updates) {
    auto ancestors = family->getAncestors(rootNode);

    for (auto it = ancestors.rbegin(); it != ancestors.rend(); ++it) {
      const auto& [parentNode, index] = *it;
      const auto parentFamily = &parentNode.get().getFamily();
      auto [setIt, inserted] = affectedNodes.try_emplace(parentFamily, std::unordered_set<int>{});
      setIt->second.insert(index);
    }
  }

  return affectedNodes;
}

std::shared_ptr<ShadowNode> TamaguiStyleRegistry::cloneShadowTree(
    const ShadowNode& shadowNode,
    const std::unordered_map<const ShadowNodeFamily*, folly::dynamic>& updates,
    AffectedNodes& affectedNodes) {
  const auto family = &shadowNode.getFamily();
  const auto childrenIt = affectedNodes.find(family);

  // only copy children if we need to update them
  std::shared_ptr<std::vector<std::shared_ptr<const ShadowNode>>> childrenPtr;
  const auto& originalChildren = shadowNode.getChildren();

  if (childrenIt != affectedNodes.end()) {
    auto children = originalChildren;
    for (const auto index : childrenIt->second) {
      children[index] = cloneShadowTree(*children[index], updates, affectedNodes);
    }
    childrenPtr = std::make_shared<std::vector<std::shared_ptr<const ShadowNode>>>(std::move(children));
  } else {
    childrenPtr = std::make_shared<std::vector<std::shared_ptr<const ShadowNode>>>(originalChildren);
  }

  Props::Shared updatedProps = computeUpdatedProps(shadowNode, updates);

  return shadowNode.clone({
      .props = updatedProps,
      .children = childrenPtr,
      .state = shadowNode.getState()});
}

Props::Shared TamaguiStyleRegistry::computeUpdatedProps(
    const ShadowNode& shadowNode,
    const std::unordered_map<const ShadowNodeFamily*, folly::dynamic>& updates) {
  const auto family = &shadowNode.getFamily();
  const auto rawPropsIt = updates.find(family);

  if (rawPropsIt == updates.end()) {
    return ShadowNodeFragment::propsPlaceholder();
  }

  const auto& componentDescriptor = shadowNode.getComponentDescriptor();
  const auto& props = shadowNode.getProps();

  PropsParserContext propsParserContext{
      shadowNode.getSurfaceId(),
      *shadowNode.getContextContainer()};

  return componentDescriptor.cloneProps(
      propsParserContext,
      props,
      RawProps(rawPropsIt->second));
}

folly::dynamic TamaguiStyleRegistry::findStyleForTheme(
    const LinkedNode& node,
    const std::string& themeName) const {
  // direct match
  auto it = node.styles.find(themeName);
  if (it != node.styles.end()) {
    auto style = it->second;
    // remove __themes from output
    if (style.isObject() && style.count("__themes")) {
      style.erase("__themes");
    }
    return style;
  }

  // check deduplicated styles - find canonical style that includes this theme
  for (const auto& [canonicalTheme, style] : node.styles) {
    if (style.isObject() && style.count("__themes")) {
      const auto& themesArray = style["__themes"];
      if (themesArray.isArray()) {
        for (const auto& t : themesArray) {
          if (t.asString() == themeName) {
            auto cleanStyle = style;
            cleanStyle.erase("__themes");
            return cleanStyle;
          }
        }
      }
    }
  }

  // fallback: try base theme (e.g., "dark_blue" -> "dark")
  auto underscorePos = themeName.find('_');
  if (underscorePos != std::string::npos) {
    std::string baseTheme = themeName.substr(0, underscorePos);
    return findStyleForTheme(node, baseTheme);
  }

  // no match found
  return folly::dynamic::object();
}

std::string TamaguiStyleRegistry::createScope(
    const std::string& name,
    const std::string& parentScopeId) {
  std::lock_guard<std::mutex> lock(mutex_);

  std::string scopeId = "scope_" + std::to_string(++scopeIdCounter_);

  // determine parent
  std::string effectiveParentId = parentScopeId.empty() ? GLOBAL_SCOPE_ID : parentScopeId;

  // inherit theme from parent
  std::string inheritedTheme = currentTheme_;
  if (scopes_.count(effectiveParentId)) {
    inheritedTheme = scopes_[effectiveParentId].currentTheme;
  }

  scopes_[scopeId] = ThemeScope{
      .name = name,
      .parentId = effectiveParentId,
      .currentTheme = inheritedTheme,
      .viewIds = {}};

  return scopeId;
}

RegistryStats TamaguiStyleRegistry::getStats() const {
  std::lock_guard<std::mutex> lock(mutex_);

  return RegistryStats{
      .viewCount = linkedNodes_.size(),
      .scopeCount = scopes_.size(),
      .currentTheme = currentTheme_};
}

void TamaguiStyleRegistry::reset() {
  std::lock_guard<std::mutex> lock(mutex_);

  linkedNodes_.clear();
  scopes_.clear();
  currentTheme_ = "light";
  scopeIdCounter_ = 0;
  pendingThemeChange_ = false;

  // reinitialize global scope
  scopes_[GLOBAL_SCOPE_ID] = ThemeScope{
      .name = "global",
      .parentId = "",
      .currentTheme = "light",
      .viewIds = {}};
}

} // namespace tamagui
