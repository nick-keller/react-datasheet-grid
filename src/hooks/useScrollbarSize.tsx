import { useMemo } from 'react'

export const useScrollbarSize = () => {
  return useMemo(() => {
    // Ensure this code only runs in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 0
    }
    // Create the outer div
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll' // Force scrollbar to appear
    // outer.style.msOverflowStyle = 'scrollbar' // Necessary for some touch interfaces
    document.body.appendChild(outer)

    // Create the inner div
    const inner = document.createElement('div')
    outer.appendChild(inner)

    // Calculate the scrollbar width
    const width = outer.offsetWidth - inner.offsetWidth

    // Remove the outer div from the body
    document.body.removeChild(outer)

    return width
  }, [])
}
