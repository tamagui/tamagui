/**
 * Fake file require just so native users can avoid installing
 * expo stuff up front for native.
 */

export function LinearGradient(props) {
  const Real = require('./LinearGradient-shared').LinearGradient
  return <Real {...props} />
}
