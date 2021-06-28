import React from 'react'
import { HeaderRow } from './HeaderRow'
import { SelectionRect } from './SelectionRect'

export const InnerContainer = React.forwardRef<
  HTMLDivElement,
  { style: React.CSSProperties }
>(({ children, ...rest }, ref) => {
  return (
    <div ref={ref} {...rest}>
      <HeaderRow />
      {children}
      <SelectionRect />
    </div>
  )
})

InnerContainer.displayName = 'InnerContainer'
