#pragma once

#include "HybridTamaguiRegistrySpec.hpp"

#include <folly/dynamic.h>
#include <jsi/jsi.h>
#include <react/renderer/core/ShadowNode.h>

#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>

namespace margelo::nitro::tamagui::registry {

namespace jsi = facebook::jsi;

/**
 * Generic style registry engine.
 *
 * Views link with slot props (base + per-state-name); scopes hold an active
 * state name; changing a scope's state commits the matching props for every
 * affected view straight to Fabric's ShadowTree via
 * UIManager::updateShadowTree (RN >= 0.81), bypassing React entirely.
 *
 * The engine knows nothing about themes, media queries, or Tamagui: those
 * semantics live in JS. Future dependency kinds (media, press, group,
 * container) add a state table and an invalidation rule and reuse the same
 * commit path.
 *
 * Contracts:
 * - Every entry point runs on the JS thread. Single-threaded by design, no
 *   locks. A future cross-thread producer must queue onto the JS thread at
 *   its own boundary.
 * - Views are keyed by engine-issued id and store the Fabric Tag, never a
 *   ShadowNodeFamily pointer. updateShadowTree ignores tags no longer in the
 *   tree, so a missed unlink degrades to a dead map entry, not UB.
 * - State-name lookups are exact. A miss bumps missCount_ and skips the
 *   view; emitting exhaustive keys is the JS/compiler side's job.
 */
class HybridTamaguiRegistry : public HybridTamaguiRegistrySpec {
 public:
  // one view's props for a commit. table views point at their table's
  // state entry, shared by every view of the table, so the commit can parse
  // each distinct (props, update) pair once; per-view slots own theirs
  // the props a table view carries per state: the props React rendered for
  // the state it linked in, and the props this engine committed since. while
  // the node still carries the props `last` names, a switch back to a state
  // reuses that state's props instead of parsing them again; a React render
  // invalidates them all, a table refill the refilled state's
  struct WarmProps {
    facebook::react::Props::Shared last;
    std::unordered_map<std::string, facebook::react::Props::Shared> byState;
  };

  struct LeafUpdate {
    const folly::dynamic* shared = nullptr;
    folly::dynamic owned;
    // table views only
    WarmProps* warm = nullptr;
    const std::string* state = nullptr;
    const folly::dynamic& props() const { return shared ? *shared : owned; }
  };
  using LeafUpdates =
      std::unordered_map<const facebook::react::ShadowNodeFamily*, LeafUpdate>;

  HybridTamaguiRegistry() : HybridObject(TAG) {}

  void loadHybridMethods() override;

  // typed spec methods
  void setStateName(const std::string& scopeId, const std::string& stateName) override;
  std::string getStateName(const std::string& scopeId) override;
  void removeScope(const std::string& scopeId) override;
  void unlink(double id) override;
  double getViewCount() override;
  double getCommitCount() override;
  double getMissCount() override;

 private:
  // one state table shared by every view a compiler mapping links: state
  // name -> props. filled once per mapping and state, never per view
  struct Table {
    folly::dynamic states = folly::dynamic::object();
  };

  struct LinkedView {
    // retained so the family stays valid for in-transaction ancestor lookup;
    // unmounted views resolve to no ancestors and are skipped
    std::shared_ptr<const facebook::react::ShadowNode> node;
    std::string scopeId;
    folly::dynamic baseProps;   // object, or nullptr when absent
    folly::dynamic stateProps;  // stateName -> props object, or nullptr
    // shared table (compiler mappings); when set it replaces base/stateProps
    // and a commit carries only the state's keys, React already rendered the rest
    std::shared_ptr<Table> table;
    // per-view active state (runtime mode). empty = follow scope state.
    // runtime integrations resolve state names per view (nested themes);
    // scope broadcast stays for compiler-emitted tables.
    std::string activeState;
    WarmProps warm;
  };

  // raw JSI: link(shadowNode, slots | tableId, scopeId, commitNow?) -> id
  // commitNow commits the view's active state once (its render raced a
  // scope change)
  jsi::Value link(jsi::Runtime& rt, const jsi::Value& thisValue,
                  const jsi::Value* args, size_t count);

  // raw JSI: linkTables(nodes, tableIds, scopeIndexes, scopes) -> void
  // links many views to shared tables; a view already linked to a table
  // moves to its new entry. table links are never unlinked by id: views that
  // left the tree are pruned here once the linked count doubles
  jsi::Value linkTables(jsi::Runtime& rt, const jsi::Value& thisValue,
                        const jsi::Value* args, size_t count);

  // raw JSI: applyViewStates([{id, state, props?}]) -> void
  // batched per-view state selection: for each entry, `props` (when given)
  // replaces the view's state table entry under `state`, the view's active
  // state becomes `state`, and all changed views commit in ONE transaction.
  jsi::Value applyViewStates(jsi::Runtime& rt, const jsi::Value& thisValue,
                             const jsi::Value* args, size_t count);

  // raw JSI: setTableState(tableId, state, props) -> void
  // fills one state of a shared table; linked views showing that state commit
  jsi::Value setTableState(jsi::Runtime& rt, const jsi::Value& thisValue,
                           const jsi::Value* args, size_t count);

  // raw JSI: getViewState(id) -> {scopeId, activeState, base, states} | null
  // debug/test introspection of a linked view's tables; not a hot path
  jsi::Value getViewState(jsi::Runtime& rt, const jsi::Value& thisValue,
                          const jsi::Value* args, size_t count);

  // links a shadow node to a shared table, reusing its family's link
  LinkedView& linkTableView(const std::shared_ptr<const facebook::react::ShadowNode>& node,
                            const std::shared_ptr<Table>& table, std::string scopeId);

  // drops linked views whose family is in no shadow tree
  void pruneUnmounted(jsi::Runtime& rt);

  // resolve the active state name for a scope: scope entry, else root
  const std::string* activeStateName(const std::string& scopeId) const;

  // merge base + named state props for one view into `out` (with native-props
  // sync); returns false on a state miss
  bool buildViewUpdate(LinkedView& view, const std::string& stateName,
                       LeafUpdates& out);

  // one race-safe in-transaction commit for all built updates
  void commitUpdates(jsi::Runtime& rt, LeafUpdates& updates);

  // commit current props for all views (scopeFilter == nullptr) or one scope
  void applyUpdates(jsi::Runtime& rt, const std::string* scopeFilter);

  // the state a view shows right now: its own runtime state, else its scope's
  const std::string* viewStateName(const LinkedView& view) const;

  // records a freshly linked table view's React props as its state's props
  void seedWarmProps(LinkedView& view) const;

  std::unordered_map<double, LinkedView> views_;
  // table views by family: a host attaching again keeps one link
  std::unordered_map<const facebook::react::ShadowNodeFamily*, double> tableViewIds_;
  size_t pruneAt_ = 1024;
  std::unordered_map<double, std::shared_ptr<Table>> tables_;
  std::unordered_map<std::string, std::string> scopeStates_;  // "" = root
  double nextId_ = 1;
  double commitCount_ = 0;
  double missCount_ = 0;
  jsi::Runtime* runtime_ = nullptr;
};

}  // namespace margelo::nitro::tamagui::registry
