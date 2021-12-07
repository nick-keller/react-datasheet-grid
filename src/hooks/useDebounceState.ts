import { useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from 'throttle-debounce'

export const useDebounceState = <T>(
  defaultValue: T,
  delay: number
): [T, (nextVal: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState(defaultValue)
  const cancelRef = useRef<debounce<(newValue: T) => void>>()

  useEffect(() => () => cancelRef.current?.cancel(), [])

  const setValue = useMemo(
    () =>
      (cancelRef.current = debounce(delay, (newValue: T) => {
        setDebouncedValue(newValue)
      })),
    [delay]
  )

  return [debouncedValue, setValue]
}
