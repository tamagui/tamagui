// ../vite-plugin-internal/src/vite.config.ts
import { join } from "path";
import { tamaguiPlugin } from "file:///Users/n8/tamagui/packages/vite-plugin/dist/esm/index.mjs";
import react from "file:///Users/n8/tamagui/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///Users/n8/tamagui/node_modules/vite/dist/node/index.js";
import reactNative from "file:///Users/n8/tamagui/node_modules/vitest-react-native/plugin.js";
var __vite_injected_original_dirname = "/Users/n8/tamagui/packages/vite-plugin-internal/src";
var isNative = !process.env.DISABLE_REACT_NATIVE && !process.env.DISABLE_NATIVE_TEST && process.env.TAMAGUI_TARGET !== "web";
var nativeExtensions = [
  ".native.tsx",
  ".native.ts",
  ".native.js",
  ".native.jsx",
  ".ios.ts",
  ".ios.tsx",
  ".ios.js",
  ".ios.jsx",
  ".mjs",
  ".js",
  ".mts",
  ".ts",
  ".jsx",
  ".tsx",
  ".json"
];
var final = defineConfig({
  plugins: [
    process.env.DISABLE_REACT_NATIVE ? null : reactNative(),
    react({}),
    tamaguiPlugin({
      components: ["tamagui"],
      config: "./tamagui.config.ts",
      disableWatchTamaguiConfig: true
    })
  ].filter(Boolean),
  define: {
    "process.env.TAMAGUI_TARGET": JSON.stringify(process.env.TAMAGUI_TARGET),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    // otherwise react logs Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
    __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })"
  },
  ...isNative && {
    resolve: {
      alias: {
        "@tamagui/core": `@tamagui/core/native-test`,
        "@tamagui/web": `@tamagui/core/native-test`
      },
      extensions: nativeExtensions
    },
    optimizeDeps: {
      extensions: nativeExtensions,
      jsx: "automatic"
    }
  },
  // @ts-ignore
  test: {
    // for compat with some jest libs (like @testing-library/jest-dom)
    globals: true,
    setupFiles: [join(__vite_injected_original_dirname, "test-setup.ts")],
    // happy-dom has issues with components-test
    environment: process.env.TEST_ENVIRONMENT || "happy-dom",
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    server: {
      deps: {
        external: ["react-native"]
      }
    }
  }
});
var vite_config_default = final;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vdml0ZS1wbHVnaW4taW50ZXJuYWwvc3JjL3ZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL244L3RhbWFndWkvcGFja2FnZXMvdml0ZS1wbHVnaW4taW50ZXJuYWwvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbjgvdGFtYWd1aS9wYWNrYWdlcy92aXRlLXBsdWdpbi1pbnRlcm5hbC9zcmMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL244L3RhbWFndWkvcGFja2FnZXMvdml0ZS1wbHVnaW4taW50ZXJuYWwvc3JjL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuaW1wb3J0IHsgdGFtYWd1aVBsdWdpbiB9IGZyb20gJ0B0YW1hZ3VpL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3ROYXRpdmUgZnJvbSAndml0ZXN0LXJlYWN0LW5hdGl2ZSdcblxuY29uc3QgaXNOYXRpdmUgPVxuICAhcHJvY2Vzcy5lbnYuRElTQUJMRV9SRUFDVF9OQVRJVkUgJiZcbiAgIXByb2Nlc3MuZW52LkRJU0FCTEVfTkFUSVZFX1RFU1QgJiZcbiAgcHJvY2Vzcy5lbnYuVEFNQUdVSV9UQVJHRVQgIT09ICd3ZWInXG5cbmNvbnN0IG5hdGl2ZUV4dGVuc2lvbnMgPSBbXG4gICcubmF0aXZlLnRzeCcsXG4gICcubmF0aXZlLnRzJyxcbiAgJy5uYXRpdmUuanMnLFxuICAnLm5hdGl2ZS5qc3gnLFxuICAnLmlvcy50cycsXG4gICcuaW9zLnRzeCcsXG4gICcuaW9zLmpzJyxcbiAgJy5pb3MuanN4JyxcbiAgJy5tanMnLFxuICAnLmpzJyxcbiAgJy5tdHMnLFxuICAnLnRzJyxcbiAgJy5qc3gnLFxuICAnLnRzeCcsXG4gICcuanNvbicsXG5dXG5cbmNvbnN0IGZpbmFsID0gZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHByb2Nlc3MuZW52LkRJU0FCTEVfUkVBQ1RfTkFUSVZFID8gbnVsbCA6IHJlYWN0TmF0aXZlKCksXG4gICAgcmVhY3Qoe30pLFxuICAgIHRhbWFndWlQbHVnaW4oe1xuICAgICAgY29tcG9uZW50czogWyd0YW1hZ3VpJ10sXG4gICAgICBjb25maWc6ICcuL3RhbWFndWkuY29uZmlnLnRzJyxcbiAgICAgIGRpc2FibGVXYXRjaFRhbWFndWlDb25maWc6IHRydWUsXG4gICAgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudi5UQU1BR1VJX1RBUkdFVCc6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlRBTUFHVUlfVEFSR0VUKSxcbiAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5OT0RFX0VOViksXG4gICAgLy8gb3RoZXJ3aXNlIHJlYWN0IGxvZ3MgRG93bmxvYWQgdGhlIFJlYWN0IERldlRvb2xzIGZvciBhIGJldHRlciBkZXZlbG9wbWVudCBleHBlcmllbmNlOiBodHRwczovL3JlYWN0anMub3JnL2xpbmsvcmVhY3QtZGV2dG9vbHNcbiAgICBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX186ICcoeyBpc0Rpc2FibGVkOiB0cnVlIH0pJyxcbiAgfSxcblxuICAuLi4oaXNOYXRpdmUgJiYge1xuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAdGFtYWd1aS9jb3JlJzogYEB0YW1hZ3VpL2NvcmUvbmF0aXZlLXRlc3RgLFxuICAgICAgICAnQHRhbWFndWkvd2ViJzogYEB0YW1hZ3VpL2NvcmUvbmF0aXZlLXRlc3RgLFxuICAgICAgfSxcbiAgICAgIGV4dGVuc2lvbnM6IG5hdGl2ZUV4dGVuc2lvbnMsXG4gICAgfSxcblxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXh0ZW5zaW9uczogbmF0aXZlRXh0ZW5zaW9ucyxcbiAgICAgIGpzeDogJ2F1dG9tYXRpYycsXG4gICAgfSxcbiAgfSksXG5cbiAgLy8gQHRzLWlnbm9yZVxuICB0ZXN0OiB7XG4gICAgLy8gZm9yIGNvbXBhdCB3aXRoIHNvbWUgamVzdCBsaWJzIChsaWtlIEB0ZXN0aW5nLWxpYnJhcnkvamVzdC1kb20pXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBzZXR1cEZpbGVzOiBbam9pbihfX2Rpcm5hbWUsICd0ZXN0LXNldHVwLnRzJyldLFxuICAgIC8vIGhhcHB5LWRvbSBoYXMgaXNzdWVzIHdpdGggY29tcG9uZW50cy10ZXN0XG4gICAgZW52aXJvbm1lbnQ6IHByb2Nlc3MuZW52LlRFU1RfRU5WSVJPTk1FTlQgfHwgJ2hhcHB5LWRvbScsXG4gICAgaW5jbHVkZTogWycqKi8qLnt0ZXN0LHNwZWN9LntqcyxtanMsY2pzLHRzLG10cyxjdHMsanN4LHRzeH0nXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGRlcHM6IHtcbiAgICAgICAgZXh0ZXJuYWw6IFsncmVhY3QtbmF0aXZlJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBmaW5hbFxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsWUFBWTtBQUVyQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFQeEIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTSxXQUNKLENBQUMsUUFBUSxJQUFJLHdCQUNiLENBQUMsUUFBUSxJQUFJLHVCQUNiLFFBQVEsSUFBSSxtQkFBbUI7QUFFakMsSUFBTSxtQkFBbUI7QUFBQSxFQUN2QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFFQSxJQUFNLFFBQVEsYUFBYTtBQUFBLEVBQ3pCLFNBQVM7QUFBQSxJQUNQLFFBQVEsSUFBSSx1QkFBdUIsT0FBTyxZQUFZO0FBQUEsSUFDdEQsTUFBTSxDQUFDLENBQUM7QUFBQSxJQUNSLGNBQWM7QUFBQSxNQUNaLFlBQVksQ0FBQyxTQUFTO0FBQUEsTUFDdEIsUUFBUTtBQUFBLE1BQ1IsMkJBQTJCO0FBQUEsSUFDN0IsQ0FBQztBQUFBLEVBQ0gsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUVoQixRQUFRO0FBQUEsSUFDTiw4QkFBOEIsS0FBSyxVQUFVLFFBQVEsSUFBSSxjQUFjO0FBQUEsSUFDdkUsd0JBQXdCLEtBQUssVUFBVSxRQUFRLElBQUksUUFBUTtBQUFBO0FBQUEsSUFFM0QsZ0NBQWdDO0FBQUEsRUFDbEM7QUFBQSxFQUVBLEdBQUksWUFBWTtBQUFBLElBQ2QsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsaUJBQWlCO0FBQUEsUUFDakIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFlBQVk7QUFBQSxJQUNkO0FBQUEsSUFFQSxjQUFjO0FBQUEsTUFDWixZQUFZO0FBQUEsTUFDWixLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsTUFBTTtBQUFBO0FBQUEsSUFFSixTQUFTO0FBQUEsSUFDVCxZQUFZLENBQUMsS0FBSyxrQ0FBVyxlQUFlLENBQUM7QUFBQTtBQUFBLElBRTdDLGFBQWEsUUFBUSxJQUFJLG9CQUFvQjtBQUFBLElBQzdDLFNBQVMsQ0FBQyxrREFBa0Q7QUFBQSxJQUM1RCxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsUUFDSixVQUFVLENBQUMsY0FBYztBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
