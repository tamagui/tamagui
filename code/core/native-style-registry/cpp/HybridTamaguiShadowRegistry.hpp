#pragma once

#include "HybridTamaguiShadowRegistrySpec.hpp"

#include <jsi/jsi.h>
#include <folly/dynamic.h>
#include <react/renderer/core/ShadowNode.h>
#include <react/renderer/core/ShadowNodeFamily.h>
#include <mutex>
#include <string>
#include <unordered_map>

namespace margelo::nitro::tamagui::styleregistry {

using namespace facebook::react;

struct LinkedView {
  const ShadowNodeFamily* family;
  folly::dynamic styles;  // { "light": {...}, "dark": {...} }
  std::string scopeId;
};

class HybridTamaguiShadowRegistry
    : public HybridTamaguiShadowRegistrySpec {
 public:
  HybridTamaguiShadowRegistry();

  // Nitro typed methods (from spec)
  void setTheme(const std::string& themeName) override;
  void setScopedTheme(
      const std::string& scopeId,
      const std::string& themeName) override;
  std::string getTheme() override;
  void removeScopedTheme(const std::string& scopeId) override;
  double getViewCount() override;
  double getScopeCount() override;

  // Raw JSI methods (registered manually)
  facebook::jsi::Value link(
      facebook::jsi::Runtime& rt, const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* args, size_t count);
  facebook::jsi::Value unlink(
      facebook::jsi::Runtime& rt, const facebook::jsi::Value& thisValue,
      const facebook::jsi::Value* args, size_t count);

  size_t getExternalMemorySize() noexcept override;

 protected:
  void loadHybridMethods() override;

 private:
  std::shared_ptr<const ShadowNode> extractShadowNode(
      facebook::jsi::Runtime& rt, const facebook::jsi::Value& value);

  void applyUpdates(facebook::jsi::Runtime& rt, const std::string* scopeFilter);

  std::mutex mutex_;
  std::string currentTheme_{"light"};
  std::unordered_map<const ShadowNodeFamily*, LinkedView> linkedViews_;
  std::unordered_map<std::string, std::string> scopeThemes_;
  facebook::jsi::Runtime* runtime_{nullptr};
};

}  // namespace margelo::nitro::tamagui::styleregistry
