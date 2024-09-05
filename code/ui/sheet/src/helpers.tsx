export function resisted(y: number, minY: number, maxOverflow = 25) {
  if (y < minY) {
    const past = minY - y
    const pctPast = Math.min(maxOverflow, past) / maxOverflow
    const diminishBy = 1.1 - 0.15 ** pctPast
    const extra = -diminishBy * maxOverflow
    return minY + extra
  }
  return y
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
