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
    return style;
  }

  folly::dynamic processed = folly::dynamic::object();

  for (const auto& [key, value] : style.items()) {
    std::string keyStr = key.asString();

    if (colorProps.count(keyStr) && value.isString()) {
      std::string colorStr = value.asString();
      int64_t colorInt = parseColor(colorStr);

      if (colorInt >= 0) {
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

  return processed;
}

namespace jsi = facebook::jsi;

TamaguiStyleRegistry& TamaguiStyleRegistry::getInstance() {
  static TamaguiStyleRegistry instance;
  return instance;
}

void TamaguiStyleRegistry::link(
    Tag tag,
    const folly::dynamic& styles,
    const std::string& scopeId) {
  std::lock_guard<std::mutex> lock(_mutex);

  _linkedViews[tag] = styles;

  if (!scopeId.empty()) {
    _viewScopes[tag] = scopeId;
  }
}

void TamaguiStyleRegistry::unlink(Tag tag) {
  std::lock_guard<std::mutex> lock(_mutex);

  _linkedViews.erase(tag);
  _viewScopes.erase(tag);
}

void TamaguiStyleRegistry::setTheme(
    jsi::Runtime& rt,
    const std::string& themeName) {
  std::lock_guard<std::mutex> lock(_mutex);

  // store the new theme
  _currentTheme = themeName;

  // build tag -> props map for all linked views
  std::unordered_map<Tag, folly::dynamic> tagToProps;

  for (const auto& [tag, styles] : _linkedViews) {
    // check if this view has a scoped theme
    std::string effectiveTheme = themeName;
    auto scopeIt = _viewScopes.find(tag);
    if (scopeIt != _viewScopes.end()) {
      auto scopedThemeIt = _scopeThemes.find(scopeIt->second);
      if (scopedThemeIt != _scopeThemes.end()) {
        effectiveTheme = scopedThemeIt->second;
      }
    }

    // get the style for this theme
    auto style = getStyleForTheme(styles, effectiveTheme);
    if (!style.empty()) {
      // pass style properties directly (not wrapped in "style" key)
      // updateShadowTree expects raw props like { backgroundColor: ..., padding: ... }
      tagToProps[tag] = style;
      if (tagToProps.size() <= 3) {
        os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] tag %d style: %{public}s", tag, folly::toJson(style).c_str());
      }
    }
  }

  if (tagToProps.empty()) {
    return;
  }

  // use UIManager.updateShadowTree() to update all views in a single batch
  // this is the zero-re-render path - updates go directly to native views
  try {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] About to call updateShadowTree with %zu views", tagToProps.size());
    auto binding = UIManagerBinding::getBinding(rt);
    if (binding) {
      os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] Got UIManagerBinding, calling updateShadowTree");
      binding->getUIManager().updateShadowTree(std::move(tagToProps));
      os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] updateShadowTree completed");
    } else {
      os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] UIManagerBinding is null!");
    }
  } catch (const std::exception& e) {
    os_log(OS_LOG_DEFAULT, "[TamaguiStyleRegistry] updateShadowTree exception: %{public}s", e.what());
  }
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

  for (const auto& [tag, styles] : _linkedViews) {
    // only update views in this scope
    auto scopeIt = _viewScopes.find(tag);
    if (scopeIt == _viewScopes.end() || scopeIt->second != scopeId) {
      continue;
    }

    // get the style for this theme
    auto style = getStyleForTheme(styles, themeName);
    if (!style.empty()) {
      // pass style properties directly (not wrapped in "style" key)
      tagToProps[tag] = style;
    }
  }

  if (tagToProps.empty()) {
    return;
  }

  // update all views in this scope
  try {
    auto binding = UIManagerBinding::getBinding(rt);
    if (binding) {
      binding->getUIManager().updateShadowTree(std::move(tagToProps));
    }
  } catch (const std::exception& e) {
    // log error but don't crash
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
  _viewScopes.clear();
  _scopeThemes.clear();
  _currentTheme = "light";
}

folly::dynamic TamaguiStyleRegistry::getStyleForTheme(
    const folly::dynamic& styles,
    const std::string& themeName) const {
  folly::dynamic result = folly::dynamic::object();

  // direct lookup
  if (styles.count(themeName)) {
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
    return processColorsInStyle(result);
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
