import React, { useState } from 'react'
import { DataSheetGrid, Column } from '../../src'
// import '../../src/style.css'

const columns: Column<any>[] = [
  { id: 'foo', sticky: 'left' },
  { id: 'foo', sticky: 'left' },
  { id: 'foo', sticky: 'left' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo' },
  { id: 'foo', sticky: 'right' },
  { id: 'foo', sticky: 'right' },
  { id: 'foo', sticky: 'right' },
]

const data = new Array(1000).fill(0)

const rowIsSticky = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 20 === 0) {
    return { level: 1, position: 'top' as const }
  }
  if (rowIndex % 20 === 15) {
    return { level: 2, position: 'bottom' as const }
  }

  return null
}

function App() {
  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '900px',
        background: '#f3f3f3',
      }}
    >
      <DataSheetGrid value={data} rowIsSticky={rowIsSticky} columns={columns} />
    </div>
  )
}

export default App
