export function createAnimations<A>(animations: A): {
  useAnimations: any
  animations: A
  View?: any
  Text?: any
} {
  const useAnimations = (props: Object, extra) => {
    const { style, hoverStyle, pressStyle, exitStyle, onDidAnimate, delay } = extra
  }
  return {
    useAnimations,
    animations,
  }
}
