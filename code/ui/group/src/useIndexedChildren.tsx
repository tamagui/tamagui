/**
 * The MIT License (MIT)

Copyright (c) 2022 Reforest authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */

import * as React from 'react'

const MaxIndexContext = React.createContext<number[]>([])
const IndexContext = React.createContext<string | null>(null)

/** Returns the index path data based on the closest useIndexedChildren. */
export function useIndex() {
  const maxIndexPath = React.useContext(MaxIndexContext)
  const indexPathString = React.useContext(IndexContext)

  return React.useMemo(() => {
    if (indexPathString === null) {
      return null
    }

    const indexPath = parseIndexPath(indexPathString)
    const maxIndex = maxIndexPath[maxIndexPath.length - 1]
    const index = indexPath[indexPath.length - 1]

    return {
      maxIndex,
      maxIndexPath,
      index,
      indexPath,
      indexPathString,
      isFirst: index === 0,
      isLast: index === maxIndex,
      isEven: index % 2 === 0,
      isOdd: Math.abs(index % 2) === 1,
    }
  }, [maxIndexPath, indexPathString])
}

/** Provides the current index path for each child. */
export function useIndexedChildren(children: React.ReactNode) {
  const parentMaxIndexPath = React.useContext(MaxIndexContext)
  const indexPathString = React.useContext(IndexContext)
  const childrenCount = React.Children.count(children)
  const maxIndexPath = React.useMemo(
    () => parentMaxIndexPath.concat(childrenCount - 1),
    [childrenCount]
  )

  return (
    <MaxIndexContext.Provider value={maxIndexPath}>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <IndexContext.Provider
            key={child.key}
            value={
              indexPathString
                ? `${indexPathString}.${index.toString()}`
                : index.toString()
            }
          >
            {child}
          </IndexContext.Provider>
        ) : (
          child
        )
      )}
    </MaxIndexContext.Provider>
  )
}

/**
 * Parses a numerical dot-separated string as an index path.
 *
 * @example
 * parseIndexPath('0.10.2') -> [0, 10, 2]
 */
function parseIndexPath(indexPathString: string) {
  return indexPathString.split('.').map((index) => Number.parseInt(index, 10))
}
