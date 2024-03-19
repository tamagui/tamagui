import { useIsomorphicLayoutEffect } from '@tamagui/constants'
// from https://github.com/gorhom/react-native-portal
// MIT License Copyright (c) 2020 Mo Gorhom
import { useEvent } from '@tamagui/core'
// fixing SSR issue
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import type { ReactNode } from 'react'
import React, {
  createContext,
  memo,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
} from 'react'

interface PortalType {
  name: string
  node: ReactNode
}

enum ACTIONS {
  REGISTER_HOST,
  DEREGISTER_HOST,
  ADD_UPDATE_PORTAL,
  REMOVE_PORTAL,
}

const INITIAL_STATE = {}

export { ACTIONS, INITIAL_STATE }

export interface AddUpdatePortalAction {
  type: ACTIONS
  hostName: string
  portalName: string
  node: ReactNode
}

export interface RemovePortalAction {
  type: ACTIONS
  hostName: string
  portalName: string
}

export interface RegisterHostAction {
  type: ACTIONS
  hostName: string
}

export interface UnregisterHostAction {
  type: ACTIONS
  hostName: string
}

export type ActionTypes =
  | AddUpdatePortalAction
  | RemovePortalAction
  | RegisterHostAction
  | UnregisterHostAction

const registerHost = (state: Record<string, Array<PortalType>>, hostName: string) => {
  if (!(hostName in state)) {
    state[hostName] = []
  }
  return state
}

const deregisterHost = (state: Record<string, Array<PortalType>>, hostName: string) => {
  delete state[hostName]
  return state
}

const addUpdatePortal = (
  state: Record<string, Array<PortalType>>,
  hostName: string,
  portalName: string,
  node: any
) => {
  if (!(hostName in state)) {
    state = registerHost(state, hostName)
  }

  /**
   * updated portal, if it was already added.
   */
  const index = state[hostName].findIndex((item) => item.name === portalName)
  if (index !== -1) {
    state[hostName][index].node = node
  } else {
    state[hostName].push({
      name: portalName,
      node,
    })
  }
  return state
}

const removePortal = (
  state: Record<string, Array<PortalType>>,
  hostName: string,
  portalName: string
) => {
  if (!(hostName in state)) {
    console.info(
      `Failed to remove portal '${portalName}', '${hostName}' was not registered!`
    )
    return state
  }

  const index = state[hostName].findIndex((item) => item.name === portalName)
  if (index !== -1) state[hostName].splice(index, 1)
  return state
}

const reducer = (state: Record<string, Array<PortalType>>, action: ActionTypes) => {
  const { type } = action
  switch (type) {
    case ACTIONS.REGISTER_HOST:
      return registerHost({ ...state }, action.hostName)
    case ACTIONS.DEREGISTER_HOST:
      return deregisterHost({ ...state }, action.hostName)
    case ACTIONS.ADD_UPDATE_PORTAL:
      return addUpdatePortal(
        { ...state },
        action.hostName,
        (action as AddUpdatePortalAction).portalName,
        (action as AddUpdatePortalAction).node
      )
    case ACTIONS.REMOVE_PORTAL:
      return removePortal(
        { ...state },
        action.hostName,
        (action as RemovePortalAction).portalName
      )
    default:
      return state
  }
}

const PortalStateContext = createContext<Record<string, Array<PortalType>> | null>(null)
const PortalDispatchContext = createContext<React.Dispatch<ActionTypes> | null>(null)

const usePortalState = (hostName: string) => {
  const state = useContext(PortalStateContext)

  if (state === null) {
    throw new Error(
      "'PortalStateContext' cannot be null, please add 'PortalProvider' to the root component."
    )
  }

  return state[hostName] || []
}

export const usePortal = (hostName = 'root') => {
  const dispatch = useContext(PortalDispatchContext)

  if (dispatch === null) {
    throw new Error(
      "'PortalDispatchContext' cannot be null, please add 'PortalProvider' to the root component."
    )
  }

  //#region methods
  const registerHost = useCallback(() => {
    dispatch({
      type: ACTIONS.REGISTER_HOST,
      hostName: hostName,
    })
  }, [])

  const deregisterHost = useCallback(() => {
    dispatch({
      type: ACTIONS.DEREGISTER_HOST,
      hostName: hostName,
    })
  }, [])

  const addUpdatePortal = useCallback((name: string, node: ReactNode) => {
    dispatch({
      type: ACTIONS.ADD_UPDATE_PORTAL,
      hostName,
      portalName: name,
      node,
    })
  }, [])

  const removePortal = useCallback((name: string) => {
    dispatch({
      type: ACTIONS.REMOVE_PORTAL,
      hostName,
      portalName: name,
    })
  }, [])
  //#endregion

  return {
    registerHost,
    deregisterHost,
    addPortal: addUpdatePortal,
    updatePortal: addUpdatePortal,
    removePortal,
  }
}

