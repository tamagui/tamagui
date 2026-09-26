# Tamagui V3 Docs Wording Changes Summary

This document summarizes the wording simplification pass across core documentation pages for Tamagui V3, eliminating marketing jargon, conversational filler, and outdated framing in favor of direct, precise technical explanations.

---

## 1. Introduction (`code/tamagui.dev/data/docs/intro/introduction.mdx` & `MDXComponents.tsx`)

### Header Intro & Sub-bullets (`DocsIntro` in `MDXComponents.tsx`)
- **Before**: "Tamagui makes styling React on any platform a delight. All of its features work the same on both React Native and React web."
- **After**: "Tamagui provides universal styling and UI components for React. All features work consistently across React Native and web."
- **Before (@tamagui/core)**: "@tamagui/core is the base style library, it expands on the React Native style API with many features from CSS, all without a single external dependency. It can entirely replace React Native Web in a much lighter package, with full API compatibility, much improved SSR, more features, and much better performance."
- **After (@tamagui/core)**: "@tamagui/core is the base style library. It expands the React Native style API with CSS capabilities, SSR support, and optimized runtime performance without external dependencies."
- **Before (@tamagui/static)**: "@tamagui/static is an optimizing compiler that significantly improves performance through partial analysis, hoisting, and flattening. It makes sharing code between web and native actually feel great."
- **After (@tamagui/static)**: "@tamagui/static is an optimizing compiler that extracts style props into atomic CSS and flattens component trees at build time."
- **Before (Tamagui Components)**: "Tamagui Components provides composable components for building common UI elements. It's similar to Radix, but works on native and web, and has a powerful Adapt primitive to shapeshift UI based on the platform or media query."
- **After (Tamagui Components)**: "Tamagui Components provides accessible, composable UI primitives for web and native, including the Adapt primitive for responsive and platform-specific presentations."

### Why a Compiler Section
- **Before**: Framed around an elaborate "Frontend Trilemma" metaphor ("Cross-platform apps live inside a trilemma. Pick two of: an app that feels native, one codebase for native and web, and shipping fast...") with large diagrams and conversational paragraphs.
- **After**: Streamlined to direct engineering trade-offs: "Cross-platform development often involves trade-offs between native feel, code reuse, and performance. React Native shares logic across platforms, but on web, styling in JavaScript can mean heavy runtime overhead and larger bundles. Tamagui resolves this with `@tamagui/static`, an optimizing compiler that: [atomic extraction, flattening, hoisting, hook conversion]."

### Highlights Section
- **Before**: Rambling claims including "with the ergonomics of writing your code however you want. Even inline, logic-filled code is optimized" and "so none of the usual limits of 0-runtime libraries, while optionally getting the same great performance."
- **After**: Tight, factual engineering descriptions:
  - "Core depends only on React and supports the full React Native View and Text APIs, style props, styled(), hooks, and typed design tokens in ~28Kb on web."
  - "The optimizing compiler extracts styles into atomic CSS and flattens styled components at build time."
  - "Every feature works with or without the compiler, with graceful fallback to runtime resolution."
  - "useTheme and useMedia hooks provide fine-grained subscription updates."
  - "Unstyled and styled variants are available for all components."

---

## 2. Styling (`code/tamagui.dev/data/docs/intro/styles.mdx`)

### Intro Paragraph
- **Before**: "Styles in Tamagui are props. Every component accepts the React Native style properties plus a set of web additions, and every value can carry conditions for state, screen size, theme, platform, and parent."
- **After**: "Tamagui uses style props across all components. Every element accepts React Native and web styles, with unified support for responsive, theme, and pseudo-state conditions."

---

## 3. Themes (`code/tamagui.dev/data/docs/intro/themes.mdx`)

### Sub-themes Introduction
- **Before**: "One of the unique powers of Tamagui is theme nesting. Define a theme with a name in the form of `parentName_subName` and Tamagui will let you nest themes, with both `parentName` and `subName` being valid theme names. You can do this as many times as you'd like. Here's an example of having three levels:"
- **After**: "Tamagui supports theme nesting. Define sub-themes using the `parentName_subName` format, where each segment resolves as a valid theme. Sub-themes can nest across multiple levels:"

### ThemeBuilder Link
- **Before**: "Once you've learned the basics here, be sure to check out the ThemeBuilder guide for generating more interesting theme suites."
- **After**: "See the [ThemeBuilder guide](/docs/guides/theme-builder) for generating custom theme suites."

### Component Theme Conventions
- **Before**: Rambling and informal paragraphs ("Tamagui comes in two parts: a core library and a full component suite. The core library (`@tamagui/core`) is flexible and doesn't have many rules. But the full UI kit (`tamagui`) has some standard ways of doing things... you can always just use plain old style props ...plus all the pseudo variants for each...").
- **After**: Clear, professional list describing component surface, text/icon color, border, elevation/shadow, and interactive pseudo-states (`background-hover`, `background-press`, `background-focus`).

---

## 4. Installation (`code/tamagui.dev/data/docs/intro/installation.mdx`)

### Bundler Guide Cards
- **Next.js**: "Full-featured React framework with great developer experience." → "React framework for web applications."
- **Expo**: "Platform for creating universal native apps with JavaScript and React." → "Universal React Native application platform."
- **Vite**: "Fast and modern development server and build tool." → "Frontend build tool and development server."
- **Webpack**: "Powerful module bundler for modern JavaScript applications." → "Configurable JavaScript module bundler."
- **Metro**: "Fast, scalable, and serverless JavaScript bundler for React Native." → "Default JavaScript bundler for React Native."
- **One**: "Universal React framework with native support." → "Universal React framework for web and native."
