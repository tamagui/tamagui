/**
 * TamaguiStyleRegistry.cpp
 *
 * Implementation of the native style registry using RN 0.81's
 * UIManager.updateShadowTree() for zero-re-render theme switching.
 */

#include "TamaguiStyleRegistry.h"

#include <folly/json.h>
#include <os/log.h>
#include <cmath>
#include <regex>
#include <sstream>
#include <string>
#include <unordered_set>
#include <vector>

namespace tamagui {

// color property names that need conversion
static const std::unordered_set<std::string> colorProps = {
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "shadowColor",
    "textDecorationColor",
    "textShadowColor",
    "tintColor",
    "overlayColor",
};

/**
 * Parse a hex color string to ARGB integer.
 * Supports #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 */
static int64_t parseHexColor(const std::string& hex) {
  std::string h = hex.substr(1); // remove #

  uint8_t r, g, b, a = 255;

  if (h.length() == 3) {
    // #RGB -> #RRGGBB
    r = std::stoi(std::string(2, h[0]), nullptr, 16);
    g = std::stoi(std::string(2, h[1]), nullptr, 16);
    b = std::stoi(std::string(2, h[2]), nullptr, 16);
  } else if (h.length() == 4) {
    // #RGBA -> #RRGGBBAA
    r = std::stoi(std::string(2, h[0]), nullptr, 16);
    g = std::stoi(std::string(2, h[1]), nullptr, 16);
    b = std::stoi(std::string(2, h[2]), nullptr, 16);
    a = std::stoi(std::string(2, h[3]), nullptr, 16);
  } else if (h.length() == 6) {
    // #RRGGBB
    r = std::stoi(h.substr(0, 2), nullptr, 16);
    g = std::stoi(h.substr(2, 2), nullptr, 16);
    b = std::stoi(h.substr(4, 2), nullptr, 16);
  } else if (h.length() == 8) {
    // #RRGGBBAA
    r = std::stoi(h.substr(0, 2), nullptr, 16);
    g = std::stoi(h.substr(2, 2), nullptr, 16);
    b = std::stoi(h.substr(4, 2), nullptr, 16);
    a = std::stoi(h.substr(6, 2), nullptr, 16);
  } else {
    return -1; // invalid
  }

  // ARGB format (what RN expects)
  return (static_cast<int64_t>(a) << 24) |
         (static_cast<int64_t>(r) << 16) |
         (static_cast<int64_t>(g) << 8) |
         static_cast<int64_t>(b);
}

/**
 * Convert HSL to RGB.
 * h: 0-360, s: 0-100, l: 0-100
 */
static void hslToRgb(double h, double s, double l, uint8_t& r, uint8_t& g, uint8_t& b) {
  s /= 100.0;
  l /= 100.0;

  double c = (1.0 - std::abs(2.0 * l - 1.0)) * s;
  double x = c * (1.0 - std::abs(std::fmod(h / 60.0, 2.0) - 1.0));
  double m = l - c / 2.0;

  double rp, gp, bp;

  if (h < 60) {
    rp = c; gp = x; bp = 0;
  } else if (h < 120) {
    rp = x; gp = c; bp = 0;
  } else if (h < 180) {
    rp = 0; gp = c; bp = x;
  } else if (h < 240) {
    rp = 0; gp = x; bp = c;
  } else if (h < 300) {
    rp = x; gp = 0; bp = c;
  } else {
    rp = c; gp = 0; bp = x;
  }

  r = static_cast<uint8_t>(std::round((rp + m) * 255));
  g = static_cast<uint8_t>(std::round((gp + m) * 255));
  b = static_cast<uint8_t>(std::round((bp + m) * 255));
}

/**
 * Parse HSL/HSLA color string to ARGB integer.
 * Supports hsl(h, s%, l%) and hsla(h, s%, l%, a)
 */
static int64_t parseHslColor(const std::string& color) {
  // match hsl(h, s%, l%) or hsla(h, s%, l%, a)
  std::regex hslRegex(R"(hsla?\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\))");
  std::smatch match;

  if (!std::regex_match(color, match, hslRegex)) {
    return -1;
  }

  double h = std::stod(match[1].str());
  double s = std::stod(match[2].str());
  double l = std::stod(match[3].str());
  double a = match[4].matched ? std::stod(match[4].str()) : 1.0;

  uint8_t r, g, b;
  hslToRgb(h, s, l, r, g, b);
  uint8_t alpha = static_cast<uint8_t>(std::round(a * 255));

  return (static_cast<int64_t>(alpha) << 24) |
         (static_cast<int64_t>(r) << 16) |
         (static_cast<int64_t>(g) << 8) |
         static_cast<int64_t>(b);
}

/**
 * Parse RGB/RGBA color string to ARGB integer.
 * Supports rgb(r, g, b) and rgba(r, g, b, a)
 */
static int64_t parseRgbColor(const std::string& color) {
  // match rgb(r, g, b) or rgba(r, g, b, a)
  std::regex rgbRegex(R"(rgba?\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\))");
  std::smatch match;

  if (!std::regex_match(color, match, rgbRegex)) {
    return -1;
  }

  uint8_t r = static_cast<uint8_t>(std::stod(match[1].str()));
  uint8_t g = static_cast<uint8_t>(std::stod(match[2].str()));
  uint8_t b = static_cast<uint8_t>(std::stod(match[3].str()));
  double a = match[4].matched ? std::stod(match[4].str()) : 1.0;
  uint8_t alpha = static_cast<uint8_t>(std::round(a * 255));

  return (static_cast<int64_t>(alpha) << 24) |
         (static_cast<int64_t>(r) << 16) |
         (static_cast<int64_t>(g) << 8) |
         static_cast<int64_t>(b);
}

/**
 * Parse any color string to ARGB integer.
 * Returns -1 if parsing fails.
 */
static int64_t parseColor(const std::string& color) {
  if (color.empty()) {
    return -1;
  }

  if (color[0] == '#') {
    return parseHexColor(color);
  }

  if (color.substr(0, 3) == "hsl") {
    return parseHslColor(color);
  }

  if (color.substr(0, 3) == "rgb") {
    return parseRgbColor(color);
  }

  // TODO: named colors (black, white, etc.)
  return -1;
}

/**
 * Process colors in a style object, converting strings to integers.
 */
static folly::dynamic processColorsInStyle(const folly::dynamic& style) {
  if (!style.isObject()) {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] processColorsInStyle: not an object");
    return style;
  }

  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] processColorsInStyle: processing %zu keys", style.size());

  folly::dynamic processed = folly::dynamic::object();

  for (const auto& [key, value] : style.items()) {
    std::string keyStr = key.asString();

    if (colorProps.count(keyStr) && value.isString()) {
      std::string colorStr = value.asString();
      os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] parsing color %{public}s: %{public}s", keyStr.c_str(), colorStr.c_str());
      int64_t colorInt = parseColor(colorStr);

      if (colorInt >= 0) {
        os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] parsed color %{public}s -> %lld", keyStr.c_str(), colorInt);
        processed[key] = colorInt;
      } else {
        // keep original if parsing failed
        processed[key] = value;
        os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] Failed to parse color: %{public}s", colorStr.c_str());
      }
    } else {
      processed[key] = value;
    }
  }

  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] processColorsInStyle done");
  return processed;
}

