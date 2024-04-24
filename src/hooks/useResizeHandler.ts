import * as React from 'react'

export interface UseResizeHandleProps {
  onDrag?: (deltaX?: number) => void
  onDragEnd?: (deltaX?: number) => void
}

export const useResizeHandle = ({
  onDrag,
  onDragEnd,
}: UseResizeHandleProps): React.RefObject<HTMLDivElement> => {
  const ref = React.useRef<HTMLDivElement>(null)
  const deltaXRef = React.useRef<number>(0)
  React.useLayoutEffect(() => {
    if (ref.current != null) {
      ref.current.onpointerdown = (e) => {
        e.stopPropagation()
        e.preventDefault()
        deltaXRef.current = 0
        const currentPositionX = e.pageX

        function onPointerMove(pointerMoveEvent: PointerEvent): void {
          const deltaX = pointerMoveEvent.pageX - currentPositionX

          if (onDrag != null) {
            onDrag(deltaX)
          }

          if (deltaXRef.current !== deltaX) {
            deltaXRef.current = deltaX
          }
        }

        document.addEventListener('pointermove', onPointerMove)

        document.onpointerleave = (pointerLeaveEvent: PointerEvent) => {
          if (
            pointerLeaveEvent.clientY <= 0 ||
            pointerLeaveEvent.clientX <= 0 ||
            pointerLeaveEvent.clientX >= window.innerWidth ||
            pointerLeaveEvent.clientY >= window.innerHeight
          ) {
            document.removeEventListener('pointermove', onPointerMove)
            document.onpointerleave = null
            onDragEnd?.(deltaXRef.current)
          }
        }

        document.onpointerup = () => {
          document.removeEventListener('pointermove', onPointerMove)
          document.onpointerup = null
          onDragEnd?.(deltaXRef.current)
        }
      }
    }
  }, [onDrag, onDragEnd])

  return ref
}
