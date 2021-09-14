import React, { useState } from 'react'
import { DataSheetGrid, keyColumn, textColumn } from 'react-datasheet-grid'
import faker from 'faker'
import Switch from 'rc-switch'
import 'rc-switch/assets/index.css'
import CodeBlock from '@theme/CodeBlock'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(5).fill(0).map(() => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    }))
  )
  const [lockRows, setLockRows] = useState(false)
  const [autoAddRow, setAutoAddRow] = useState(false)
  const [disableContextMenu, setDisableContextMenu] = useState(false)

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', marginBottom: 10 }}>
        <Switch
          style={{ marginRight: 10 }}
          checked={lockRows}
          onChange={(value) => {
            setLockRows(value)
            if (value) {
              setDisableContextMenu(true)
            }
          }}
        />
        <code>lockRows</code>
      </label>
      <label style={{ display: 'block', marginBottom: 10 }}>
        <Switch
          disabled={lockRows}
          style={{ marginRight: 10 }}
          checked={autoAddRow}
          onChange={(value) => setAutoAddRow(value)}
        />
        <code>autoAddRow</code>
      </label>
      <label style={{ display: 'block', marginBottom: 10 }}>
        <Switch
          disabled={lockRows}
          style={{ marginRight: 10 }}
          checked={disableContextMenu}
          onChange={(value) => setDisableContextMenu(value)}
        />
        <code>disableContextMenu</code>
      </label>
      <DataSheetGrid
        value={data}
        onChange={setData}
        lockRows={lockRows}
        autoAddRow={autoAddRow}
        disableContextMenu={disableContextMenu}
        columns={[
          { ...keyColumn('firstName', textColumn), title: 'First name' },
          { ...keyColumn('lastName', textColumn), title: 'Last name' },
        ]}
      />
      <div style={{ marginTop: 20 }}>
        <CodeBlock className="language-tsx">{`<DataSheetGrid ${
          lockRows ? '\n  lockRows' : ''
        }${autoAddRow ? '\n  autoAddRow' : ''}${
          disableContextMenu && !lockRows ? '\n  disableContextMenu' : ''
        }${
          lockRows || autoAddRow || disableContextMenu ? '\n' : ''
        }/>`}</CodeBlock>
      </div>
    </div>
  )
}