namespace jsi = facebook::jsi;

TamaguiStyleRegistry& TamaguiStyleRegistry::getInstance() {
  static TamaguiStyleRegistry instance;
  return instance;
}

void TamaguiStyleRegistry::link(
    jsi::Runtime& rt,
    const jsi::Value& ref,
    const folly::dynamic& styles,
    const std::string& scopeId) {
  std::lock_guard<std::mutex> lock(_mutex);

  try {
    // extract ShadowNode from ref using RN 0.81+ Bridging API
    auto shadowNode = Bridging<std::shared_ptr<const ShadowNode>>::fromJs(rt, ref);
    if (!shadowNode) {
      os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] link: shadowNode is null");
      return;
    }

    // get the family - this is what we need to update nativeProps_DEPRECATED
    const ShadowNodeFamily* family = &shadowNode->getFamily();
    Tag tag = family->getTag();

    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] link: tag=%d family=%p scopeId=%{public}s",
           tag, (void*)family, scopeId.c_str());

    _linkedViews[tag] = LinkedView{
      .family = family,
      .styles = styles,
      .scopeId = scopeId
    };
  } catch (const std::exception& e) {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] link exception: %{public}s", e.what());
  }
}

void TamaguiStyleRegistry::linkByTag(
    Tag tag,
    const folly::dynamic& styles,
    const std::string& scopeId) {
  std::lock_guard<std::mutex> lock(_mutex);

  // legacy method - no family pointer, won't persist through reconciliation
  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] linkByTag: tag=%d, scopeId=%{public}s, styles keys=%zu", tag, scopeId.c_str(), styles.size());

  // log the first theme key for debugging
  if (styles.isObject() && styles.size() > 0) {
    auto it = styles.items().begin();
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] linkByTag: first theme=%{public}s", it->first.asString().c_str());
  }

  _linkedViews[tag] = LinkedView{
    .family = nullptr,  // can't update nativeProps_DEPRECATED without family
    .styles = styles,
    .scopeId = scopeId
  };

  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] linkByTag: total linkedViews=%zu", _linkedViews.size());
}

