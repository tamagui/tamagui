#include "HybridTamaguiRegistry.hpp"

#include <jsi/JSIDynamic.h>
#include <react/renderer/core/ShadowNode.h>
#include <react/renderer/uimanager/UIManager.h>
#include <react/renderer/uimanager/UIManagerBinding.h>
#include <react/renderer/uimanager/primitives.h>

namespace margelo::nitro::tamagui::registry {

using namespace facebook::react;
using margelo::nitro::Prototype;

void HybridTamaguiRegistry::loadHybridMethods() {
  HybridTamaguiRegistrySpec::loadHybridMethods();
  registerHybrids(this, [](Prototype& prototype) {
    prototype.registerRawHybridMethod("link", 3, &HybridTamaguiRegistry::link);
  });
}

jsi::Value HybridTamaguiRegistry::link(jsi::Runtime& rt, const jsi::Value&,
                                       const jsi::Value* args, size_t count) {
  if (count < 3) {
    throw jsi::JSError(rt, "link(shadowNode, slots, scopeId) requires 3 arguments");
  }
  if (!args[0].isObject()) return jsi::Value::undefined();
  auto obj = args[0].asObject(rt);
  if (!obj.hasNativeState(rt)) return jsi::Value::undefined();
  auto wrapper = obj.getNativeState<ShadowNodeWrapper>(rt);
  if (!wrapper || !wrapper->shadowNode) return jsi::Value::undefined();

  runtime_ = &rt;

  auto slots = jsi::dynamicFromValue(rt, args[1]);
  const double id = nextId_++;
  views_[id] = LinkedView{
      wrapper->shadowNode->getTag(),
      args[2].asString(rt).utf8(rt),
      slots.getDefault("base", nullptr),
      slots.getDefault("state", nullptr),
  };
  return jsi::Value(id);
}

void HybridTamaguiRegistry::unlink(double id) {
  views_.erase(id);
}

const std::string* HybridTamaguiRegistry::activeStateName(
    const std::string& scopeId) const {
  if (auto it = scopeStates_.find(scopeId); it != scopeStates_.end()) {
    return &it->second;
  }
  if (!scopeId.empty()) {
    if (auto root = scopeStates_.find(""); root != scopeStates_.end()) {
      return &root->second;
    }
  }
  return nullptr;
}

void HybridTamaguiRegistry::setStateName(const std::string& scopeId,
                                         const std::string& stateName) {
  auto it = scopeStates_.find(scopeId);
  if (it != scopeStates_.end() && it->second == stateName) return;
  scopeStates_[scopeId] = stateName;
  if (runtime_) {
    // a root change also affects scoped views inheriting root, so commit all
    applyUpdates(*runtime_, scopeId.empty() ? nullptr : &scopeId);
  }
}

std::string HybridTamaguiRegistry::getStateName(const std::string& scopeId) {
  const auto* name = activeStateName(scopeId);
  return name ? *name : "";
}

void HybridTamaguiRegistry::removeScope(const std::string& scopeId) {
  scopeStates_.erase(scopeId);
}

double HybridTamaguiRegistry::getViewCount() {
  return static_cast<double>(views_.size());
}

double HybridTamaguiRegistry::getCommitCount() {
  return commitCount_;
}

double HybridTamaguiRegistry::getMissCount() {
  return missCount_;
}

void HybridTamaguiRegistry::applyUpdates(jsi::Runtime& rt,
                                         const std::string* scopeFilter) {
  std::unordered_map<Tag, folly::dynamic> updates;
  updates.reserve(views_.size());

  for (auto& [id, view] : views_) {
    if (scopeFilter && view.scopeId != *scopeFilter) continue;

    folly::dynamic props =
        view.baseProps.isObject() ? view.baseProps : folly::dynamic::object();

    if (view.stateProps.isObject()) {
      const auto* name = activeStateName(view.scopeId);
      if (!name) continue;
      auto it = view.stateProps.find(*name);
      if (it == view.stateProps.items().end()) {
        missCount_ += 1;
        continue;
      }
      if (props.empty()) {
        props = it->second;
      } else {
        props.update(it->second);
      }
    } else if (props.empty()) {
      continue;
    }

    updates[view.tag] = std::move(props);
  }

  if (updates.empty()) return;

  auto binding = UIManagerBinding::getBinding(rt);
  if (!binding) return;

  binding->getUIManager().updateShadowTree(std::move(updates));
  commitCount_ += 1;
}

}  // namespace margelo::nitro::tamagui::registry
