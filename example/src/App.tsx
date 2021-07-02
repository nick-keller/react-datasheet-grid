import React, { useMemo, useState } from 'react'
import {
  DataSheetGrid,
  textColumn,
  keyColumn,
  checkboxColumn,
  Column,
} from 'react-datasheet-grid'
import './style.css'

function App() {
  const [data, setData] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])
  const [count, setCount] = useState(0)
  const columns = useMemo<Column[]>(
    () => [
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
    ],
    []
  )

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '900px',
        background: '#f3f3f3',
      }}
    >
      <p>
        <button onClick={() => setCount(count + 1)}>Trigger re-render</button>
      </p>
      <p>
        <input />
      </p>
      <p>Lorem ipsum</p>
      <p>
        <DataSheetGrid
          data={data}
          onChange={setData}
          columns={columns}
          stickyRightColumn={{
            component: ({ insertRowBelow }) => (
              <button onClick={insertRowBelow}>R</button>
            ),
          }}
        />
      </p>
    </div>
  )
}

export default App