void TamaguiStyleRegistry::unlink(Tag tag) {
  std::lock_guard<std::mutex> lock(_mutex);
  _linkedViews.erase(tag);
}

void TamaguiStyleRegistry::setTheme(
    jsi::Runtime& rt,
    const std::string& themeName) {
  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] C++ setTheme: %{public}s (DISABLED - just storing theme)", themeName.c_str());

  // DISABLED: all native style updates are disabled until we properly handle
  // React reconciliation invalidating tags. Just store the theme name for now.
  std::lock_guard<std::mutex> lock(_mutex);
  _currentTheme = themeName;
  return;

  // ORIGINAL CODE BELOW - DISABLED
  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] acquired lock, linkedViews: %zu", _linkedViews.size());

  // store the new theme
  // _currentTheme = themeName;

  // get UIManager for looking up ShadowNodes by tag
  auto binding = UIManagerBinding::getBinding(rt);
  if (!binding) {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] UIManagerBinding is null!");
    return;
  }
  auto& uiManager = binding->getUIManager();
  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] got UIManager");

  // build tag -> props map for all linked views
  std::unordered_map<Tag, folly::dynamic> tagToProps;

  for (auto& [tag, view] : _linkedViews) {
    // check if this view has a scoped theme override
    std::string effectiveTheme = themeName;
    if (!view.scopeId.empty()) {
      auto scopedThemeIt = _scopeThemes.find(view.scopeId);
      if (scopedThemeIt != _scopeThemes.end()) {
        effectiveTheme = scopedThemeIt->second;
      }
    }

    // get the style for this theme
    auto style = getStyleForTheme(view.styles, effectiveTheme);
    if (!style.empty()) {
      // pass style props directly - updateShadowTree will merge them via RawProps
      // which then gets processed by the component descriptor
      tagToProps[tag] = style;
      os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] tag %d -> props: %{public}s", tag, folly::toJson(style).c_str());
    } else {
      os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] tag %d -> NO STYLE for theme %{public}s", tag, effectiveTheme.c_str());
    }
  }

  if (tagToProps.empty()) {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] setTheme: no views to update!");
    return;
  }

  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] setTheme '%{public}s': %zu views", themeName.c_str(), tagToProps.size());

  // DISABLED: updateShadowTree causes crash when React reconciliation invalidates tags
  // the tags we registered become stale after React re-renders on theme change
  // TODO: need to either validate tags or use ShadowNodeFamily persistence properly
  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] updateShadowTree DISABLED - relying on JS setNativeProps fallback");

  // // SIMPLIFIED: just call updateShadowTree without nativeProps_DEPRECATED for now
  // // this won't persist through reconciliation but should show the visual update
  // try {
  //   os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] calling updateShadowTree...");
  //   uiManager.updateShadowTree(std::move(tagToProps));
  //   os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] updateShadowTree completed");
  // } catch (const std::exception& e) {
  //   os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] updateShadowTree exception: %{public}s", e.what());
  // }

  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] C++ setTheme END");
}

