import { isWeb } from 'tamagui'
// tamagui Image does not expose the underlying image element through its ref
export const useZoomImageOnHover = (ref: any) => {
  if (isWeb) {
    const onMouseMove = (e) => {
      if (!ref.current) return
      const { left, top, width, height } = ref.current.getBoundingClientRect()

      const offsetX = e.clientX - left
      const offsetY = e.clientY - top
      const percentageX = (offsetX / width) * 100
      const percentageY = (offsetY / height) * 100

      ref.current.style.backgroundPosition = `${percentageX}% ${percentageY}%`
    }

    const onMouseEnter = () => {
      if (!ref.current) return
      ref.current.style.transform = 'scale(1.2)'
    }

    const onMouseLeave = () => {
      if (!ref.current) return
      ref.current.style.transform = 'scale(1)'
    }

    return { onMouseMove, onMouseEnter, onMouseLeave, ref }
  }
  return {}
}
