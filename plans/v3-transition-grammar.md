# v3 transition grammar

Status: shipped on `transition-unify`. This is the record of what the
`transition` prop became in v3 and why, plus the one piece that was
deliberately left for later.

## The problem

v2 had four ways to say the same thing and three tables that disagreed.

- `default` selected a preset (`transition={{ default: 'bouncy' }}`), and
  inside a per-property override `type` selected a preset too
  (`transition={{ x: { type: 'quick' } }}`). But `type` also meant the
  mechanism, `spring` or `timing`. One key, two meanings, and which one you got
  depended on nesting depth.
- The array form (`transition={['bouncy', { opacity: 'quick' }]}`) was a third
  spelling of the object form.
- `animateOnly` was a separate prop that did what a CSS transition property
  list does.
- Every driver shipped its own preset table. `bouncy` was a 350ms cubic-bezier
  on css, a stiffness-120 spring on react-native, and a stiffness-90 spring on
  motion. Same name, three different motions.
- The compiler and the runtime each had their own parser for the string form,
  so a raw css string and a resolved transition could disagree about what `y`
  or `rotateX` targets. That is the kind of divergence that produces a bug
  nobody can reproduce from the source.

## What it is now

One grammar. `transition` takes a css transition string, a preset name, or an
object, and all three parse through the same code.

```tsx
<View transition="200ms ease-out" />
<View transition="transform 200ms, opacity 100ms 50ms" />
<View transition="quick" />
<View transition="transform quick, opacity 100ms" />
<View transition="spring(400ms, 0.5)" />
<View transition="none" />

<View
  transition={{
    preset: 'quick',
    delay: 100,
    properties: 'transform, opacity',
    opacity: '150ms ease-out',
  }}
/>
```

Rules that fell out of it, each of which removes a special case:

- **The settings are a closed set.** `preset`, `duration`, `bounce`, `easing`,
  `delay`, `behavior`, `properties`, `spring`, `enter`, `exit`. Every other key
  names a style property and gets its own timing. An unknown key is a
  diagnostic, never a silent no-op. `TRANSITION_RESERVED_KEYS` in
  `@tamagui/style-grammar/transitions` is the one definition.
- **Entries stand alone, like css.** `{ duration: 200, opacity: {} }` gives
  `opacity` no timing, exactly as `transition: all 200ms, opacity` does.
  Per-property entries do not inherit from the base. Use `preset` when you want
  a shared starting point.
- **`type` only ever means the mechanism.** `default` is gone as a preset
  selector, and so is the array form.
- **`animateOnly` became `properties` inside the transition.**
  `animateOnly={[]}` is `transition="none"`.
- **`enter` and `exit` are whole transition values.** They take a preset name,
  a css string, or an object, and while they apply they replace the base rather
  than merging into it. That matches how a state style replaces a base style,
  and it means you can read what runs on enter without holding the base in your
  head.

## Springs

The canonical spring is `{ duration, bounce }`.

`duration` is the undamped period, which is what "how fast does this feel"
actually means. It is not a stopwatch: a bouncy spring keeps ringing past it,
which is the point of a bouncy spring. `bounce` is 0 for critically damped, up
toward 1 for loose and oscillating, negative for sluggish. Outside -1..1 is an
error.

`spring: { stiffness, damping, mass, ... }` stays as the escape hatch, and
Tamagui derives the duration/bounce pair back out of it so the same motion
reaches every driver. It is a projection of the canonical pair, not a second
API. Conversions live in `style-grammar/src/runtime/spring.ts`
(`springFromDurationBounce`, `springToDurationBounce`, `bounceToDampingRatio`).

`bounce` rather than `bounciness` because `bounciness` is already taken
elsewhere in the ecosystem with a different range, and because this is the same
number SwiftUI and the css spring proposal use.

**Springs work on the css driver.** `springToLinearEasing` samples the real
spring curve, overshoot included, into a css `linear()` easing, so no
javascript runs. The honest limitation is interruption: a css spring cannot
pick up mid-flight velocity when a new value lands on it. The docs say that
instead of the old "no spring physics" line, which was never true after this.

## Presets

