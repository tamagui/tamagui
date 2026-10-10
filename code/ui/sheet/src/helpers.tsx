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
