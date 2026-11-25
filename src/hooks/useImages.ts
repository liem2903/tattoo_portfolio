import { useCallback, useEffect, useState } from 'react'
import { listImages } from '../services/imageService'
import type { PortfolioImage } from '../types'

type State = {
  status: 'loading' | 'ready' | 'error'
  images: PortfolioImage[]
  error?: string
}

export function useImages() {
  const [state, setState] = useState<State>({ status: 'loading', images: [] })

  const refresh = useCallback(async () => {
    try {
      const images = await listImages()
      setState({ status: 'ready', images })
    } catch (e) {
      setState((s) => ({
        status: 'error',
        images: s.images,
        error: e instanceof Error ? e.message : String(e),
      }))
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...state, refresh }
}
