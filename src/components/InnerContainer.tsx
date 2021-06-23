import React from 'react'

export const InnerContainer = React.forwardRef<
  HTMLDivElement,
  { style: React.CSSProperties }
>(({ children, ...rest }, ref) => {
  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  )
})
