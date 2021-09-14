import React, { useState } from 'react'
import {
  checkboxColumn,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(5).fill(0).map(() => ({
      active: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    }))
  )

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        value={data}
        onChange={setData}
        columns={[
          { ...keyColumn('active', checkboxColumn), title: 'Active' },
          {
            ...keyColumn('firstName', textColumn),
            title: 'First name',
            disabled: ({ rowData }) => !rowData.active,
          },
          {
            ...keyColumn('lastName', textColumn),
            title: 'Last name',
            disabled: true,
          },
        ]}
      />
    </div>
  )
}
