import React, { useState } from 'react'

import {
  DataSheetGrid,
  textColumn,
  checkboxColumn,
  progressColumn,
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'

const columns = [
  checkboxColumn({ title: 'Active', key: 'active' }),
  textColumn({ title: 'First name', key: 'firstName' }),
  textColumn({ title: 'Last name', key: 'lastName' }),
  progressColumn({ key: 'number' }),
]

const App = () => {
  const [data, setData] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  return (
    <div style={{ padding: '50px' }}>
      <DataSheetGrid data={data} onChange={setData} columns={columns} />
    </div>
  )
}

export default App
