import React from 'react'

import { DataSheetGrid } from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'

const App = () => {
  const data = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
    { a: 5, b: 8 },
    { a: 6, b: 6 },
    { a: 7, b: 5 },
    { a: 1, b: 2 },
    { a: 3, b: 4 },
    { a: 5, b: 8 },
    { a: 6, b: 6 },
    { a: 7, b: 5 },
    { a: 1, b: 2 },
    { a: 3, b: 4 },
    { a: 5, b: 8 },
    { a: 6, b: 6 },
    { a: 7, b: 5 },
  ]

  const columns = [
    { title: 'Name', width: .8, minWidth: 200, render: ({ rowData, active }) => {
        return active ? 'active' : rowData.a
      }
    },
    { title: 'Type', width: 1.5, minWidth: 200, render: ({ rowData }) => rowData.b },
    { title: 'C', minWidth: 200, render: ({ rowData }) => rowData.a },
    { title: 'D', minWidth: 200, render: ({ rowData }) => rowData.b },
  ]

  return <div>
    <DataSheetGrid
      data={data}
      columns={columns}
      width={600}
      height={600}
    />
  </div>
}

export default App
