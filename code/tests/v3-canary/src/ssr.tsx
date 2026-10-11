import { renderToString } from 'react-dom/server'

import { CanaryTree } from './CanaryTree'

export function render() {
  return renderToString(<CanaryTree />)
}
