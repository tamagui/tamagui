---
id: t-msdr1pq6-bl50
title: Fix motion hydration style handoff
status: done
labels:
- hydration
- motion
- v3
priority: 4
backend: git
commits:
- '0503336520'
- 1cb2bd8991
- d4c70d37a6
- f8e8ac07a9
created_at: 1785793005438
updated_at: 1785798913062
field_marks:
  active_form: 1785793005438
  body: 1785793005438
  claim: 1785793005438
  evidence_summary: 1785793005438
  parent: 1785793005438
  priority: 1785793005438
  recovery_ref: 1785793005438
  status: 1785793005438
  title: 1785793005438
---
READ - Current V3 result after root clean:build + build, removal of code/sandbox/node_modules/.vite, code/sandbox/node_modules/.vite-temp, and node_modules/.vite-temp, and a full one dev --clean restart: SSR emits className `is_View _fd-1289797684 _w-1850139701 _h-883471475 _bc-1245296547 _btlr-1542637521 _btrr-423228146 _bbrr-298983462 _bblr-1647959011`; after hydration the node has `{className:"is_View _fd-row", width:"0px", height:"0px", visible:false}`. CSS driver preserves exact server/client hashed classes and passes. Evidence: /tmp/v3-wc-hydration-motion-cleancache.log, /tmp/v3-wc-hydration-css-cleancache.log, /tmp/v3-wc-hydration-motion-defect.log. READ - Exact A/B at direct-emitter parent dbcfed002e2052796022cfc68b5c381dcd72fd7d, after its own clean build and cache removal, also fails: readable SSR classes become hydrated `is_View _fd-row`. Evidence: /tmp/v3-wc-hydration-motion-parent.log. Direct emission is therefore excluded.

Complete V2 reproduction recipe (not a benchmark): create a fresh temp package with exact dependencies `tamagui@2.6.2`, `@tamagui/animations-motion@2.6.2`, `react@19.1.0`, `react-dom@19.1.0`, `react-native-web@0.21.0`, and `vite@8.0.16`. Create `animationsMotion = createAnimations({ quick: { type: "spring", damping: 15, mass: 1, stiffness: 412.5 } })`. Create a Tamagui config with that animations driver, light theme `{background:"#fff",color:"#000"}`, empty media/shorthands, and token categories color empty plus radius/size/space/zIndex each `{true:0}`. Render `<TamaguiProvider config={config} defaultTheme="light"><Configuration animationDriver={animationsMotion}><XStack data-testid="indicator-dot" width={16} height={8} bg="red" rounded={100} transition="quick" animateOnly={["width","backgroundColor"]}/><span data-testid={hydrated ? "hydrated-true" : "hydrated-false"}/></Configuration></TamaguiProvider>`, where a mount effect flips hydrated false to true. SSR with `renderToString(<App/>)` into `<div id="root">`, serve through Vite middleware, and hydrate with `hydrateRoot(document.getElementById("root"), <App/>)`. Vite must alias `react-native` to `react-native-web` and define `process.env` as `{NODE_ENV:"development",TAMAGUI_TARGET:"web"}`. In real Chromium wait for `[data-testid=hydrated-true]`, then read `getComputedStyle(dot).width/height`, `dot.getAttribute("class")`, and visibility from a nonzero bounding rect. READ V2 observed output, verbatim: `{className:"is_View _fd-row", width:"16px", height:"8px", visible:true}`. The throwaway implementation that produced it is currently /tmp/v3-wc-v2-motion.wj4wD8 and its full run log is /tmp/v3-wc-v2-motion-probe.log.

INFERRED - V2 and V3 hand off with identical hydrated className `is_View _fd-row`; V2 applies the handed-off animatable size inline and V3 leaves it 0x0. This is a V3-line runtime regression. Source pointer: code/core/web/src/helpers/getSplitStyles.tsx:1115-1140. READ sub-item - line 1131 calls getCSSStyleAtomic without direct=true, so the surviving non-animatable flexDirection class uses readable `_fd-row` while SSR uses strict `_fd-1289797684`.

Acceptance: after V3 motion hydration the dot remains visible at computed 16px by 8px; CSS hydration parity remains exact; align the secondary non-animatable atomic naming with the direct contract.
