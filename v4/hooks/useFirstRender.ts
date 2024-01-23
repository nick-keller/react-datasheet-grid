import { useRef } from 'react'

export const useFirstRender = () => {
  const firstRenderRef = useRef(true)
  const firstRender = firstRenderRef.current
  firstRenderRef.current = false

  return firstRender
}
