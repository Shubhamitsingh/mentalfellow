import { useEffect, useState } from 'react'

export function useAsync(fn, deps) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })

  useEffect(() => {
    let active = true
    setState((current) => ({ ...current, status: 'loading', error: null }))

    Promise.resolve()
      .then(() => fn())
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (active) setState({ status: 'error', data: null, error })
      })

    return () => {
      active = false
    }
    // The caller passes the dependency list that the loader closes over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
