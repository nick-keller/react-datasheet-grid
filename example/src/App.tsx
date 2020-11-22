import React, { useState } from 'react'

import { DataSheetGrid, textColumn, checkboxColumn } from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'

const App = () => {
  const [ data, setData ] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
  ])

  const columns = [
    checkboxColumn({ title: 'Active', key: 'active' }),
    textColumn({ title: 'First name', key: 'firstName' }),
    textColumn({ title: 'Last name', key: 'lastName', disabled: true }),
  ]

  return (
    <>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={columns}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default App
