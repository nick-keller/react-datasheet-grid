import React, { useState } from 'react'
import { DataSheetGrid, Column, createStaticRow, isStaticRow } from '../../src'
import '../../src/style.css'

const columns: Partial<Column<any>>[] = [
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
  { sticky: 'right' },
  { sticky: 'right' },
]

const data = [createStaticRow({ sticky: true }), ...new Array(1000).fill(0)]

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
      <DataSheetGrid value={data} columns={columns} />
    </div>
  )
}

export default App
