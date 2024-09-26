// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ComponentType, ReactNode } from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { invariant } from '@tamagui/react-native-web-internals'

import renderApplication, { getApplication } from './renderApplication'

type AppParams = Object

type Runnable = {
  getApplication?: (appParams: AppParams) => {
    element: ReactNode
    getStyleElement: (arg0: any) => ReactNode
  }
  run: (appParams: AppParams) => any
}

export type ComponentProvider = () => ComponentType<any>
export type ComponentProviderInstrumentationHook = (
  component: ComponentProvider
) => ComponentType<any>
export type WrapperComponentProvider = (arg0: any) => ComponentType<unknown>

export type AppConfig = {
  appKey: string
  component?: ComponentProvider
  run?: Function
  section?: boolean
}

const emptyObject = {}
const runnables: {
  [K in string]: Runnable
} = {}

let componentProviderInstrumentationHook: ComponentProviderInstrumentationHook = (
  component: ComponentProvider
) => component()
let wrapperComponentProvider: WrapperComponentProvider | null

/**
 * `AppRegistry` is the JS entry point to running all React Native apps.
 */
export default class AppRegistry {
  static getAppKeys(): Array<string> {
    return Object.keys(runnables)
  }

  static getApplication(
    appKey: string,
    appParameters?: AppParams
  ): {
    element: ReactNode
    getStyleElement: (arg0: any) => ReactNode
  } {
    invariant(
      runnables[appKey] && runnables[appKey].getApplication,
      `Application ${appKey} has not been registered. ` +
        'This is either due to an import error during initialization or failure to call AppRegistry.registerComponent.'
    )

    // @ts-ignore
    return runnables[appKey]?.getApplication?.(appParameters)
  }

  static registerComponent(appKey: string, componentProvider: ComponentProvider): string {
    runnables[appKey] = {
      getApplication: (appParameters: any) =>
        getApplication(
          componentProviderInstrumentationHook(componentProvider),
          appParameters ? appParameters.initialProps : emptyObject,
          wrapperComponentProvider && wrapperComponentProvider(appParameters)
        ),
      run: (appParameters: any) =>
        renderApplication(
          componentProviderInstrumentationHook(componentProvider),
          wrapperComponentProvider && wrapperComponentProvider(appParameters),
          appParameters.callback,
          {
            hydrate: appParameters.hydrate || false,
            initialProps: appParameters.initialProps || emptyObject,
            mode: appParameters.mode || 'legacy',
            rootTag: appParameters.rootTag,
          }
        ),
    }
    return appKey
  }

  static registerConfig(config: Array<AppConfig>) {
    config.forEach(({ appKey, component, run }) => {
      if (run) {
        AppRegistry.registerRunnable(appKey, run)
      } else {
        invariant(component, 'No component provider passed in')
        // @ts-ignore
        AppRegistry.registerComponent(appKey, component)
      }
    })
  }

  // TODO: fix style sheet creation when using this method
  static registerRunnable(appKey: string, run: Function): string {
    // @ts-ignore
    runnables[appKey] = { run }
    return appKey
  }

  static runApplication(appKey: string, appParameters: Record<string, any>): void {
    const isDevelopment =
      process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'
    if (isDevelopment) {
      const params = { ...appParameters }
      params.rootTag = `#${params.rootTag.id}`

      // biome-ignore lint/suspicious/noConsoleLog: ok
      console.log(
        `Running application "${appKey}" with appParams:\n`,
        params,
        `\nDevelopment-level warnings: ${isDevelopment ? 'ON' : 'OFF'}.` +
          `\nPerformance optimizations: ${isDevelopment ? 'OFF' : 'ON'}.`
      )
    }

    invariant(
      runnables[appKey] && runnables[appKey].run,
      `Application "${appKey}" has not been registered. ` +
        'This is either due to an import error during initialization or failure to call AppRegistry.registerComponent.'
    )

    return runnables[appKey].run(appParameters)
  }

  static setComponentProviderInstrumentationHook(
    hook: ComponentProviderInstrumentationHook
  ) {
    componentProviderInstrumentationHook = hook
  }

  static setWrapperComponentProvider(provider: WrapperComponentProvider) {
    wrapperComponentProvider = provider
  }

  static unmountApplicationComponentAtRootTag(rootTag: any) {
    unmountComponentAtNode(rootTag)
  }
}
