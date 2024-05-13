import type { AnimationDriver } from '@tamagui/web';
import type { WithDecayConfig, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
export type TransitionConfigWithoutRepeats = (({
    type?: 'spring';
} & WithSpringConfig) | ({
    type: 'timing';
} & WithTimingConfig) | ({
    type: 'decay';
} & WithDecayConfig) | {
    type: 'no-animation';
}) & {
    delay?: number;
};
export type TransitionConfig = TransitionConfigWithoutRepeats & {
    /**
     * Number of times this animation should repeat. To make it infinite, use the `loop` boolean.
     *
     * Default: `0`
     *
     * It's worth noting that this value isn't *exactly* a `repeat`. Instead, it uses Reanimated's `withRepeat` function under the hood, which repeats back to the **previous value**. If you want a repeated animation, I recommend setting it to `true` from the start, and make sure you have a `from` value.
     *
     * As a result, this value cannot be reliably changed on the fly. If you would like animations to repeat based on the `from` value, `repeat` must be a number when the component initializes. You can set it to `0` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
     */
    repeat?: number;
    /**
     * Setting this to `true` is the same as `repeat: Infinity`
     *
     * Default: `false`
     *
     * Note: this value cannot be set on the fly. If you would like animations to repeat based on the `from` value, it must be `true` when the component initializes. You can set it to `false` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
     */
    loop?: boolean;
    /**
     * Whether or not the animation repetition should alternate in direction.
     *
     * By default, this is `true`.
     *
     * If `false`, any animations with `loop` or `repeat` will not go back and forth. Instead, they will go from 0 -> 1, and again from 0 -> 1.
     *
     * If `true`, then animations will go 0 -> 1 -> 0.
     *
     * Setting this to `true` is like setting `animationDirection: alternate` in CSS.
     */
    repeatReverse?: boolean;
};
export declare function createAnimations<A extends Record<string, TransitionConfig>>(animations: A): AnimationDriver;
//# sourceMappingURL=createAnimations.d.ts.map