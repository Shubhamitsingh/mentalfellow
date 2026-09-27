import { Component } from 'react'
import { ErrorState } from '@/components/ui/ErrorState'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-3xl px-5 py-20">
          <ErrorState
            title="This page failed to load"
            message="Refresh and try again. If it keeps happening, the last action did not go through."
            onRetry={() => window.location.reload()}
          />
        </div>
      )
    }
    return this.props.children
  }
}
