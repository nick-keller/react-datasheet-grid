import React, { useState } from 'react'
import {
  checkboxColumn,
  Column,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import './style.css'

function App() {
  const [data, setData] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
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
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={
          [
            {
              ...keyColumn('active', checkboxColumn),
              title: 'Active',
            },
            {
              ...keyColumn('firstName', textColumn),
              title: 'First name',
              disabled: true,
            },
            { ...keyColumn('lastName', textColumn), title: 'Last name' },
          ] as Column[]
        }
      />
    </div>
  )
}

export default App