std::string TamaguiStyleRegistry::getTheme() const {
  std::lock_guard<std::mutex> lock(_mutex);
  return _currentTheme;
}

void TamaguiStyleRegistry::setScopedTheme(
    jsi::Runtime& rt,
    const std::string& scopeId,
    const std::string& themeName) {
  std::lock_guard<std::mutex> lock(_mutex);

  // store the scoped theme
  _scopeThemes[scopeId] = themeName;

  // build tag -> props map for views in this scope
  std::unordered_map<Tag, folly::dynamic> tagToProps;
  std::vector<std::pair<const ShadowNodeFamily*, folly::dynamic>> familyUpdates;

  for (const auto& [tag, view] : _linkedViews) {
    // only update views in this scope
    if (view.scopeId != scopeId) {
      continue;
    }

    // get the style for this theme
    auto style = getStyleForTheme(view.styles, themeName);
    if (!style.empty()) {
      // pass style props directly
      tagToProps[tag] = style;

      if (view.family != nullptr) {
        familyUpdates.push_back({view.family, style});
      }
    }
  }

  if (tagToProps.empty()) {
    return;
  }

  // update nativeProps_DEPRECATED for persistence
  for (const auto& [family, propsToUpdate] : familyUpdates) {
    auto* mutableFamily = const_cast<ShadowNodeFamily*>(family);
    if (mutableFamily->nativeProps_DEPRECATED) {
      mutableFamily->nativeProps_DEPRECATED->update(propsToUpdate);
    } else {
      mutableFamily->nativeProps_DEPRECATED = std::make_unique<folly::dynamic>(propsToUpdate);
    }
  }

  // update shadow tree
  try {
    auto binding = UIManagerBinding::getBinding(rt);
    if (binding) {
      binding->getUIManager().updateShadowTree(std::move(tagToProps));
    }
  } catch (const std::exception& e) {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] setScopedTheme exception: %{public}s", e.what());
  }
}

RegistryStats TamaguiStyleRegistry::getStats() const {
  std::lock_guard<std::mutex> lock(_mutex);

  return RegistryStats{
      .viewCount = _linkedViews.size(),
      .scopeCount = _scopeThemes.size(),
      .currentTheme = _currentTheme};
}

void TamaguiStyleRegistry::reset() {
  std::lock_guard<std::mutex> lock(_mutex);

  _linkedViews.clear();
  _scopeThemes.clear();
  _currentTheme = "light";
}

folly::dynamic TamaguiStyleRegistry::getStyleForTheme(
    const folly::dynamic& styles,
    const std::string& themeName) const {
  folly::dynamic result = folly::dynamic::object();

  os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] getStyleForTheme looking for: %{public}s", themeName.c_str());

  // direct lookup
  if (styles.count(themeName)) {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] getStyleForTheme: found direct match");
    auto style = styles[themeName];
    // remove __themes metadata if present
    if (style.isObject() && style.count("__themes")) {
      for (const auto& [key, value] : style.items()) {
        if (key.asString() != "__themes") {
          result[key] = value;
        }
      }
    } else {
      result = style;
    }
    // process colors to integers
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] getStyleForTheme: calling processColorsInStyle");
    auto processed = processColorsInStyle(result);
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] getStyleForTheme: returning processed style");
    return processed;
  }

  // search through __themes arrays for deduplication
  for (const auto& [key, style] : styles.items()) {
    if (style.isObject() && style.count("__themes")) {
      const auto& themes = style["__themes"];
      if (themes.isArray()) {
        for (const auto& t : themes) {
          if (t.isString() && t.asString() == themeName) {
            // found via deduplication
            for (const auto& [k, v] : style.items()) {
              if (k.asString() != "__themes") {
                result[k] = v;
              }
            }
            // process colors to integers
            return processColorsInStyle(result);
          }
        }
      }
    }
  }

  // fallback to base theme (dark_blue -> dark)
  auto underscorePos = themeName.find('_');
  if (underscorePos != std::string::npos) {
    std::string baseTheme = themeName.substr(0, underscorePos);
    return getStyleForTheme(styles, baseTheme);
  }

  return folly::dynamic::object();
}

} // namespace tamagui
