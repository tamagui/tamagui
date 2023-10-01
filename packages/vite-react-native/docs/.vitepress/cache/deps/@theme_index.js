import {
  computed,
  getCurrentInstance,
  getCurrentScope,
  onMounted,
  onScopeDispose,
  ref,
  unref,
  watch,
  watchEffect
} from "./chunk-4EKHRIZA.js";

// ../../node_modules/vitepress/dist/client/theme-default/index.js
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/fonts.css";

// ../../node_modules/vitepress/dist/client/theme-default/without-fonts.js
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/vars.css";
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/base.css";
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/utils.css";
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/components/custom-block.css";
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code-group.css";
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/styles/components/vp-sponsor.css";
import VPBadge from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue";
import Layout from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/Layout.vue";
import { default as default2 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPImage.vue";
import { default as default3 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPButton.vue";
import { default as default4 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue";
import { default as default5 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue";
import { default as default6 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue";
import { default as default7 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue";
import { default as default8 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue";
import { default as default9 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue";
import { default as default10 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue";
import { default as default11 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue";
import { default as default12 } from "/Users/n8/tamagui/node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue";

// ../../node_modules/@vueuse/shared/index.mjs
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
var isIOS = getIsIOS();
function getIsIOS() {
  var _a;
  return isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
}
function cacheStringFunction(fn) {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
function identity(arg) {
  return arg;
}

// ../../node_modules/@vueuse/core/index.mjs
var defaultWindow = isClient ? window : void 0;
var defaultDocument = isClient ? window.document : void 0;
var defaultNavigator = isClient ? window.navigator : void 0;
var defaultLocation = isClient ? window.location : void 0;
function useMounted() {
  const isMounted = ref(false);
  if (getCurrentInstance()) {
    onMounted(() => {
      isMounted.value = true;
    });
  }
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isSupported = useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
  let mediaQuery;
  const matches = ref(false);
  const handler = (event) => {
    matches.value = event.matches;
  };
  const cleanup = () => {
    if (!mediaQuery)
      return;
    if ("removeEventListener" in mediaQuery)
      mediaQuery.removeEventListener("change", handler);
    else
      mediaQuery.removeListener(handler);
  };
  const stopWatch = watchEffect(() => {
    if (!isSupported.value)
      return;
    cleanup();
    mediaQuery = window2.matchMedia(toValue(query));
    if ("addEventListener" in mediaQuery)
      mediaQuery.addEventListener("change", handler);
    else
      mediaQuery.addListener(handler);
    matches.value = mediaQuery.matches;
  });
  tryOnScopeDispose(() => {
    stopWatch();
    cleanup();
    mediaQuery = void 0;
  });
  return matches;
}
var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var globalKey = "__vueuse_ssr_handlers__";
var handlers = getHandlers();
function getHandlers() {
  if (!(globalKey in _global))
    _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
var defaultState = {
  x: 0,
  y: 0,
  pointerId: 0,
  pressure: 0,
  tiltX: 0,
  tiltY: 0,
  width: 0,
  height: 0,
  twist: 0,
  pointerType: null
};
var keys = Object.keys(defaultState);
var DEFAULT_UNITS = [
  { max: 6e4, value: 1e3, name: "second" },
  { max: 276e4, value: 6e4, name: "minute" },
  { max: 72e6, value: 36e5, name: "hour" },
  { max: 5184e5, value: 864e5, name: "day" },
  { max: 24192e5, value: 6048e5, name: "week" },
  { max: 28512e6, value: 2592e6, name: "month" },
  { max: Number.POSITIVE_INFINITY, value: 31536e6, name: "year" }
];
var _TransitionPresets = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
var TransitionPresets = Object.assign({}, { linear: identity }, _TransitionPresets);

// ../../node_modules/vitepress/dist/client/shared.js
var inBrowser = typeof document !== "undefined";

// ../../node_modules/vitepress/dist/client/theme-default/support/utils.js
import { withBase } from "vitepress";

// ../../node_modules/vitepress/dist/client/theme-default/composables/data.js
import { useData as useData$ } from "vitepress";
var useData = useData$;

// ../../node_modules/vitepress/dist/client/theme-default/support/utils.js
function ensureStartingSlash(path) {
  return /^\//.test(path) ? path : `/${path}`;
}

// ../../node_modules/vitepress/dist/client/theme-default/support/sidebar.js
function getSidebar(_sidebar, path) {
  if (Array.isArray(_sidebar))
    return addBase(_sidebar);
  if (_sidebar == null)
    return [];
  path = ensureStartingSlash(path);
  const dir = Object.keys(_sidebar).sort((a, b) => {
    return b.split("/").length - a.split("/").length;
  }).find((dir2) => {
    return path.startsWith(ensureStartingSlash(dir2));
  });
  const sidebar = dir ? _sidebar[dir] : [];
  return Array.isArray(sidebar) ? addBase(sidebar) : addBase(sidebar.items, sidebar.base);
}
function getSidebarGroups(sidebar) {
  const groups = [];
  let lastGroupIndex = 0;
  for (const index in sidebar) {
    const item = sidebar[index];
    if (item.items) {
      lastGroupIndex = groups.push(item);
      continue;
    }
    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] });
    }
    groups[lastGroupIndex].items.push(item);
  }
  return groups;
}
function addBase(items, _base) {
  return [...items].map((_item) => {
    const item = { ..._item };
    const base = item.base || _base;
    if (base && item.link)
      item.link = base + item.link;
    if (item.items)
      item.items = addBase(item.items, base);
    return item;
  });
}

// ../../node_modules/vitepress/dist/client/theme-default/composables/sidebar.js
function useSidebar() {
  const { frontmatter, page, theme: theme2 } = useData();
  const is960 = useMediaQuery("(min-width: 960px)");
  const isOpen = ref(false);
  const _sidebar = computed(() => {
    const sidebarConfig = theme2.value.sidebar;
    const relativePath = page.value.relativePath;
    return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
  });
  const sidebar = ref(_sidebar.value);
  watch(_sidebar, (next, prev) => {
    if (JSON.stringify(next) !== JSON.stringify(prev))
      sidebar.value = _sidebar.value;
  });
  const hasSidebar = computed(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && frontmatter.value.layout !== "home";
  });
  const leftAside = computed(() => {
    if (hasAside)
      return frontmatter.value.aside == null ? theme2.value.aside === "left" : frontmatter.value.aside === "left";
    return false;
  });
  const hasAside = computed(() => {
    if (frontmatter.value.layout === "home")
      return false;
    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside;
    return theme2.value.aside !== false;
  });
  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value);
  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
  });
  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }
  function toggle() {
    isOpen.value ? close() : open();
  }
  return {
    isOpen,
    sidebar,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle
  };
}
var hashRef = ref(inBrowser ? location.hash : "");
if (inBrowser) {
  window.addEventListener("hashchange", () => {
    hashRef.value = location.hash;
  });
}

// ../../node_modules/vitepress/dist/client/theme-default/without-fonts.js
var theme = {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", VPBadge);
  }
};
var without_fonts_default = theme;
export {
  default3 as VPButton,
  default7 as VPDocAsideSponsors,
  default5 as VPHomeFeatures,
  default4 as VPHomeHero,
  default6 as VPHomeSponsors,
  default2 as VPImage,
  default8 as VPSponsors,
  default12 as VPTeamMembers,
  default9 as VPTeamPage,
  default11 as VPTeamPageSection,
  default10 as VPTeamPageTitle,
  without_fonts_default as default,
  useSidebar
};
//# sourceMappingURL=@theme_index.js.map
