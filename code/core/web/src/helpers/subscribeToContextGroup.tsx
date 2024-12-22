import { mergeIfNotShallowEqual } from './createShallowSetState'
import { getMediaState } from '../hooks/useMedia'
import type { TamaguiComponentState, ComponentContextI, GroupState } from '../types'

export const subscribeToContextGroup = ({
  disabled = false,
  setStateShallow,
  pseudoGroups,
  mediaGroups,
  componentContext,
  state,
}: {
  disabled?: boolean
  setStateShallow: (next?: Partial<TamaguiComponentState> | undefined) => void
  pseudoGroups?: Set<string>
  mediaGroups?: Set<string>
  componentContext: ComponentContextI
  state: TamaguiComponentState
}) => {
  // parent group pseudo listening
  if (pseudoGroups || mediaGroups) {
    const current = {
      pseudo: {},
      media: {},
    } satisfies GroupState

    if (process.env.NODE_ENV === 'development' && !componentContext.groups) {
      console.debug(`No context group found`)
    }

    return componentContext.groups?.subscribe?.((name, { layout, pseudo }) => {
      if (pseudo && pseudoGroups?.has(String(name))) {
        // we emit a partial so merge it + change reference so mergeIfNotShallowEqual runs
        Object.assign(current.pseudo, pseudo)
        persist()
      } else if (layout && mediaGroups) {
        const mediaState = getMediaState(mediaGroups, layout)
        const next = mergeIfNotShallowEqual(current.media, mediaState)
        if (next !== current.media) {
          Object.assign(current.media, next)
          persist()
        }
      }
      function persist() {
        // force it to be referentially different so it always updates
        const group = {
          ...state.group,
          [name]: current,
        }
        setStateShallow({
          group,
        })
      }
    })
  }
}
