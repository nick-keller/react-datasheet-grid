import { RefObject, useCallback, useMemo, useRef } from 'react'
import { throttle } from 'throttle-debounce'

// Cache bounding rect in a ref and only recompute every <delay>ms
export const useGetBoundingClientRect = (
  ref: RefObject<HTMLElement>,
  delay = 200
) => {
  const boundingRect = useRef<DOMRect | null>(null)

  const throttledCompute = useMemo(
    () =>
      throttle(delay, true, () => {
        setTimeout(
          () =>
            (boundingRect.current =
              ref.current?.getBoundingClientRect() || null),
          0
        )
      }),
    [ref, delay]
  )

  return useCallback(
    (force = false) => {
      if (force) {
        boundingRect.current = ref.current?.getBoundingClientRect() || null
      } else {
        throttledCompute()
      }
      return boundingRect.current
    },
    [ref, throttledCompute]
  )
}
