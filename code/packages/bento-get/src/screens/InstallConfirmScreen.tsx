import { Box, Spacer, Text } from 'ink'
import React from 'react'

import { filePathsToTree, treeToString } from 'file-paths-to-tree'
import { AppContext } from '../data/AppContext.js'

export const InstallConfirmScreen = () => {
  const appContext = React.useContext(AppContext)
  const { componentToInstall, installingComponent } = appContext.installState

  if (!componentToInstall || !installingComponent) {
    return null
  }

  const getInstallPaths = () => {
    const callDirectory = process.cwd()
    const basePath =
      `${componentToInstall.path}/${installingComponent.category}/${installingComponent.categorySection}`.replace(
        callDirectory,
        ''
      )
    const mainComponentPath = `${basePath}/${installingComponent.fileName}.tsx`
    const bentoDependencies = installingComponent.bentoDependencies || []

    const dependencyPaths = bentoDependencies.map((dep) => {
      const [fileName, folder] = dep.split('/').reverse()
      return folder
        ? `${basePath}/${folder}/${fileName}.tsx`
        : `${basePath}/${fileName}.tsx`
    })

    const allPaths = [mainComponentPath, ...dependencyPaths]

    // Find the longest path
    const longestPath = allPaths.reduce((a, b) => (a.length > b.length ? a : b))
    const longestPathParts = longestPath.split('/')

    // Prune to last 7 segments of the longest path
    const startIndex = Math.max(0, longestPathParts.length - 7)
    const prunedLongestPath = longestPathParts.slice(startIndex).join('/')

    return {
      basePath,
      mainComponentPath,
      dependencyPaths,
      allPaths: allPaths.map((path) => {
        const parts = path.split('/')
        const startFromIndex = parts.findIndex((segment) =>
          prunedLongestPath.includes(segment)
        )
        return parts.slice(startFromIndex).join('/')
      }),
    }
  }
  const allInstallPaths = getInstallPaths().allPaths
  return (
    <Box
      flexDirection="column"
      padding={1}
      gap={2}
      borderColor="white"
      borderStyle="round"
    >
      <Text>
        CONFIRM: Install the component "<Text bold>{componentToInstall.name}</Text>" here?
      </Text>
      <Box
        borderColor="blue"
        flexDirection="column"
        padding={1}
        borderStyle="round"
        gap={1}
      >
        <Box flexDirection="column">
          {allInstallPaths.map((path, i) => (
            <Text key={i}>- {path}</Text>
          ))}
        </Box>
        <Box borderColor="blue" borderStyle="round" padding={1}>
          <Text>
            {treeToString(
              filePathsToTree(allInstallPaths, {
                connectors: {
                  tee: '├─ ',
                  elbow: '└─ ',
                  padding: ' ',
                },
              })
            )}
          </Text>
        </Box>
      </Box>
      <Spacer />
      <Text>
        Press{' '}
        <Text color="green" bold>
          Y
        </Text>{' '}
        to confirm or{' '}
        <Text color="red" bold>
          N
        </Text>{' '}
        to cancel.
      </Text>
    </Box>
  )
}
