import React, { useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const TextComponent = React.memo<CellProps<string | null, any>>(
  ({ focus, rowData, setRowData }) => {
    const ref = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
      // When the cell gains focus we make sure to immediately select the text in the input:
      // - If the user gains focus by typing, it will replace the existing text, as expected
      // - If the user gains focus by clicking or pressing Enter, the text will be preserved and selected
      if (focus) {
        ref.current?.select()
      }
      // When the cell looses focus (by pressing Esc or Enter) we make sure to blur the input
      // Otherwise the user would still see its cursor blinking
      else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <input
        className="dsg-input"
        // Important to prevent any undesired "tabbing"
        tabIndex={-1}
        ref={ref}
        // Make sure that while the cell is not focus, the user cannot interact with the input
        // The cursor will not change to "I", the style of the input will not change,
        // and the user cannot click and edit the input (this part should be handled by DataSheetGrid itself)
        style={{ pointerEvents: focus ? 'auto' : 'none' }}
        // This "|| ''" trick makes sure that we do not pass `null` as a value to the input, if we would pass null
        // the input would display the previous value it receives instead of being empty
        value={rowData || ''}
        // This "|| null" trick allows us to not have empty strings as value, we either have a non-empty string or null
        // Of course depending on your application this might not be desirable
        onChange={(e) => setRowData(e.target.value || null)}
      />
    )
  }
)

TextComponent.displayName = 'TextComponent'

export const textColumn: Partial<Column<string | null, any>> = {
  component: TextComponent as CellComponent<string | null, any>,
  // We decided to have null instead of empty strings, but we could also have chosen to do "() => ''"
  deleteValue: () => null,
  copyValue: ({ rowData }) => rowData,
  // Same thing here, replace empty strings by null
  pasteValue: ({ value }) => value || null,
}
