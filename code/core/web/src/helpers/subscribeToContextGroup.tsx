import { getMediaState } from '../hooks/useMedia'
import type { ComponentContextI, GroupState, TamaguiComponentState } from '../types'
import { mergeIfNotShallowEqual } from './createShallowSetState'

export const subscribeToContextGroup = ({
  setStateShallow,
  pseudoGroups,
  mediaGroups,
  componentContext,
  state,
}: {
  setStateShallow: (next?: Partial<TamaguiComponentState> | undefined) => void
  pseudoGroups?: Set<string>
  mediaGroups?: Set<string>
  componentContext: ComponentContextI
  state: TamaguiComponentState
}) => {
  // parent group pseudo listening
  if (pseudoGroups || mediaGroups) {
    if (process.env.NODE_ENV === 'development' && !componentContext.groups) {
      console.debug(`No context group found`)
    }

    return componentContext.groups?.subscribe?.((name, { layout, pseudo }) => {
      const current: GroupState = state.group?.[name] || {
        pseudo: {},
        media: {},
      }

      if (pseudo && pseudoGroups?.has(String(name))) {
        // we emit a partial so merge it + change reference so mergeIfNotShallowEqual runs
        Object.assign(current.pseudo!, pseudo)
        persist()
      } else if (layout && mediaGroups) {
        const mediaState = getMediaState(mediaGroups, layout)
        const next = mergeIfNotShallowEqual(current.media, mediaState)
        if (next !== current.media) {
          Object.assign(current.media!, next)
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
