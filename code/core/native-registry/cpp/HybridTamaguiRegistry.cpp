#include "HybridTamaguiRegistry.hpp"

#include <jsi/JSIDynamic.h>
#include <react/renderer/components/root/RootShadowNode.h>
#include <react/renderer/components/text/ParagraphShadowNode.h>
#include <react/renderer/textlayoutmanager/TextMeasureCache.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/RawProps.h>
#include <react/renderer/core/ShadowNode.h>
#include <react/renderer/core/ShadowNodeFragment.h>
#include <react/renderer/mounting/ShadowTree.h>
#include <react/renderer/mounting/ShadowTreeRegistry.h>
#include <react/renderer/uimanager/UIManager.h>
#include <react/renderer/uimanager/UIManagerBinding.h>
#include <react/renderer/uimanager/primitives.h>

#include <algorithm>
#include <cstring>
#include <unordered_set>
#include <vector>

namespace margelo::nitro::tamagui::registry {

using namespace facebook::react;
using margelo::nitro::Prototype;

void HybridTamaguiRegistry::loadHybridMethods() {
  HybridTamaguiRegistrySpec::loadHybridMethods();
  registerHybrids(this, [](Prototype& prototype) {
    prototype.registerRawHybridMethod("link", 4, &HybridTamaguiRegistry::link);
    prototype.registerRawHybridMethod("linkTables", 4,
                                      &HybridTamaguiRegistry::linkTables);
    prototype.registerRawHybridMethod("applyViewStates", 1,
                                      &HybridTamaguiRegistry::applyViewStates);
    prototype.registerRawHybridMethod("setTableState", 3,
                                      &HybridTamaguiRegistry::setTableState);
    prototype.registerRawHybridMethod("getViewState", 1,
                                      &HybridTamaguiRegistry::getViewState);
  });
}

jsi::Value HybridTamaguiRegistry::link(jsi::Runtime& rt, const jsi::Value&,
                                       const jsi::Value* args, size_t count) {
  if (count < 3) {
    throw jsi::JSError(rt, "link(shadowNode, slots | tableId, scopeId) requires 3 arguments");
  }
  if (!args[0].isObject()) return jsi::Value::undefined();
  auto obj = args[0].asObject(rt);
  if (!obj.hasNativeState(rt)) return jsi::Value::undefined();
  auto wrapper = obj.getNativeState<ShadowNodeWrapper>(rt);
  if (!wrapper || !wrapper->shadowNode) return jsi::Value::undefined();

  runtime_ = &rt;

  double id;
  LinkedView* linked;
  if (args[1].isNumber()) {
    auto& table = tables_[args[1].asNumber()];
    if (!table) table = std::make_shared<Table>();
    linked = &linkTableView(wrapper->shadowNode, table, args[2].asString(rt).utf8(rt));
    id = tableViewIds_.at(&wrapper->shadowNode->getFamily());
  } else {
    id = nextId_++;
    linked = &views_[id];
    linked->node = wrapper->shadowNode;
    linked->scopeId = args[2].asString(rt).utf8(rt);
    auto slots = jsi::dynamicFromValue(rt, args[1]);
    linked->baseProps = slots.getDefault("base", nullptr);
    linked->stateProps = slots.getDefault("state", nullptr);
  }
  auto& view = *linked;

  if (count > 3 && args[3].isBool() && args[3].getBool()) {
    if (const auto* name = viewStateName(view)) {
      LeafUpdates updates;
      buildViewUpdate(view, *name, updates);
      commitUpdates(rt, updates);
    }
  }
  return jsi::Value(id);
}

// links many views to shared tables in one call: entry i is shadow node
// nodes[i] on table tableIds[i] under scope scopes[scopeIndexes[i]]. a family
// already linked to a table keeps its link and moves to the new entry
jsi::Value HybridTamaguiRegistry::linkTables(jsi::Runtime& rt, const jsi::Value&,
                                             const jsi::Value* args, size_t count) {
  if (count < 4 || !args[0].isObject() || !args[1].isObject() ||
      !args[2].isObject() || !args[3].isObject()) {
    throw jsi::JSError(
        rt, "linkTables(nodes, tableIds, scopeIndexes, scopes) requires 4 arrays");
  }
  runtime_ = &rt;
  auto nodes = args[0].asObject(rt).asArray(rt);
  auto tableIds = args[1].asObject(rt).asArray(rt);
  auto scopeIndexes = args[2].asObject(rt).asArray(rt);
  auto scopeValues = args[3].asObject(rt).asArray(rt);

  std::vector<std::string> scopes(scopeValues.size(rt));
  for (size_t i = 0; i < scopes.size(); i++) {
    scopes[i] = scopeValues.getValueAtIndex(rt, i).asString(rt).utf8(rt);
  }

  const size_t size = nodes.size(rt);
  std::shared_ptr<Table> table;
  double tableId = -1;
  for (size_t i = 0; i < size; i++) {
    auto value = nodes.getValueAtIndex(rt, i);
    if (!value.isObject()) continue;
    auto obj = value.asObject(rt);
    if (!obj.hasNativeState(rt)) continue;
    auto wrapper = obj.getNativeState<ShadowNodeWrapper>(rt);
    if (!wrapper || !wrapper->shadowNode) continue;

    // consecutive entries usually share a table
    const double nextTableId = tableIds.getValueAtIndex(rt, i).asNumber();
    if (!table || nextTableId != tableId) {
      tableId = nextTableId;
      auto& entry = tables_[tableId];
      if (!entry) entry = std::make_shared<Table>();
      table = entry;
    }
    linkTableView(wrapper->shadowNode, table,
                  scopes.at(static_cast<size_t>(
                      scopeIndexes.getValueAtIndex(rt, i).asNumber())));
  }
  if (views_.size() > pruneAt_) pruneUnmounted(rt);
  return jsi::Value::undefined();
}

HybridTamaguiRegistry::LinkedView& HybridTamaguiRegistry::linkTableView(
    const std::shared_ptr<const ShadowNode>& node,
    const std::shared_ptr<Table>& table, std::string scopeId) {
  auto [it, added] = tableViewIds_.try_emplace(&node->getFamily(), nextId_);
  if (added) nextId_ += 1;
  auto& view = views_[it->second];
  if (view.table != table) {
    view.table = table;
    view.warm = {};
  }
  view.node = node;
  view.scopeId = std::move(scopeId);
  return view;
}

void HybridTamaguiRegistry::pruneUnmounted(jsi::Runtime& rt) {
  auto binding = UIManagerBinding::getBinding(rt);
  if (!binding) return;
  std::unordered_set<const ShadowNodeFamily*> mounted;
  mounted.reserve(views_.size() * 2);
  std::vector<const ShadowNode*> stack;
  binding->getUIManager().getShadowTreeRegistry().enumerate(
      [&](const ShadowTree& tree, bool& /*stop*/) {
        stack.push_back(tree.getCurrentRevision().rootShadowNode.get());
        while (!stack.empty()) {
          const ShadowNode* node = stack.back();
          stack.pop_back();
          mounted.insert(&node->getFamily());
          for (const auto& child : node->getChildren()) {
            stack.push_back(child.get());
          }
        }
      });
  for (auto it = views_.begin(); it != views_.end();) {
    const auto* family = &it->second.node->getFamily();
    if (mounted.count(family)) {
      ++it;
      continue;
    }
    if (it->second.table) tableViewIds_.erase(family);
    it = views_.erase(it);
  }
  pruneAt_ = std::max<size_t>(1024, views_.size() * 2);
}

const std::string* HybridTamaguiRegistry::viewStateName(
    const LinkedView& view) const {
  return view.activeState.empty() ? activeStateName(view.scopeId)
                                  : &view.activeState;
}

void HybridTamaguiRegistry::unlink(double id) {
  auto it = views_.find(id);
  if (it == views_.end()) return;
  if (it->second.table) tableViewIds_.erase(&it->second.node->getFamily());
  views_.erase(it);
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

using LeafUpdates = HybridTamaguiRegistry::LeafUpdates;
using AffectedNodes =
    std::unordered_map<const ShadowNodeFamily*, std::unordered_set<size_t>>;

// records, for every ancestor of an updated view, which children lead to one.
// returns whether `node` is or contains an updated view
bool collectAffected(const ShadowNode& node, const LeafUpdates& updates,
                     AffectedNodes& affected) {
  bool hit = updates.contains(&node.getFamily());
  const auto& children = node.getChildren();
  for (size_t index = 0; index < children.size(); index++) {
    if (collectAffected(*children[index], updates, affected)) {
      affected[&node.getFamily()].insert(index);
      hit = true;
    }
  }
  return hit;
}

AffectedNodes findAffectedNodes(const RootShadowNode& root,
                                const LeafUpdates& updates) {
  AffectedNodes affected;
  // getAncestors scans each parent's children to find the child, so many
  // updates under one wide parent (a long list) cost updates x siblings; past
  // a few updates one walk of the tree is cheaper
  if (updates.size() > 32) {
    collectAffected(root, updates, affected);
    return affected;
  }
  for (const auto& [family, update] : updates) {
    // families of unmounted views have no ancestors in this root: skipped
    for (const auto& [parentNode, childIndex] : family->getAncestors(root)) {
      affected[&parentNode.get().getFamily()].insert(childIndex);
    }
  }
  return affected;
}

// RN dirties the measurement of every paragraph cloned with props, and the
// dirty flag relays out each ancestor: one text color in each row of a long
// list relays out the whole list. for a paragraph of plain strings, whose
// fragments take exactly its own text attributes, rebuild those attributes
// the way ParagraphShadowNode::getContent does; when RN's own measure cache
// would call them layout-equivalent (colors, decorations, shadows, opacity),
// restyle the laid-out text directly and build the node without the clone
// step that dirties it. null when the update needs a real layout
std::shared_ptr<ShadowNode> restyleParagraph(const ShadowNode& node,
                                             const Props::Shared& props) {
  if (std::strcmp(node.getComponentName(), ParagraphComponentName) != 0) {
    return nullptr;
  }
  for (const auto& child : node.getChildren()) {
    if (std::strcmp(child->getComponentName(), "RawText") != 0) return nullptr;
  }
  const auto& nextProps = static_cast<const ParagraphProps&>(*props);
  const auto& paragraph = static_cast<const ParagraphShadowNode&>(node);
  if (!(nextProps.paragraphAttributes ==
        paragraph.getConcreteProps().paragraphAttributes)) {
    return nullptr;
  }

  auto data = paragraph.getStateData();
  auto layoutManager = data.layoutManager.lock();
  if (!layoutManager || data.attributedString.getFragments().empty()) {
    return nullptr;
  }
  const auto& laidOut = data.attributedString.getBaseTextAttributes();
  auto attributes = TextAttributes::defaultTextAttributes();
  attributes.fontSizeMultiplier = laidOut.fontSizeMultiplier;
  attributes.apply(nextProps.textAttributes);
  attributes.layoutDirection = laidOut.layoutDirection;
  if (!areTextAttributesEquivalentLayoutWise(laidOut, attributes)) {
    return nullptr;
  }
  for (auto& fragment : data.attributedString.getFragments()) {
    fragment.textAttributes = attributes;
  }
  data.attributedString.setBaseTextAttributes(attributes);

  const ShadowNodeFragment fragment{
      .props = props,
      .children = ShadowNodeFragment::childrenPlaceholder(),
      .state = node.getComponentDescriptor().createState(
          node.getFamily(), std::make_shared<const ParagraphState>(std::move(data))),
  };
  // what ConcreteComponentDescriptor::cloneShadowNode does, minus
  // completeClone (the dirtying step); adopt only sets the layout manager.
  // a yoga style change still dirties the node through its constructor
  auto clone = std::make_shared<ParagraphShadowNode>(node, fragment);
  clone->setTextLayoutManager(std::move(layoutManager));
  node.transferRuntimeShadowNodeReference(clone, fragment);
  return clone;
}

std::shared_ptr<ShadowNode> cloneSubtree(const ShadowNode& node,
                                         const LeafUpdates& updates,
                                         const AffectedNodes& affected) {
  const auto* family = &node.getFamily();

  // only an ancestor of an updated view gets new children: RN dirties the
  // layout of any measurable node (text) cloned with a children fragment,
  // so passing them to the updated views themselves would re-measure every
  // text and re-run layout for a color change
  auto children = ShadowNodeFragment::childrenPlaceholder();
  if (auto it = affected.find(family); it != affected.end()) {
    auto cloned = node.getChildren();
    for (auto index : it->second) {
      cloned[index] = cloneSubtree(*cloned[index], updates, affected);
    }
    children = std::make_shared<std::vector<std::shared_ptr<const ShadowNode>>>(
        std::move(cloned));
  }

  Props::Shared newProps = ShadowNodeFragment::propsPlaceholder();
  if (auto it = updates.find(family); it != updates.end()) {
    const auto& update = it->second;
    const auto parse = [&] {
      PropsParserContext ctx{node.getSurfaceId(), *node.getContextContainer()};
      return node.getComponentDescriptor().cloneProps(ctx, node.getProps(),
                                                      RawProps(update.props()));
    };
    if (auto* warm = update.warm) {
      if (warm->last != node.getProps() || warm->revision != update.revision) {
        warm->byState.clear();
        warm->revision = update.revision;
      }
      auto& props = warm->byState[*update.state];
      if (!props) props = parse();
      warm->last = props;
      newProps = props;
    } else {
      newProps = parse();
    }
    if (auto restyled = restyleParagraph(node, newProps)) {
      return restyled;
    }
  }

  return node.clone({
      .props = newProps,
      .children = children,
      .state = ShadowNodeFragment::statePlaceholder(),
  });
}

}  // namespace

// merge base + the named state's props for one view into `out`. a runtime
// view also syncs its family's native props so React re-commits of unchanged
// children merge our values instead of resurrecting a stale absorbed node.
// returns false on a state miss.
bool HybridTamaguiRegistry::buildViewUpdate(LinkedView& view,
                                            const std::string& stateName,
                                            LeafUpdates& out) {
  LeafUpdate update;
  if (view.table) {
    // a table view commits only its state keys, React rendered the rest
    auto it = view.table->states.find(stateName);
    if (it == view.table->states.items().end()) {
      missCount_ += 1;
      return false;
    }
    update.shared = &it->second;
    update.warm = &view.warm;
    update.state = &it->first.getString();
    update.revision = view.table->revision;
  } else {
    auto& props = update.owned;
    props = view.baseProps.isObject() ? view.baseProps : folly::dynamic::object();
    if (view.stateProps.isObject()) {
      auto it = view.stateProps.find(stateName);
      if (it == view.stateProps.items().end()) {
        missCount_ += 1;
        return false;
      }
      if (props.empty()) {
        props = it->second;
      } else {
        props.update(it->second);
      }
    } else if (props.empty()) {
      return false;
    }
  }
  const auto& props = update.props();

  const auto& family = view.node->getFamily();
  // the retained node keeps its family alive; unmounted views resolve to
  // no ancestors during the transaction and are skipped safely
  if (view.table) {
    // React renders a table view with its scope's current state and the
    // engine's clones take over React's handles, so nothing goes stale. a
    // sticky copy would make RN re-parse the view's props on every clone
    out[&family] = std::move(update);
    return true;
  }
  std::lock_guard<std::mutex> lock(family.nativePropsMutex);
  if (family.nativeProps_DEPRECATED) {
    family.nativeProps_DEPRECATED->update(props);
  } else {
    family.nativeProps_DEPRECATED = std::make_unique<folly::dynamic>(props);
  }

  // a null value means reset-to-default (a style key dropped by a media
  // change): it must COMMIT as null so RawProps clears the prop, but must not
  // stick in nativeProps_DEPRECATED or every future React render would keep
  // re-clearing a key the render may now legitimately set
  auto& sticky = *family.nativeProps_DEPRECATED;
  for (const auto& item : props.items()) {
    if (item.second.isNull()) sticky.erase(item.first.asString());
  }

  out[&family] = std::move(update);
  return true;
}

void HybridTamaguiRegistry::commitUpdates(jsi::Runtime& rt,
                                          LeafUpdates& updates) {
  if (updates.empty()) return;

  auto binding = UIManagerBinding::getBinding(rt);
  if (!binding) return;

  // the clones this commit makes take over React's handles to the nodes they
  // replace (RN's per-thread switch for updateRuntimeShadowNodeReferences), so
  // React's next commit builds on them instead of its own stale nodes
  const bool updatedReferences =
      ShadowNode::getUseRuntimeShadowNodeReferenceUpdateOnThread();
  ShadowNode::setUseRuntimeShadowNodeReferenceUpdateOnThread(true);
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
  ShadowNode::setUseRuntimeShadowNodeReferenceUpdateOnThread(updatedReferences);
}

void HybridTamaguiRegistry::applyUpdates(jsi::Runtime& rt,
                                         const std::string* scopeFilter) {
  LeafUpdates updates;
  updates.reserve(views_.size());

  for (auto& [id, view] : views_) {
    if (scopeFilter && view.scopeId != *scopeFilter) continue;
    // runtime-managed views (applyViewStates) resolve state per view; scope
    // broadcasts must not fight their controller
    if (!view.activeState.empty()) continue;

    const bool hasStates = view.table || view.stateProps.isObject();
    const auto* name = hasStates ? activeStateName(view.scopeId) : nullptr;
    if (hasStates && !name) continue;

    buildViewUpdate(view, name ? *name : "", updates);
  }

  commitUpdates(rt, updates);
}

jsi::Value HybridTamaguiRegistry::applyViewStates(jsi::Runtime& rt,
                                                  const jsi::Value&,
                                                  const jsi::Value* args,
                                                  size_t count) {
  if (count < 1 || !args[0].isObject()) {
    throw jsi::JSError(rt, "applyViewStates(entries) requires an array");
  }
  runtime_ = &rt;

  auto entries = jsi::dynamicFromValue(rt, args[0]);
  if (!entries.isArray()) {
    throw jsi::JSError(rt, "applyViewStates(entries) requires an array");
  }

  LeafUpdates updates;
  updates.reserve(entries.size());

  for (auto& entry : entries) {
    if (!entry.isObject()) continue;
    auto idIt = entry.find("id");
    auto stateIt = entry.find("state");
    if (idIt == entry.items().end() || stateIt == entry.items().end()) continue;

    auto viewIt = views_.find(idIt->second.asDouble());
    // unlinked between the JS pass and this call: stale entry, not a miss
    if (viewIt == views_.end()) continue;
    auto& view = viewIt->second;

    const std::string stateName = stateIt->second.asString();
    auto props = entry.getDefault("props", nullptr);
    if (props.isObject() && view.table) {
      // a runtime controller takes the view over: it owns its tables now
      view.stateProps = view.table->states;
      view.table = nullptr;
    }
    if (props.isObject()) {
      if (!view.stateProps.isObject()) {
        view.stateProps = folly::dynamic::object();
      }
      view.stateProps[stateName] = std::move(props);
    }
    view.activeState = stateName;

    buildViewUpdate(view, stateName, updates);
  }

  commitUpdates(rt, updates);
  return jsi::Value::undefined();
}

jsi::Value HybridTamaguiRegistry::setTableState(jsi::Runtime& rt,
                                                const jsi::Value&,
                                                const jsi::Value* args,
                                                size_t count) {
  if (count < 3 || !args[0].isNumber() || !args[1].isString() ||
      !args[2].isObject()) {
    throw jsi::JSError(rt, "setTableState(tableId, state, props) requires 3 arguments");
  }
  runtime_ = &rt;

  auto& table = tables_[args[0].asNumber()];
  if (!table) table = std::make_shared<Table>();
  const std::string stateName = args[1].asString(rt).utf8(rt);
  table->states[stateName] = jsi::dynamicFromValue(rt, args[2]);
  table->revision += 1;

  LeafUpdates updates;
  for (auto& [id, view] : views_) {
    if (view.table != table) continue;
    const auto* name = viewStateName(view);
    if (name && *name == stateName) buildViewUpdate(view, stateName, updates);
  }
  commitUpdates(rt, updates);
  return jsi::Value::undefined();
}

jsi::Value HybridTamaguiRegistry::getViewState(jsi::Runtime& rt,
                                               const jsi::Value&,
                                               const jsi::Value* args,
                                               size_t count) {
  if (count < 1 || !args[0].isNumber()) return jsi::Value::null();
  auto it = views_.find(args[0].asNumber());
  if (it == views_.end()) return jsi::Value::null();
  const auto& view = it->second;

  folly::dynamic out = folly::dynamic::object("scopeId", view.scopeId)(
      "activeState", view.activeState)("base", view.baseProps)(
      "states", view.table ? view.table->states : view.stateProps);
  if (view.table) {
    const auto* name = viewStateName(view);
    auto state = name ? view.table->states.find(*name) : view.table->states.items().end();
    out["nativeProps"] = state != view.table->states.items().end()
                             ? state->second
                             : folly::dynamic(nullptr);
    return jsi::valueFromDynamic(rt, out);
  }
  const auto& family = view.node->getFamily();
  std::lock_guard<std::mutex> lock(family.nativePropsMutex);
  out["nativeProps"] = family.nativeProps_DEPRECATED
                           ? *family.nativeProps_DEPRECATED
                           : folly::dynamic(nullptr);
  return jsi::valueFromDynamic(rt, out);
}

}  // namespace margelo::nitro::tamagui::registry
