import React, { useMemo, useRef, useState } from 'react'
import { DataSheetGrid, keyColumn, textColumn } from 'react-datasheet-grid'
import faker from 'faker'

type Row = {
  id: number
  firstName?: string | null
  lastName?: string | null
  job?: string | null
}
import './trackRows.css'

export const FinalResult = () => {
  const counter = useRef(1)
  const genId = () => counter.current++

  const [data, setData] = useState<Row[]>(() =>
    new Array(5).fill(0).map(
      () =>
        ({
          id: genId(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          job: faker.name.jobTitle(),
        } as Row)
    )
  )
  const [prevData, setPrevData] = useState(data)

  const createdRowIds = useMemo(() => new Set<number>(), [])
  const deletedRowIds = useMemo(() => new Set<number>(), [])
  const updatedRowIds = useMemo(() => new Set<number>(), [])

  const commit = () => {
    const newData = data.filter(({ id }) => !deletedRowIds.has(id))
    setData(newData)
    createdRowIds.clear()
    deletedRowIds.clear()
    updatedRowIds.clear()
    setPrevData(newData)
  }

  const cancel = () => {
    setData(prevData)
    createdRowIds.clear()
    deletedRowIds.clear()
    updatedRowIds.clear()
  }

  return (
    <>
      <button type="button" className="btn" onClick={commit}>
        Commit
      </button>
      <button type="button" className="btn" onClick={cancel}>
        Cancel
      </button>
      <DataSheetGrid<Row>
        value={data}
        rowClassName={({ rowData: { id } }) => {
          if (deletedRowIds.has(id)) {
            return 'row-deleted'
          }
          if (createdRowIds.has(id)) {
            return 'row-created'
          }
          if (updatedRowIds.has(id)) {
            return 'row-updated'
          }
        }}
        onChange={(newValue, operations) => {
          for (const operation of operations) {
            if (operation.type === 'CREATE') {
              newValue
                .slice(operation.fromRowIndex, operation.toRowIndex)
                .forEach(({ id }) => createdRowIds.add(id))
            }

            if (operation.type === 'UPDATE') {
              newValue
                .slice(operation.fromRowIndex, operation.toRowIndex)
                .forEach(({ id }) => {
                  if (!createdRowIds.has(id) && !deletedRowIds.has(id)) {
                    updatedRowIds.add(id)
                  }
                })
            }

            if (operation.type === 'DELETE') {
              let keptRows = 0

              data
                .slice(operation.fromRowIndex, operation.toRowIndex)
                .forEach(({ id }, i) => {
                  updatedRowIds.delete(id)

                  if (createdRowIds.has(id)) {
                    createdRowIds.delete(id)
                  } else {
                    deletedRowIds.add(id)
                    newValue.splice(
                      operation.fromRowIndex + keptRows++,
                      0,
                      data[operation.fromRowIndex + i]
                    )
                  }
                })
            }
          }

          setData(newValue)
        }}
        createRow={() => ({ id: genId() })}
        duplicateRow={({ rowData }) => ({ ...rowData, id: genId() })}
        columns={[
          { ...keyColumn('firstName', textColumn), title: 'First Name' },
          { ...keyColumn('lastName', textColumn), title: 'Last Name' },
          { ...keyColumn('job', textColumn), title: 'Job' },
        ]}
      />
    </>
  )
}
