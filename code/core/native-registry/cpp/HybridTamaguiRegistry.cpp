#include "HybridTamaguiRegistry.hpp"

#include <jsi/JSIDynamic.h>
#include <react/renderer/components/root/RootShadowNode.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/RawProps.h>
#include <react/renderer/core/ShadowNode.h>
#include <react/renderer/core/ShadowNodeFragment.h>
#include <react/renderer/mounting/ShadowTree.h>
#include <react/renderer/mounting/ShadowTreeRegistry.h>
#include <react/renderer/uimanager/UIManager.h>
#include <react/renderer/uimanager/UIManagerBinding.h>
#include <react/renderer/uimanager/primitives.h>

#include <unordered_set>

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
      wrapper->shadowNode,
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

// ── In-transaction tree cloning ──
//
// RN's UIManager::updateShadowTree (0.81+) pre-builds its clone from a
// revision read before the commit and returns it from the commit callback
// unchanged, so a commit that lands in between (a same-tick React render,
// a Reanimated frame) makes it commit a stale-based tree: updates get lost
// or revert. Phase 0 reproduced exactly that. So the engine does its own
// ShadowTree::commit and builds the clone INSIDE the transaction from the
// root the callback receives; on retry the clone is rebuilt from the fresh
// root and the race disappears.

namespace {

using LeafUpdates = std::unordered_map<const ShadowNodeFamily*, folly::dynamic>;
using AffectedNodes =
    std::unordered_map<const ShadowNodeFamily*, std::unordered_set<size_t>>;

AffectedNodes findAffectedNodes(const RootShadowNode& root,
                                const LeafUpdates& updates) {
  AffectedNodes affected;
  for (const auto& [family, props] : updates) {
    // families of unmounted views have no ancestors in this root: skipped
    for (const auto& [parentNode, childIndex] : family->getAncestors(root)) {
      affected[&parentNode.get().getFamily()].insert(childIndex);
    }
  }
  return affected;
}

std::shared_ptr<ShadowNode> cloneSubtree(const ShadowNode& node,
                                         const LeafUpdates& updates,
                                         const AffectedNodes& affected) {
  const auto* family = &node.getFamily();
  auto children = node.getChildren();

  if (auto it = affected.find(family); it != affected.end()) {
    for (auto index : it->second) {
      children[index] = cloneSubtree(*children[index], updates, affected);
    }
  }

  Props::Shared newProps = ShadowNodeFragment::propsPlaceholder();
  if (auto it = updates.find(family); it != updates.end()) {
    PropsParserContext ctx{node.getSurfaceId(), *node.getContextContainer()};
    newProps = node.getComponentDescriptor().cloneProps(ctx, node.getProps(),
                                                        RawProps(it->second));
  }

  return node.clone({
      .props = newProps,
      .children = std::make_shared<std::vector<std::shared_ptr<const ShadowNode>>>(
          std::move(children)),
      .state = node.getState(),
  });
}

}  // namespace

void HybridTamaguiRegistry::applyUpdates(jsi::Runtime& rt,
                                         const std::string* scopeFilter) {
  LeafUpdates updates;
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

    // sync the family's native props so React re-commits of unchanged
    // children merge our values instead of resurrecting a stale absorbed
    // node (phase 0: the JS mirror alone provably does not cover this)
    const auto& family = view.node->getFamily();
    if (family.nativeProps_DEPRECATED) {
      family.nativeProps_DEPRECATED->update(props);
    } else {
      family.nativeProps_DEPRECATED = std::make_unique<folly::dynamic>(props);
    }

    // the retained node keeps its family alive; unmounted views resolve to
    // no ancestors during the transaction and are skipped safely
    updates[&family] = std::move(props);
  }

  if (updates.empty()) return;

  auto binding = UIManagerBinding::getBinding(rt);
  if (!binding) return;

  binding->getUIManager().getShadowTreeRegistry().enumerate(
      [this, &updates](const ShadowTree& tree, bool& /*stop*/) {
        auto status = tree.commit(
            [&updates](const RootShadowNode& oldRoot)
                -> RootShadowNode::Unshared {
              auto affected = findAffectedNodes(oldRoot, updates);
              if (affected.empty()) return nullptr;
              return std::static_pointer_cast<RootShadowNode>(
                  cloneSubtree(oldRoot, updates, affected));
            },
            {.enableStateReconciliation = false, .mountSynchronously = true});
        if (status == ShadowTree::CommitStatus::Succeeded) {
          commitCount_ += 1;
        }
      });
}

}  // namespace margelo::nitro::tamagui::registry
