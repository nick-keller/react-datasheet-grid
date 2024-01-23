import React, { useState } from 'react'
import { DataSheetGrid } from '../../src'
// import '../../src/style.css'

const columns = [
  // { id: 'foo', stickyLeft: true },
  // { id: 'foo', stickyLeft: true },
  // { id: 'foo', stickyLeft: true },
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
  // { id: 'foo', stickyRight: true },
  // { id: 'foo', stickyRight: true },
  // { id: 'foo', stickyRight: true },
  // { id: 'foo', stickyRight: true },
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
        overscanRows={10}
        rowIsSticky={({ rowIndex }) => {
          if (rowIndex % 40 === 0) {
            return 0
          }
          if (rowIndex % 20 === 2) {
            return 1
          }

          if (rowIndex % 10 === 3) {
            return 2
          }

          return rowIndex % 5 === 3 ? 3 : false
        }}
        columns={columns}
      />
    </div>
  )
}

export default App
