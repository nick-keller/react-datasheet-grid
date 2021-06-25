import React, { useMemo, useState } from 'react'
import { DataSheetGrid, Column } from 'react-datasheet-grid'

function App() {
  const [data, setData] = useState([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
  ])
  const [count, setCount] = useState(0)
  const columns = useMemo<Column<string>[]>(
    () => [
      { minWidth: 450, title: 'First name' },
      { minWidth: 70, title: 'Last name' },
      { minWidth: 90, title: 'Age' },
      { minWidth: 110, title: 'Job' },
      { minWidth: 30 },
      { minWidth: 450 },
    ],
    []
  )

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '500px',
        background: '#f3f3f3',
      }}
    >
      <p>
        Counter: <b>{count}</b>
      </p>
      <button onClick={() => setCount(count + 1)}>Up</button>
      <DataSheetGrid
        data={data}
        headerRowHeight={100}
        onChange={setData}
        columns={columns}
        stickyRightColumn={{}}
      />
    </div>
  )
}

export default App
