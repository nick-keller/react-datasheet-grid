import React, { useState } from 'react'

import { DataSheetGrid, textColumn } from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'

const App = () => {
  const [data, setData] = useState<any[]>([
    { a: 'hello', b: 2 },
    { a: 'very super long text for sure', b: 4 },
    { a: 5, b: 8 },
    { a: 6, b: 6 },
  ])

  const columns = [
    textColumn({ title: 'Name', key: 'a' }),
    textColumn({ title: 'Title', key: 'b' }),
    textColumn({ title: 'C', key: 'c' }),
    textColumn({ key: 'd' }),
  ]

  return <div>
    <DataSheetGrid
      data={data}
      onChange={(newData) => { setData(newData) }}
      columns={columns}
      width={600}
      height={400}
    />
  </div>
}

export default App
