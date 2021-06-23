import React from 'react'
import { HeaderRow } from './HeaderRow'

export const InnerContainer = React.forwardRef<
  HTMLDivElement,
  { style: React.CSSProperties }
>(({ children, ...rest }, ref) => {
  return (
    <div ref={ref} {...rest}>
      <HeaderRow />
      {children}
    </div>
  )
})
