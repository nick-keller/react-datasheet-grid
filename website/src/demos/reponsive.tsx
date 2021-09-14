import React, { useState } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
  intColumn,
} from 'react-datasheet-grid'
import faker from 'faker'
import { Rnd } from 'react-rnd'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(15).fill(0).map(() => ({
      active: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      int: faker.datatype.number(100),
    }))
  )

  return (
    <div style={{ position: 'relative' }}>
      <Rnd
        style={{
          position: 'relative',
          paddingRight: 10,
        }}
        disableDragging
        default={{ x: 0, y: 0, width: '80%', height: 'auto' }}
        enableResizing={{ right: true }}
        minWidth={250}
        bounds="parent"
      >
        <div
          style={{
            position: 'absolute',
            top: '30%',
            bottom: '30%',
            right: 0,
            width: 4,
            boxShadow: '-1px 0 0 #cdcdcd inset, 1px 0 0 #cdcdcd inset',
          }}
        />
        <DataSheetGrid
          value={data}
          onChange={setData}
          columns={[
            {
              ...keyColumn('active', checkboxColumn),
              title: 'Active',
              minWidth: 60,
            },
            {
              ...keyColumn('firstName', textColumn),
              title: 'First name',
              minWidth: 150,
            },
            {
              ...keyColumn('lastName', textColumn),
              title: 'Last name',
              minWidth: 150,
            },
            { ...keyColumn('int', intColumn), title: 'Number' },
          ]}
        />
      </Rnd>
    </div>
  )
}
