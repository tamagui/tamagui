import { bezier } from './cubicBezier'

type TransformType = {
  x: number | undefined
  y: number | undefined
  scaleX: number | undefined
  scaleY: number | undefined
}

type CubicBuzier = [number, number, number, number]
interface AnimateProps {
  from: TransformType
  to: TransformType
  duration: number
  onUpdate: (param: TransformType) => void
  cubicBuzier: CubicBuzier
}
export function animate(param: AnimateProps) {
  const start = performance.now()
  const easing = param.cubicBuzier ? bezier(...param.cubicBuzier) : (v: number) => v

  const { x: fromX, y: fromY, scaleX: fromScaleX, scaleY: fromScaleY } = param.from
  const { x: toX, y: toY, scaleX: toScaleX, scaleY: toScaleY } = param.to

  function frame(currentTime) {
    const elapsed = currentTime - start
    const progress = elapsed / param.duration
    const x = toX !== undefined ? easing(progress) * fromX! + toX : undefined // apply the easing function to the progress
    const y = toY !== undefined ? easing(progress) * fromY! + toY : undefined
    const scaleX =
      toScaleX !== undefined ? easing(progress) * fromScaleX! + toScaleX : undefined
    const scaleY =
      toScaleY !== undefined ? easing(progress) * fromScaleY! + toScaleY : undefined
    param.onUpdate({ x, y, scaleX, scaleY })

    if (progress < 1) {
      requestAnimationFrame(frame) // continue animating
    }
  }
  requestAnimationFrame(frame)
}
