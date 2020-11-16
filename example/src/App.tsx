import React, { useState } from 'react'

import { DataSheetGrid, textColumn, checkboxColumn } from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'

const App = () => {
  const [ data, setData ] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
  ])

  console.log(data[0])

  const columns = [
    checkboxColumn({ title: 'Active', key: 'active' }),
    textColumn({ title: 'First name', key: 'firstName' }),
    textColumn({ title: 'Last name', key: 'lastName' }),
  ]

  return (
    <DataSheetGrid
      data={data}
      onChange={setData}
      columns={columns}
    />
  )
}

export default App
