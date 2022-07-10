// from https://github.com/gorhom/react-native-portal
// MIT License Copyright (c) 2020 Mo Gorhom
// fixing SSR issue

import { startTransition, useIsSSR } from '@tamagui/core'
import { nanoid } from 'nanoid/non-secure'
import { ReactNode, useMemo, useRef } from 'react'
import React, { createContext, memo, useCallback, useContext, useEffect, useReducer } from 'react'

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
    console.log(`Failed to remove portal '${portalName}', '${hostName}' was not registered!`)
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
      return removePortal({ ...state }, action.hostName, (action as RemovePortalAction).portalName)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deregisterHost = useCallback(() => {
    dispatch({
      type: ACTIONS.DEREGISTER_HOST,
      hostName: hostName,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addUpdatePortal = useCallback((name: string, node: ReactNode) => {
    dispatch({
      type: ACTIONS.ADD_UPDATE_PORTAL,
      hostName,
      portalName: name,
      node,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removePortal = useCallback((name: string) => {
    dispatch({
      type: ACTIONS.REMOVE_PORTAL,
      hostName,
      portalName: name,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
}

const PortalHostComponent = ({ name }: PortalHostProps) => {
  //#region hooks
  const isServer = useIsSSR()
  const state = usePortalState(name)
  const { registerHost, deregisterHost } = usePortal(name)
  //#endregion

  //#region effects
  useEffect(() => {
    if (isServer) return
    registerHost()
    return () => {
      deregisterHost()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServer])
  //#endregion

  //#region render
  return <>{state.map((item) => item.node)}</>
  //#endregion
}

export const PortalHost = memo(PortalHostComponent)
PortalHost.displayName = 'PortalHost'

export interface PortalItemProps {
  /**
   * Portal's key or name to be used as an identifier.
   * @type string
   * @default nanoid generated unique key.
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

const PortalComponent = ({
  name: _providedName,
  hostName,
  handleOnMount: _providedHandleOnMount,
  handleOnUnmount: _providedHandleOnUnmount,
  handleOnUpdate: _providedHandleOnUpdate,
  children,
}: PortalItemProps) => {
  //#region hooks
  const { addPortal: addUpdatePortal, removePortal } = usePortal(hostName)
  //#endregion

  //#region variables
  const name = useMemo(() => _providedName || nanoid(), [_providedName])
  //#endregion

  //#region refs
  const handleOnMountRef = useRef<Function>()
  const handleOnUnmountRef = useRef<Function>()
  const handleOnUpdateRef = useRef<Function>()
  //#endregion

  //#region callbacks
  const handleOnMount = useCallback(() => {
    if (_providedHandleOnMount) {
      _providedHandleOnMount(() => addUpdatePortal(name, children))
    } else {
      addUpdatePortal(name, children)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_providedHandleOnMount, addUpdatePortal])
  handleOnMountRef.current = handleOnMount

  const handleOnUnmount = useCallback(() => {
    if (_providedHandleOnUnmount) {
      _providedHandleOnUnmount(() => removePortal(name))
    } else {
      removePortal(name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_providedHandleOnUnmount, removePortal])
  handleOnUnmountRef.current = handleOnUnmount

  const handleOnUpdate = useCallback(() => {
    if (_providedHandleOnUpdate) {
      _providedHandleOnUpdate(() => addUpdatePortal(name, children))
    } else {
      addUpdatePortal(name, children)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_providedHandleOnUpdate, addUpdatePortal, children])
  handleOnUpdateRef.current = handleOnUpdate
  //#endregion

  //#region effects
  useEffect(() => {
    handleOnMountRef.current?.()
    return () => {
      handleOnUnmountRef.current?.()

      // remove callbacks refs
      handleOnMountRef.current = undefined
      handleOnUnmountRef.current = undefined
      handleOnUpdateRef.current = undefined
    }
  }, [])
  useEffect(() => {
    handleOnUpdateRef.current?.()
  }, [children])
  //#endregion

  return null
}

export const PortalItem = memo(PortalComponent)
PortalItem.displayName = 'Portal'
