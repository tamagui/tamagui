#include "HybridTamaguiShadowRegistry.hpp"

#include <jsi/JSIDynamic.h>
#include <react/renderer/core/ComponentDescriptor.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/RawProps.h>
#include <react/renderer/core/ShadowNodeFragment.h>
#include <react/renderer/uimanager/UIManager.h>
#include <react/renderer/uimanager/UIManagerBinding.h>
#include <cxxreact/ReactNativeVersion.h>

#include <react/renderer/components/root/RootShadowNode.h>
#include <react/renderer/mounting/ShadowTree.h>
#include <react/renderer/mounting/ShadowTreeRegistry.h>

namespace margelo::nitro::tamagui::styleregistry {

using namespace facebook::react;
namespace jsi = facebook::jsi;
using margelo::nitro::Prototype;

// ── Pre-0.81: manual ShadowTree clone+commit (from Unistyles) ──

#if REACT_NATIVE_VERSION_MINOR < 81

using LeafUpdates =
    std::unordered_map<const ShadowNodeFamily*, folly::dynamic>;
using AffectedNodes =
    std::unordered_map<const ShadowNodeFamily*, std::unordered_set<int>>;

static AffectedNodes findAffectedNodes(
    const RootShadowNode& root,
    const LeafUpdates& updates) {
  AffectedNodes affected;
  for (const auto& [family, _] : updates) {
    for (auto& [parentNode, childIndex] : family->getAncestors(root)) {
      affected[&parentNode.get().getFamily()].insert(childIndex);
    }
  }
  return affected;
}

static std::shared_ptr<ShadowNode> cloneSubtree(
    const ShadowNode& node,
    const LeafUpdates& updates,
    const AffectedNodes& affected) {
  auto* family = &node.getFamily();
  auto children = node.getChildren();

  if (auto it = affected.find(family); it != affected.end()) {
    for (auto idx : it->second) {
      children[idx] = cloneSubtree(*children[idx], updates, affected);
    }
  }

  Props::Shared newProps = ShadowNodeFragment::propsPlaceholder();
  if (auto it = updates.find(family); it != updates.end()) {
    PropsParserContext ctx{node.getSurfaceId(), *node.getContextContainer()};
    newProps = node.getComponentDescriptor().cloneProps(
        ctx, node.getProps(), RawProps(it->second));
  }

  return node.clone({
      .props = newProps,
      .children = std::make_shared<std::vector<std::shared_ptr<const ShadowNode>>>(
          std::move(children)),
      .state = node.getState(),
  });
}

#endif // REACT_NATIVE_VERSION_MINOR < 81

// ── Expand compiler's deduped __themes aliases into direct keys ──
// Compiler emits: { "dark": { bg: "#000", __themes: ["dark", "dark_alt1"] } }
// We expand to: { "dark": { bg: "#000" }, "dark_alt1": { bg: "#000" } }
// So applyUpdates can do simple O(1) key lookup for any theme name.

static folly::dynamic expandThemeAliases(folly::dynamic styles) {
  folly::dynamic expanded = folly::dynamic::object;
  for (auto& [key, style] : styles.items()) {
    if (style.isObject() && style.count("__themes")) {
      folly::dynamic clean = folly::dynamic::object;
      for (auto& [prop, val] : style.items()) {
        if (prop != "__themes") clean[prop] = val;
      }
      for (auto& alias : style["__themes"]) {
        expanded[alias.asString()] = clean;
      }
    } else {
      expanded[key] = style;
    }
  }
  return expanded;
}

// ── Implementation ──

HybridTamaguiShadowRegistry::HybridTamaguiShadowRegistry()
    : HybridObject(TAG) {}

void HybridTamaguiShadowRegistry::loadHybridMethods() {
  HybridTamaguiShadowRegistrySpec::loadHybridMethods();
  registerHybrids(this, [](Prototype& prototype) {
    prototype.registerRawHybridMethod(
        "link", 3, &HybridTamaguiShadowRegistry::link);
    prototype.registerRawHybridMethod(
        "unlink", 1, &HybridTamaguiShadowRegistry::unlink);
  });
}

size_t HybridTamaguiShadowRegistry::getExternalMemorySize() noexcept {
  std::lock_guard<std::mutex> lock(mutex_);
  return linkedViews_.size() * 512;
}

std::shared_ptr<const ShadowNode>
HybridTamaguiShadowRegistry::extractShadowNode(
    jsi::Runtime& rt, const jsi::Value& value) {
  if (!value.isObject()) return nullptr;
  auto obj = value.asObject(rt);
  if (!obj.hasNativeState(rt)) return nullptr;
  auto wrapper = obj.getNativeState<ShadowNodeWrapper>(rt);
  return wrapper ? wrapper->shadowNode : nullptr;
}

// ── Raw JSI: link / unlink ──

jsi::Value HybridTamaguiShadowRegistry::link(
    jsi::Runtime& rt, const jsi::Value&,
    const jsi::Value* args, size_t count) {
  if (count < 3) {
    throw jsi::JSError(rt, "link() requires 3 arguments");
  }
  auto node = extractShadowNode(rt, args[0]);
  if (!node) return jsi::Value::undefined();

  std::lock_guard<std::mutex> lock(mutex_);
  runtime_ = &rt;
  linkedViews_[&node->getFamily()] = LinkedView{
      &node->getFamily(),
      expandThemeAliases(jsi::dynamicFromValue(rt, args[1])),
      args[2].asString(rt).utf8(rt)};
  return jsi::Value::undefined();
}

jsi::Value HybridTamaguiShadowRegistry::unlink(
    jsi::Runtime& rt, const jsi::Value&,
    const jsi::Value* args, size_t count) {
  if (count < 1) {
    throw jsi::JSError(rt, "unlink() requires 1 argument");
  }
  auto node = extractShadowNode(rt, args[0]);
  if (!node) return jsi::Value::undefined();

  std::lock_guard<std::mutex> lock(mutex_);
  linkedViews_.erase(&node->getFamily());
  return jsi::Value::undefined();
}

// ── Nitro typed: setTheme / setScopedTheme / getTheme ──

void HybridTamaguiShadowRegistry::setTheme(const std::string& themeName) {
  jsi::Runtime* rt = nullptr;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    if (currentTheme_ == themeName) return;
    currentTheme_ = themeName;
    rt = runtime_;
  }
  if (rt) {
    applyUpdates(*rt, nullptr);
  }
}