`code/core/animation-helpers/src/presets.ts` is the single table, identical on
all four drivers: `quickest`, `quicker`, `quick` (each with a `LessBouncy`
variant), `medium`, `slow`, `slowest`, `lazy`, `superLazy`, `bouncy`,
`superBouncy`. All springs.

There are no `'200ms'`-style preset names any more, and we are not adding more
presets. A duration is css now, so `transition="200ms ease-out"` needs nothing
configured. Everything past this table comes from the user's own
`animations` config, and a name in that config is worth having only when it
means something a duration cannot say.

## One parser, one property map

The compiler/runtime split is closed:

- `parseTransition` / `parseTransitionObject` in
  `@tamagui/style-grammar/transitions` is the only parser. The drivers import
  it directly, which is why that entrypoint is self-contained and does not pull
  in compiler tooling.
- `canonicalTransitionProperty` in `@tamagui/animation-helpers` is the only
  answer to "which css property does this style key animate under". x/y and
  `translate*` map to `translate`, `scale*` to `scale`, `rotate`/`rotateX/Y/Z`
  and `skew*`/`perspective`/`matrix` to their css names or `transform`,
  everything else camelCase to kebab. `grammarConfig.normalizeTransition` calls
  it rather than keeping its own map, which also fixed
  `transition="translateX 200ms"` emitting the invalid `translate-x 200ms`.

`transitionAlignment.web.test.tsx` asserts the string path and the object path
land on the same emitted css, so a future divergence fails a test rather than
shipping.

## Driver notes

- **css**: springs sample to `linear()`; per-property lists emit as a real css
  transition list. Cannot resume mid-flight.
- **motion** and **reanimated**: take duration/bounce through their own spring
  configs, so a config authored once behaves the same.
- **react-native**: the `avoidReRenders` emitter path resolves its own handed-in
  transition rather than assuming the mounted state's, which is what
  `hasAnimatedLayoutKey` needs to decide the native driver.

## Fixed on the way through

- `flexBasis` was missing from the runtime token classifier in `@tamagui/web`
  while the grammar registry and `runtime/tokenCategories.ts` both had it. It
  read as a regression only because the baseline checkout's stale `dist` made
  the parity assertion skip itself.
- `hasAnimatedLayoutKey` gained a third argument earlier in the work and one
  react-native call site was left at two, which would have thrown at runtime in
  `getTransitionForKey`. Root typecheck caught it; package suites could not.

## Deferred: css `animation` and looping

The original ask included exploring css `animation`-style support for v3
(looping, keyframes). It is not built, on purpose. The transition grammar
landed as one coherent unit and looping is a genuinely separate feature with
its own hard questions:

- Every driver needs an answer, and only the css driver gets keyframes for
  free. Reanimated has `withRepeat`, motion has `repeat`, react-native's
  `Animated.loop` cannot run on the native driver for every property we allow.
- Keyframes are a named global resource. `@keyframes` has to be registered,
  deduped, and garbage collected the way the style cache is, and the compiler
  has to extract them.
- An animation and a transition on the same property conflict, and css's answer
  (animation wins while running) is a rule we would have to reproduce in three
  javascript drivers.

If we build it, the shape that fits what shipped is an `animation` prop with
the same string-or-object grammar, `transition` keeping its meaning untouched:

```tsx
<View animation="spin 2s linear infinite" />
<View animation={{ keyframes: { from: { rotate: '0deg' }, to: { rotate: '360deg' } }, duration: 2000, iterations: 'infinite' }} />
```

Reanimated's recent css-style animation support is the closest prior art and is
worth reading before designing this.

## Migration

- `transition={{ default: 'bouncy' }}` becomes `transition="bouncy"` or
  `transition={{ preset: 'bouncy' }}`.
- `transition={{ x: { type: 'quick' } }}` becomes `transition={{ x: 'quick' }}`.
- The array form becomes the object form.
- `animateOnly={['transform']}` becomes `transition={{ properties: 'transform' }}`,
  `animateOnly={[]}` becomes `transition="none"`.
- `enterStyle`/`exitStyle` timings go in `transition`'s `enter`/`exit`, each a
  complete transition value.