export interface PortalProviderProps {
  /**
   * Defines whether to add a default root host or not.
   *
   * @default true
   * @type boolean
   */
  shouldAddRootHost?: boolean

  /**
   * Defines the root portal host name.
   *
   * @default "root"
   * @type string
   */
  rootHostName?: string

  children: ReactNode | ReactNode[]
}

const PortalProviderComponent = ({
  rootHostName = 'root',
  shouldAddRootHost = true,
  children,
}: PortalProviderProps) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const transitionDispatch = useMemo(() => {
    const next = (value: any) => {
      startTransition(() => {
        dispatch(value)
      })
    }
    return next as typeof dispatch
  }, [dispatch])

  return (
    <PortalDispatchContext.Provider value={transitionDispatch}>
      <PortalStateContext.Provider value={state}>
        {children}
        {shouldAddRootHost && <PortalHost name={rootHostName} />}
      </PortalStateContext.Provider>
    </PortalDispatchContext.Provider>
  )
}

export const PortalProvider = memo(PortalProviderComponent)
PortalProvider.displayName = 'PortalProvider'

export interface PortalHostProps {
  /**
   * Host's key or name to be used as an identifier.
   * @type string
   */
  name: string

  forwardProps?: Record<string, any>

  /**
   * Useful when trying to animate children with AnimatePresence.
   *
   * Not a part of gorhom/react-native-portal
   */
  render?: (children: React.ReactNode) => React.ReactElement
}
const defaultRenderer: PortalHostProps['render'] = (children) => <>{children}</>

const PortalHostComponent = (props: PortalHostProps) => {
  const { name, forwardProps, render = defaultRenderer } = props
  const isServer = !useDidFinishSSR()
  const state = usePortalState(name)
  const { registerHost, deregisterHost } = usePortal(props.name)

  //#region effects
  useEffect(() => {
    if (isServer) return
    registerHost()
    return () => {
      deregisterHost()
    }
  }, [isServer])
  //#endregion

  if (forwardProps) {
    return render(
      state.map((item) => {
        let next = item.node

        if (forwardProps) {
          return React.Children.map(next, (child) => {
            return React.isValidElement(child)
              ? React.cloneElement(child, { key: child.key, ...forwardProps })
              : child
          })
        }

        return next
      })
    )
  }

  //#region render
  return render(state.map((item) => item.node))
  //#endregion
}

export const PortalHost = memo(PortalHostComponent)
PortalHost.displayName = 'PortalHost'

export interface PortalItemProps {
  /**
   * Portal's key or name to be used as an identifier.
   * @type string
   * @default generated unique key.
   */
  name?: string
  /**
   * Host's name to teleport the portal content to.
   * @type string
   * @default 'root'
   */
  hostName?: string
  /**
   * Override internal mounting functionality, this is useful
   * if you want to trigger any action before mounting the portal content.
   * @type (mount?: () => void) => void
   * @default undefined
   */
  handleOnMount?: (mount: () => void) => void
  /**
   * Override internal un-mounting functionality, this is useful
   * if you want to trigger any action before un-mounting the portal content.
   * @type (unmount?: () => void) => void
   * @default undefined
   */
  handleOnUnmount?: (unmount: () => void) => void
  /**
   * Override internal updating functionality, this is useful
   * if you want to trigger any action before updating the portal content.
   * @type (update?: () => void) => void
   * @default undefined
   */
  handleOnUpdate?: (update: () => void) => void
  /**
   * Portal's content.
   * @type ReactNode
   * @default undefined
   */
  children?: ReactNode | ReactNode[]
}

const PortalComponent = (props: PortalItemProps) => {
  const {
    name: _providedName,
    hostName,
    handleOnMount: _providedHandleOnMount,
    handleOnUnmount: _providedHandleOnUnmount,
    handleOnUpdate: _providedHandleOnUpdate,
    children,
  } = props
  const { addPortal: addUpdatePortal, removePortal } = usePortal(hostName)
  const id = useId()
  const name = _providedName || id

  const handleOnMount = useEvent(() => {
    if (_providedHandleOnMount) {
      _providedHandleOnMount(() => addUpdatePortal(name, children))
    } else {
      addUpdatePortal(name, children)
    }
  })

  const handleOnUnmount = useEvent(() => {
    if (_providedHandleOnUnmount) {
      _providedHandleOnUnmount(() => removePortal(name))
    } else {
      removePortal(name)
    }
  })

  const handleOnUpdate = useEvent(() => {
    if (_providedHandleOnUpdate) {
      _providedHandleOnUpdate(() => addUpdatePortal(name, children))
    } else {
      addUpdatePortal(name, children)
    }
  })

  useIsomorphicLayoutEffect(() => {
    handleOnMount()
    return () => {
      handleOnUnmount()
    }
  }, [])

  useEffect(() => {
    handleOnUpdate()
  }, [children])

  return null
}

export const PortalItem = memo(PortalComponent)
PortalItem.displayName = 'Portal'
