import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export default function useURLSearchParams() {
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])

  return params
}
