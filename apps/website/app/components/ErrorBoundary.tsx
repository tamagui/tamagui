import { Component } from 'react'

export class ErrorBoundary extends Component<any> {
  constructor(props) {
    super(props)
    this.state.noMessage = props.noMessage
  }
  state = { hasError: false, noMessage: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      if (this.state.noMessage) {
        return null
      }
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button type="button" onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
