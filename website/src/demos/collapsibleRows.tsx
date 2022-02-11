import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DataSheetGrid,
  intColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

type Child = {
  firstName: string
  lastName: string
  salary: number
}

type Group = {
  name: string
  children: Child[]
}

type Row =
  | {
      type: 'GROUP'
      groupIndex: number
      opened: boolean
      salary: number
      name: string
    }
  | {
      type: 'CHILD'
      groupIndex: number
      childIndex: number
      firstName: string
      lastName: string
      salary: number
    }

export const FinalResult = () => {
  const [groups, setGroups] = useState<Group[]>(() =>
    new Array(4).fill(0).map(
      () =>
        ({
          name: faker.name.jobTitle(),
          children: new Array(faker.datatype.number(4) + 1).fill(0).map(
            () =>
              ({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                salary: faker.datatype.number(2000) + 1000,
              } as Child)
          ),
        } as Group)
    )
  )

  const [openedGroups, setOpenedGroups] = useState<number[]>([])

  const toggleGroup = useCallback((i: number) => {
    setOpenedGroups((opened) => {
      if (opened.includes(i)) {
        return opened.filter((x) => x !== i)
      }

      return [...opened, i]
    })
  }, [])

  const rows = useMemo<Row[]>(() => {
    const result = []

    for (let i = 0; i < groups.length; i++) {
      result.push({
        type: 'GROUP',
        salary: groups[i].children.reduce(
          (acc, cur) => acc + (cur.salary ?? 0),
          0
        ),
        groupIndex: i,
        opened: openedGroups.includes(i),
        name: groups[i].name,
      })

      if (openedGroups.includes(i)) {
        for (let j = 0; j < groups[i].children.length; j++) {
          result.push({
            type: 'CHILD',
            groupIndex: i,
            childIndex: j,
            ...groups[i].children[j],
          })
        }
      }
    }

    return result
  }, [groups, openedGroups])

  return (
    <DataSheetGrid<Row>
      value={rows}
      onChange={(newRows, operations) => {
        for (const operation of operations) {
          if (operation.type === 'UPDATE') {
            for (const row of newRows.slice(
              operation.fromRowIndex,
              operation.toRowIndex
            )) {
              if (row.type === 'CHILD') {
                groups[row.groupIndex].children[row.childIndex] = {
                  firstName: row.firstName,
                  lastName: row.lastName,
                  salary: row.salary,
                }
              }
            }
          }

          if (operation.type === 'CREATE') {
            const groupIndex = newRows[operation.fromRowIndex - 1].groupIndex
            const childIndex =
              newRows[operation.fromRowIndex - 1].childIndex ?? -1

            groups[groupIndex].children = [
              ...groups[groupIndex].children.slice(0, childIndex + 1),
              ...newRows
                .slice(operation.fromRowIndex, operation.toRowIndex)
                .map((row) => ({
                  firstName: row.firstName,
                  lastName: row.lastName,
                  salary: row.salary,
                })),
              ...groups[groupIndex].children.slice(childIndex + 1),
            ]
          }

          if (operation.type === 'DELETE') {
            const deletedRows = rows
              .slice(operation.fromRowIndex, operation.toRowIndex)
              .reverse()

            for (const deletedRow of deletedRows) {
              if (deletedRow.type === 'CHILD') {
                groups[deletedRow.groupIndex].children.splice(
                  deletedRow.childIndex,
                  1
                )
              }
            }
          }
        }

        setGroups([...groups])
      }}
      columns={[
        {
          component: ({ rowData, focus, stopEditing }) => {
            useEffect(() => {
              if (focus) {
                toggleGroup(rowData.groupIndex)
                stopEditing({ nextRow: false })
              }
            }, [focus, rowData.groupIndex, stopEditing])

            if (rowData.type !== 'GROUP') {
              return null
            }

            return (
              <span style={{ paddingLeft: 10 }}>
                {rowData.opened ? '👇' : '👉️'} {rowData.name}
              </span>
            )
          },
          disabled: ({ rowData }) => rowData.type === 'CHILD',
          title: 'Group',
          minWidth: 300,
          isCellEmpty: () => true,
        },
        {
          ...keyColumn('firstName', textColumn),
          disabled: ({ rowData }) => rowData.type === 'GROUP',
          title: 'First name',
        },
        {
          ...keyColumn('lastName', textColumn),
          disabled: ({ rowData }) => rowData.type === 'GROUP',
          title: 'Last name',
        },
        {
          ...keyColumn('salary', intColumn),
          disabled: ({ rowData }) => rowData.type === 'GROUP',
          title: 'Salary',
        },
      ]}
    />
  )
}
