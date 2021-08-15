import React, { useRef, useState } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
  intColumn,
  DataSheetGridRef,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(10).fill(0).map(() => ({
      active: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      int: faker.datatype.number(1100),
    }))
  )
  const ref = useRef<DataSheetGridRef>(null)

  return (
    <>
      <div
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}
      >
        <span
          className="action"
          onMouseEnter={() => {
            ref.current?.setActiveCell({ col: 1, row: 3 })
          }}
        >
          {'ref.current?.setActiveCell({ col: 1, row: 3 })'}
        </span>
        <span
          className="action"
          onMouseEnter={() => {
            ref.current?.setSelection({
              min: { col: 0, row: 1 },
              max: { col: 1, row: 4 },
            })
          }}
        >
          {
            'ref.current?.setSelection({ min: { col: 0, row: 1 }, max: { col: 1, row: 4 }})'
          }
        </span>
      </div>
      <DataSheetGrid
        ref={ref}
        data={data}
        onChange={setData}
        columns={[
          { ...keyColumn('active', checkboxColumn), title: 'Active' },
          { ...keyColumn('firstName', textColumn), title: 'First name' },
          { ...keyColumn('lastName', textColumn), title: 'Last name' },
          { ...keyColumn('int', intColumn), title: 'Number' },
        ]}
      />
    </>
  )
}
