import React, { useState } from 'react'
import {
  checkboxColumn,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default ({ rows = 5 }: { rows: number }) => {
  const [data, setData] = useState<any[]>(
    new Array(rows).fill(0).map(() => ({
      active: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    }))
  )

  return (
    <DataSheetGrid
      data={data}
      onChange={setData}
      columns={[
        { ...keyColumn('active', checkboxColumn), title: 'Active' },
        { ...keyColumn('firstName', textColumn), title: 'First name' },
        { ...keyColumn('lastName', textColumn), title: 'Last name' },
      ]}
    />
  )
}
