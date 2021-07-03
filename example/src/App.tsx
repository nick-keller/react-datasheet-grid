import React, { useState } from 'react'
import {
  checkboxColumn,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import './style.css'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
}

function App() {
  const [data, setData] = useState<Row[]>([
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
        columns={[
          {
            ...keyColumn<Row, 'active'>('active', checkboxColumn),
            title: 'Active',
          },
          {
            ...keyColumn<Row, 'firstName'>('firstName', textColumn),
            title: 'First name',
          },
          {
            ...keyColumn<Row, 'lastName'>('lastName', textColumn),
            title: 'Last name',
          },
        ]}
      />
    </div>
  )
}

export default App
