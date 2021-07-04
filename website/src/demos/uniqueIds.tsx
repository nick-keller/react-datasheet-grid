import React, { useRef, useState } from 'react'
import {
  checkboxColumn,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const counter = useRef(1)
  const genId = () => counter.current++

  const [data, setData] = useState<any[]>(() =>
    new Array(5).fill(0).map(() => ({
      id: genId(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    }))
  )

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        createRow={() => ({ id: genId() })}
        duplicateRow={({ rowData }) => ({ ...rowData, id: genId() })}
        isRowEmpty={({ rowData }) => !rowData.firstName && !rowData.lastName}
        columns={[
          { ...keyColumn('id', textColumn), title: 'ID', disabled: true },
          { ...keyColumn('firstName', textColumn), title: 'First name' },
          { ...keyColumn('lastName', textColumn), title: 'Last name' },
        ]}
      />
    </div>
  )
}
