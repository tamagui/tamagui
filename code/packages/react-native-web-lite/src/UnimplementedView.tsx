import React from 'react'

import { View } from './View/index'

export class UnimplementedView extends React.Component {
  setNativeProps = () => {}
  render() {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Unimplemented view`)
    }
    return <View {...this.props} />
  }
}
