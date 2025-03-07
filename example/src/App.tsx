import React, { useState } from 'react'
import { DataSheetGrid, Column, createStaticRow } from '../../src'
import '../../src/style.css'

function App() {
  const [columns, setColumns] = useState<Partial<Column<any>>[]>([
    { sticky: 'left', title: 'hello' },
    { sticky: 'left' },
    { renderer: () => <b>hello</b>, title: 'world' },
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
  ])
  const [data, setData] = useState<any[]>([
    createStaticRow({ sticky: true, renderer: ({ column }) => column.title }),
    ...new Array(2000).fill(0),
  ])

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '900px',
        background: '#f3f3f3',
      }}
    >
      <button onClick={() => setColumns((x) => [...x, {}])}>Add col</button>
      <button onClick={() => setData((x) => [...x, 0])}>Add row</button>
      <DataSheetGrid
        value={data}
        columns={columns}
        rowHeight={({ rowIndex }) => (rowIndex % 10) * 8 + 10}
        rowIsSticky={({ rowIndex }) => (rowIndex % 10 === 8 ? 'bottom' : false)}
      />
    </div>
  )
}

export default App
