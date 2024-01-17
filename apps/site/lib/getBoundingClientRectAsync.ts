export const getBoundingClientRectAsync = (
  element: Element
): Promise<DOMRectReadOnly | undefined> =>
  new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries, ob) => {
        ob.disconnect()
        resolve(entries[0]?.boundingClientRect)
      },
      {
        threshold: 0.0001,
      }
    )

    observer.observe(element)
  })
