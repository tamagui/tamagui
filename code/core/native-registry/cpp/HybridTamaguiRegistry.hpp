#pragma once

#include "HybridTamaguiRegistrySpec.hpp"

#include <folly/dynamic.h>
#include <jsi/jsi.h>
#include <react/renderer/core/ShadowNode.h>

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
  using LeafUpdates =
      std::unordered_map<const facebook::react::ShadowNodeFamily*,
                         folly::dynamic>;

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
  struct LinkedView {
    // retained so the family stays valid for in-transaction ancestor lookup;
    // unmounted views resolve to no ancestors and are skipped
    std::shared_ptr<const facebook::react::ShadowNode> node;
    std::string scopeId;
    folly::dynamic baseProps;   // object, or nullptr when absent
    folly::dynamic stateProps;  // stateName -> props object, or nullptr
    // per-view active state (runtime mode). empty = follow scope state.
    // runtime integrations resolve state names per view (nested themes);
    // scope broadcast stays for compiler-emitted tables.
    std::string activeState;
  };

  // raw JSI: link(shadowNode, slots, scopeId) -> id
  jsi::Value link(jsi::Runtime& rt, const jsi::Value& thisValue,
                  const jsi::Value* args, size_t count);

  // raw JSI: applyViewStates([{id, state, props?}]) -> void
  // batched per-view state selection: for each entry, `props` (when given)
  // replaces the view's state table entry under `state`, the view's active
  // state becomes `state`, and all changed views commit in ONE transaction.
  jsi::Value applyViewStates(jsi::Runtime& rt, const jsi::Value& thisValue,
                             const jsi::Value* args, size_t count);

  // raw JSI: updateViewStateTables([{id, state, props}]) -> void
  // compiler mappings resolve a state once in JS, then fill every matching
  // linked view without moving it off scope-broadcast control.
  jsi::Value updateViewStateTables(jsi::Runtime& rt,
                                   const jsi::Value& thisValue,
                                   const jsi::Value* args, size_t count);

  // raw JSI: getViewState(id) -> {scopeId, activeState, base, states} | null
  // debug/test introspection of a linked view's tables; not a hot path
  jsi::Value getViewState(jsi::Runtime& rt, const jsi::Value& thisValue,
                          const jsi::Value* args, size_t count);

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

  std::unordered_map<double, LinkedView> views_;
  std::unordered_map<std::string, std::string> scopeStates_;  // "" = root
  double nextId_ = 1;
  double commitCount_ = 0;
  double missCount_ = 0;
  jsi::Runtime* runtime_ = nullptr;
};

}  // namespace margelo::nitro::tamagui::registry
