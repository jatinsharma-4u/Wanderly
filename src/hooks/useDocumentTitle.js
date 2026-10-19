import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Wanderly` : 'Wanderly · Curated journeys across India & beyond'
  }, [title])
}
