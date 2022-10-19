const React = require('react')
React.useId = React.useId || require('@reach/auto-id').useId
React.startTransition = React.startTransition || ((_) => _())
React.useInsertionEffect = React.useLayoutEffect
require('use-sync-external-store/shim')
