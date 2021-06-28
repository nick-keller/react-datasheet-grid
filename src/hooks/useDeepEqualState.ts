import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import deepEqual from 'fast-deep-equal'

export const useDeepEqualState = <T>(
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue)

  const customSetValue = useCallback(
    (newValue: SetStateAction<T>) => {
      setValue((prevValue) => {
        const nextValue =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(prevValue)
            : newValue

        return deepEqual(nextValue, prevValue) ? prevValue : nextValue
      })
    },
    [setValue]
  )

  return [value, customSetValue]
}
