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
  { id: 'foo', sticky: 'right' },
  { id: 'foo', sticky: 'right' },
  { id: 'foo', sticky: 'right' },
]

const data = new Array(100).fill(0)

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
      <DataSheetGrid
        value={data}
        rowIsSticky={({ rowIndex }) => {
          if (rowIndex % 20 === 0) {
            return { level: 1, position: 'top' }
          }
          if (rowIndex % 20 === 1) {
            return { level: 2, position: 'top' }
          }
          if (rowIndex % 20 === 2) {
            return { level: 3, position: 'top' }
          }
          if (rowIndex % 20 === 17) {
            return { level: 3, position: 'bottom' }
          }
          if (rowIndex % 20 === 18) {
            return { level: 2, position: 'bottom' }
          }
          if (rowIndex % 20 === 19) {
            return { level: 1, position: 'bottom' }
          }

          // if (rowIndex % 10 === 1) {
          //   return { level: 2, position: 'top' }
          // }

          return null

          // if (rowIndex % 40 === 0) {
          //   return 0
          // }
          // if (rowIndex % 20 === 2) {
          //   return 1
          // }
          //
          // if (rowIndex % 10 === 3) {
          //   return 2
          // }
          //
          // return rowIndex % 5 === 3 ? 3 : false
        }}
        columns={columns}
      />
    </div>
  )
}

export default App
