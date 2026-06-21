// the renderer-platform extension point: a custom renderer (e.g. react-native-gpui,
// which reconciles React into GPUI/Metal) registers ONE driver object at app setup
// and tamagui consults it for capabilities the renderer owns better than JS can.
//
// first capability: `pseudo` — the renderer resolves hover natively per hitbox
// (zero latency, no event round-trip) and pushes pseudo-state flips INTO tamagui,
// which runs its normal animation-driver/emitter path off them (spring if styled,
// instant otherwise, zero React commits). this replaces both the per-site
// `transition="0ms"` requirement and the mouseEnter/mouseLeave hover lane on such
// renderers. more capabilities (measure, focus, scroll) can slot in over time.

export interface PlatformDriverPseudoState {
  hovered: boolean
  pressed: boolean
}

export interface PlatformDriver {
  pseudo?: {
    /**
     * subscribe a mounted component's host instance to native pseudo-state flips.
     * the host instance is whatever the renderer's ref resolves to (on
     * react-native-gpui, the reconciler Instance whose `.id` is the host node id).
     * returns an unsubscribe.
     */
    subscribe(
      hostInstance: unknown,
      listener: (state: PlatformDriverPseudoState) => void
    ): () => void
  }
}

let platformDriver: PlatformDriver | null = null

/** register the renderer platform driver — call once at app setup, before render. */
export function setupPlatformDriver(driver: PlatformDriver): void {
  platformDriver = driver
}

export function getPlatformDriver(): PlatformDriver | null {
  return platformDriver
}
