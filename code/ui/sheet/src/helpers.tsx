export function resisted(y: number, minY: number, maxOverflow = 25) {
  // If we're not past the boundary, return the original position
  if (y >= minY) {
    return y
  }

  // Calculate how far we've gone past the boundary
  const pastBoundary = minY - y

  // Use a square root function for very gentle resistance
  // This creates a milder resistance curve than logarithmic
  // Reduced multiplier from 1.5 to 1.0 for even less resistance
  const resistedDistance = Math.sqrt(pastBoundary) * 2

  // Return the position with resistance applied
  return minY - resistedDistance
}

// // set all the way off screen
// // + 0.1 ensures this is unique - see hasntMeasured ref

// let hiddenSize: number

// export function getHiddenSize() {
//   if (hiddenSize == undefined) {
//     // this trigger reflow on web avoid doing on startup
//     const screen = Dimensions.get('screen')
//     hiddenSize = Math.max(screen.height, screen.width) + 0.1
//   }
//   return hiddenSize
// }
