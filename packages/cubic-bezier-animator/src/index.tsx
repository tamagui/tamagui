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
  cubicBezier?: CubicBuzier
}
export function animate(param: AnimateProps) {
  let start = null
  const easing = param.cubicBezier ? bezier(...param.cubicBezier) : (v: number) => v

  const { x: fromX, y: fromY, scaleX: fromScaleX, scaleY: fromScaleY } = param.from
  const { x: toX, y: toY, scaleX: toScaleX, scaleY: toScaleY } = param.to

  function frame(timestamp) {
    if (!start) start = timestamp
    const progress = timestamp - start!
    const x =
      toX !== undefined
        ? fromX! + (toX - fromX!) * easing(progress / param.duration)
        : undefined // apply the easing function to the progress
    const y =
      toY !== undefined
        ? fromY! + (toY - fromY!) * easing(progress / param.duration)
        : undefined
    const scaleX =
      toScaleX !== undefined
        ? fromScaleX! + (toScaleX - fromScaleX!) * easing(progress / param.duration)
        : undefined
    const scaleY =
      toScaleY !== undefined
        ? fromScaleY! + (toScaleY - fromScaleY!) * easing(progress / param.duration)
        : undefined
    param.onUpdate({ x, y, scaleX, scaleY })

    if (progress < param.duration) {
      requestAnimationFrame(frame) // continue animating
    }
  }
  requestAnimationFrame(frame)
}
