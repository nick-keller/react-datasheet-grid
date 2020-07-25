import { MutableRefObject, RefObject, useRef } from 'react'
import { throttle } from 'throttle-debounce'

const compute = (
  resultRef: MutableRefObject<DOMRect | null>,
  ref: RefObject<HTMLElement>
) => {
  resultRef.current = ref.current?.getBoundingClientRect() || null
}

const throttledCompute = throttle(
  200,
  (
    resultRef: MutableRefObject<DOMRect | null>,
    ref: RefObject<HTMLElement>,
    force: boolean = false
  ) => {
    if (force) {
      compute(resultRef, ref)
    } else {
      setTimeout(() => compute(resultRef, ref), 0)
    }
  }
)

// Cache bounding rect in a ref and only recompute every 200ms
export const useGetBoundingRect = (ref: RefObject<HTMLElement>) => {
  const boundingRect = useRef<DOMRect | null>(null)

  return (force: boolean = false) => {
    throttledCompute(boundingRect, ref, force)
    return boundingRect.current
  }
}
