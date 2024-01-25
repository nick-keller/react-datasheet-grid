import React, { useState } from 'react'
import { DataSheetGrid, Column, createStaticRow, isStaticRow } from '../../src'
import '../../src/style.css'

const columns: Column<any>[] = [
  { sticky: 'left' },
  { sticky: 'left' },
  { sticky: 'left' },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  { sticky: 'right' },
  { sticky: 'right' },
  { sticky: 'right' },
]

const data = [
  createStaticRow({ sticky: true, height: 40 }),
  ...new Array(1000).fill(0),
]

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
      <DataSheetGrid value={data} columns={columns} rowHeight={20} />
    </div>
  )
}

export default App
