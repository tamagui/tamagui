// vite.config.ts
import { vxs } from "file:///Users/n8/vxrn/packages/vxs/dist/esm/vite.mjs";
var __vite_injected_original_dirname = "/Users/n8/tamagui/apps/testing";
var vite_config_default = {
  define: {
    "process.env.TAMAGUI_REACT_19": '"1"'
  },
  resolve: {
    alias: {
      "~": __vite_injected_original_dirname,
      "react-native-svg": "@tamagui/react-native-svg"
    }
    // dedupe: ['react-wrap-balancer'],
  },
  // optimizeDeps: {
  //   include: ['react-wrap-balancer'],
  // },
  plugins: [
    vxs()
    // tamaguiPlugin(),
    // tamaguiExtractPlugin(),
  ]
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbjgvdGFtYWd1aS9hcHBzL3Rlc3RpbmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9uOC90YW1hZ3VpL2FwcHMvdGVzdGluZy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbjgvdGFtYWd1aS9hcHBzL3Rlc3Rpbmcvdml0ZS5jb25maWcudHNcIjsvLyBpbXBvcnQgeyB0YW1hZ3VpRXh0cmFjdFBsdWdpbiwgdGFtYWd1aVBsdWdpbiB9IGZyb20gJ0B0YW1hZ3VpL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IHZ4cyB9IGZyb20gJ3Z4cy92aXRlJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudi5UQU1BR1VJX1JFQUNUXzE5JzogJ1wiMVwiJyxcbiAgfSxcblxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+JzogaW1wb3J0Lm1ldGEuZGlybmFtZSxcbiAgICAgICdyZWFjdC1uYXRpdmUtc3ZnJzogJ0B0YW1hZ3VpL3JlYWN0LW5hdGl2ZS1zdmcnLFxuICAgIH0sXG5cbiAgICAvLyBkZWR1cGU6IFsncmVhY3Qtd3JhcC1iYWxhbmNlciddLFxuICB9LFxuXG4gIC8vIG9wdGltaXplRGVwczoge1xuICAvLyAgIGluY2x1ZGU6IFsncmVhY3Qtd3JhcC1iYWxhbmNlciddLFxuICAvLyB9LFxuXG4gIHBsdWdpbnM6IFtcbiAgICB2eHMoKSxcbiAgICAvLyB0YW1hZ3VpUGx1Z2luKCksXG4gICAgLy8gdGFtYWd1aUV4dHJhY3RQbHVnaW4oKSxcbiAgXSxcbn0gc2F0aXNmaWVzIFVzZXJDb25maWdcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLFdBQVc7QUFGcEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUTtBQUFBLEVBQ2IsUUFBUTtBQUFBLElBQ04sZ0NBQWdDO0FBQUEsRUFDbEM7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLG9CQUFvQjtBQUFBLElBQ3RCO0FBQUE7QUFBQSxFQUdGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUE7QUFBQTtBQUFBLEVBR047QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
