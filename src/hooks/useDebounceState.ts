import { useMemo, useState } from 'react'
import { debounce } from 'throttle-debounce'

export const useDebounceState = <T>(
  defaultValue: T,
  delay: number
): [T, (nextVal: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState(defaultValue)

  const setValue = useMemo(
    () =>
      debounce(delay, (newValue: T) => {
        setDebouncedValue(newValue)
      }),
    [delay]
  )

  return [debouncedValue, setValue]
}
