export type PortalContainer = Element | DocumentFragment

let defaultPortalContainer:
  | PortalContainer
  | (() => PortalContainer | null | undefined)
  | null = null

/**
 * Redirect every web <Portal /> that would otherwise render into document.body
 * into `container` instead — for example an element inside a shadow root, where
 * portaling to document.body would escape the shadow boundary and lose its
 * styles. Accepts an element or a getter (useful when the container mounts
 * late). Opt-in and global: apps that never call this keep the document.body
 * behavior unchanged. Pass null (or return null/undefined from the getter) to
 * restore the default. Has no effect on native.
 */
export function setDefaultPortalContainer(
  container: PortalContainer | (() => PortalContainer | null | undefined) | null
): void {
  defaultPortalContainer = container
}

export function resolveDefaultPortalContainer(): PortalContainer {
  const container =
    typeof defaultPortalContainer === 'function'
      ? defaultPortalContainer()
      : defaultPortalContainer
  return container ?? globalThis.document?.body
}
