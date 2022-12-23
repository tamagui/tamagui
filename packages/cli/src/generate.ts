#!/usr/bin/env node

import fs from 'fs-extra'
import { Project } from 'ts-morph'

import { ResolvedOptions } from './types.js'
import { loadTamagui } from './utils.js'

export async function generateTypes(options: ResolvedOptions) {
  const types = await getTypes(options)
  await fs.writeJSON(options.paths.types, types, {
    spaces: 2,
  })
}

export async function getTypes(options: ResolvedOptions) {
  const tamagui = await loadTamagui(options.tamaguiOptions)

  const uniqueViewExportingPaths = new Set(
    Object.keys(tamagui.nameToPaths).map((name) => {
      return `${[...tamagui.nameToPaths[name]][0]}.ts*`
    }),
  )

  const project = new Project({
    compilerOptions: {
      noEmit: false,
      declaration: true,
      emitDeclarationOnly: true,
    },
    skipAddingFilesFromTsConfig: true,
    tsConfigFilePath: options.tsconfigPath,
  })

  const files = project.addSourceFilesAtPaths([...uniqueViewExportingPaths])

  return Object.fromEntries(
    files.flatMap((x) => {
      return [...x.getExportedDeclarations()].map(([k, v]) => {
        return [
          k,
          v[0]
            .getType()
            .getApparentType()
            .getProperties()
            .map((prop) => {
              return [
                prop.getEscapedName(),
                prop.getValueDeclaration()?.getType().getText(),
              ]
            }),
        ]
      })
    }),
  )

  // console.log(
  //   'project',
  //   files.map((x) => x.getFilePath()),
  //   files.map((x) => {
  //     return x.getExportedDeclarations()
  //   }),
  //   Object.fromEntries(
  //     files.flatMap((x) => {
  //       return [...x.getExportedDeclarations()].map(([k, v]) => {
  //         return [k, v[0].getType().getApparentType().getText()]
  //       })
  //     })
  //   ),

  //   // files.map((f) => f.getExportSymbols())
}
