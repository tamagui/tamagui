import { mergeIfNotShallowEqual } from '@tamagui/is-equal-shallow'
import { getMediaState } from '../hooks/useMedia'
import type { ComponentSetStateShallow, DisposeFn, AllGroupContexts } from '../types'

type SubscribeToContextGroupProps = {
  setStateShallow: ComponentSetStateShallow
  pseudoGroups?: Set<string>
  mediaGroups?: Set<string>
  groupContext: AllGroupContexts
}

export const subscribeToContextGroup = (props: SubscribeToContextGroupProps) => {
  const { pseudoGroups, mediaGroups, groupContext } = props
  if (pseudoGroups || mediaGroups) {
    if (process.env.NODE_ENV === 'development' && !groupContext) {
      console.debug(`No context group found`)
    }

    const disposables = new Set<DisposeFn>()

    if (pseudoGroups) {
      for (const name of [...pseudoGroups]) {
        disposables.add(createGroupListener(name, props))
      }
    }

    if (mediaGroups) {
      for (const name of [...mediaGroups]) {
        disposables.add(createGroupListener(name, props))
      }
    }

    return () => {
      disposables.forEach((d) => d())
    }
  }
}

const createGroupListener = (
  name: string,
  {
    setStateShallow,
    pseudoGroups,
    mediaGroups,
    groupContext,
  }: SubscribeToContextGroupProps
): DisposeFn => {
  const parent = groupContext?.[name]

  if (!parent) {
    return () => {}
  }

  const dispose = parent.subscribe(({ layout, pseudo }) => {
    setStateShallow((prev) => {
      let didChange = false
      const group = prev.group?.[name] || {
        pseudo: {},
        media: {},
      }

      if (pseudo && pseudoGroups?.has(name)) {
        group.pseudo ||= {}
        const next = mergeIfNotShallowEqual(group.pseudo, pseudo)
        if (next !== group.pseudo) {
          Object.assign(group.pseudo, pseudo)
          didChange = true
        }
      } else if (layout && mediaGroups) {
        group.media ||= {}
        const mediaState = getMediaState(mediaGroups, layout)
        const next = mergeIfNotShallowEqual(group.media, mediaState)
        if (next !== group.media) {
          Object.assign(group.media, next)
          didChange = true
        }
      }

      if (didChange) {
        return {
          group: {
            ...prev.group,
            [name]: group,
          },
        }
      }

      return prev
    })
  })

  return () => {
    dispose()
    // we no longer have any active group, need to remove state so the style updates
    setStateShallow({
      group: {},
    })
  }
}