void HybridTamaguiShadowRegistry::setScopedTheme(
    const std::string& scopeId, const std::string& themeName) {
  jsi::Runtime* rt = nullptr;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    scopeThemes_[scopeId] = themeName;
    rt = runtime_;
  }
  if (rt) {
    applyUpdates(*rt, &scopeId);
  }
}

std::string HybridTamaguiShadowRegistry::getTheme() {
  std::lock_guard<std::mutex> lock(mutex_);
  return currentTheme_;
}

void HybridTamaguiShadowRegistry::removeScopedTheme(const std::string& scopeId) {
  std::lock_guard<std::mutex> lock(mutex_);
  scopeThemes_.erase(scopeId);
}

double HybridTamaguiShadowRegistry::getViewCount() {
  std::lock_guard<std::mutex> lock(mutex_);
  return static_cast<double>(linkedViews_.size());
}

double HybridTamaguiShadowRegistry::getScopeCount() {
  std::lock_guard<std::mutex> lock(mutex_);
  return static_cast<double>(scopeThemes_.size());
}

// ── Apply updates to ShadowTree ──

void HybridTamaguiShadowRegistry::applyUpdates(
    jsi::Runtime& rt, const std::string* scopeFilter) {
#if REACT_NATIVE_VERSION_MINOR >= 81
  std::unordered_map<Tag, folly::dynamic> updates;
#else
  LeafUpdates updates;
#endif

  for (auto& [family, view] : linkedViews_) {
    if (scopeFilter && view.scopeId != *scopeFilter) continue;

    // Resolve theme: scoped theme takes priority over global
    const auto& theme = (!view.scopeId.empty() && scopeThemes_.count(view.scopeId))
        ? scopeThemes_[view.scopeId]
        : currentTheme_;

    auto it = view.styles.find(theme);
    if (it == view.styles.items().end()) continue;
    auto& props = it->second;

    // Keep nativeProps_DEPRECATED in sync so React doesn't overwrite
    auto* mf = const_cast<ShadowNodeFamily*>(family);
    if (mf->nativeProps_DEPRECATED) {
      mf->nativeProps_DEPRECATED->update(props);
    } else {
      mf->nativeProps_DEPRECATED = std::make_unique<folly::dynamic>(props);
    }

#if REACT_NATIVE_VERSION_MINOR >= 81
    updates[family->getTag()] = props;
#else
    updates[family] = props;
#endif
  }

  if (updates.empty()) return;

  auto binding = UIManagerBinding::getBinding(rt);
  if (!binding) return;

#if REACT_NATIVE_VERSION_MINOR >= 81
  binding->getUIManager().updateShadowTree(std::move(updates));
#else
  binding->getUIManager().getShadowTreeRegistry().enumerate(
      [&updates](const ShadowTree& tree, bool& stop) {
        tree.commit(
            [&updates](const RootShadowNode& oldRoot)
                -> RootShadowNode::Unshared {
              auto affected = findAffectedNodes(oldRoot, updates);
              if (affected.empty()) return nullptr;
              return std::static_pointer_cast<RootShadowNode>(
                  cloneSubtree(oldRoot, updates, affected));
            },
            {.enableStateReconciliation = false,
             .mountSynchronously = true});
        stop = true;
      });
#endif
}

}  // namespace margelo::nitro::tamagui::styleregistry
