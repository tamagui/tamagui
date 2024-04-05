export function setElementProps(element) {
  if (!element.getBoundingClientRect) {
    element.getBoundingClientRect = () => {
      if (element.unstable_getBoundingClientRect != null) {
        return element.unstable_getBoundingClientRect()
      }
    }
  }
}
