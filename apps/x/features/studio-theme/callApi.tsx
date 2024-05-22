import { getOrCreateStore } from '@tamagui/use-store'

import type { Procedure, ProcedureArgs, ProcedureResults } from '../../api/types'
import { toastController } from '../../studio/ToastProvider'

type LoadingType = Procedure

export class StudioProcedureStore {
  loading: Record<LoadingType, number> = {
    getThemeSuiteBuilder: 0,
    exportDemoComponent: 0,
    buildThemeSuite: 0,
    generateThemeBuilderCode: 0,
  }

  startLoading(type: LoadingType) {
    const newVal = this.loading[type] + 1
    this.loading = {
      ...this.loading,
      [type]: newVal,
    }
  }

  stopLoading(type: LoadingType) {
    this.loading = {
      ...this.loading,
      [type]: this.loading[type] - 1,
    }
  }
}

let resolver: ProcedureResolver | null = null

type ProcedureResolver = (name: string, args: any) => Promise<any>

export function setStudioProcedureResolver(_: ProcedureResolver) {
  resolver = _
}

export async function callStudioProcedure<P extends Procedure>(
  procedureName: P,
  args: ProcedureArgs<P>
): Promise<ProcedureResults<P>> {
  console.warn('TURNED OFF FOR NOW WAS A BUILD ERR')
  // TODO
  // let results: any
  // const procedureStore = getOrCreateStore(StudioProcedureStore)
  // try {
  //   procedureStore.startLoading(procedureName)
  //   if (resolver) {
  //     results = await resolver(procedureName, args)
  //   } else {
  //     // get from next api route - this checks for auth and access to studio
  //     const response = await fetch(
  //       `${
  //         process.env.NODE_ENV === 'production'
  //           ? 'https://tamagui.dev'
  //           : 'http://localhost:5005'
  //       }/api/studio/procedure?procedure=${procedureName}`,
  //       {
  //         method: 'POST',
  //         body: JSON.stringify(args),
  //         credentials: 'include',
  //       }
  //     )
  //     const json = await response.json()
  //     if (response.ok) {
  //       results = json
  //     } else {
  //       if (json?.message) {
  //         throw new Error(json.message)
  //       }
  //     }
  //   }
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.error(error)
  //     toastController.show('An error occurred', {
  //       message: error.message,
  //       customData: {
  //         theme: 'red',
  //       },
  //     })
  //   } else {
  //     throw error
  //   }
  // } finally {
  //   procedureStore.stopLoading(procedureName)
  // }
  // return results
}
