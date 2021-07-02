import React, { useMemo, useState } from 'react'
import { DataSheetGrid, Column } from 'react-datasheet-grid'
import './style.css'

function App() {
  const [data, setData] = useState([
    'a',
    'b',
    'c',
    // 'd',
    // 'e',
    // 'f',
    // 'g',
    // 'h',
    // 'i',
    // 'j',
    // 'k',
    // 'l',
    // 'm',
    // 'n',
    // 'o',
    // 'p',
    // 'a',
    // 'b',
    // 'c',
    // 'd',
    // 'e',
    // 'f',
    // 'g',
    // 'h',
    // 'i',
    // 'j',
    // 'k',
    // 'l',
    // 'm',
    // 'n',
    // 'o',
    // 'p',
  ])
  const [data2, setData2] = useState(['a', 'b', 'c'])
  const [count, setCount] = useState(0)
  const columns = useMemo<Column<string>[]>(
    () => [
      { minWidth: 150, title: 'First name' },
      {
        minWidth: 70,
        title: 'Last name',
        disabled: ({ rowData }) => rowData === 'c',
      },
      { minWidth: 90, title: 'Age', disabled: false },
      { minWidth: 110, title: 'Job', disabled: true },
      // {},
      // {},
      // {},
      {},
      {},
      {},
      {},
      // { minWidth: 30 },
      // { minWidth: 450 },
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
          // headerRowHeight={100}
          // rowHeight={40}
          onChange={setData}
          columns={columns}
          createRow={() => 'plop'}
          stickyRightColumn={{}}
        />
      </p>
      <p>
        <DataSheetGrid
          data={data2}
          headerRowHeight={30}
          rowHeight={40}
          onChange={setData2}
          columns={columns}
          createRow={() => 'plop'}
          // stickyRightColumn={{}}
        />
      </p>
    </div>
  )
}

export default App
