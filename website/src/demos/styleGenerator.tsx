import React, { useMemo, useState } from 'react'
import {
  DynamicDataSheetGrid,
  checkboxColumn,
  textColumn,
  dateColumn,
  intColumn,
  floatColumn,
  percentColumn,
  keyColumn,
} from 'react-datasheet-grid'
import faker from 'faker'
import CodeBlock from '@theme/CodeBlock'
import './styleGenerator.css'

const customProps = [
  { name: '--dsg-border-color', defaultValue: '#e8ebed', type: 'color' },
  {
    name: '--dsg-selection-border-color',
    defaultValue: 'rgb(69, 128, 230)',
    type: 'color',
  },
  { name: '--dsg-selection-border-radius', defaultValue: '2px', type: 'size' },
  { name: '--dsg-selection-border-width', defaultValue: '2px', type: 'size' },
  {
    name: '--dsg-selection-background-color',
    defaultValue: 'rgba(69, 128, 230, 0.04)',
    type: 'color',
  },
  {
    name: '--dsg-selection-disabled-border-color',
    defaultValue: '#9DA6AB',
    type: 'color',
  },
  {
    name: '--dsg-selection-disabled-background-color',
    defaultValue: 'rgba(0, 0, 0, 0.04)',
    type: 'color',
  },
  { name: '--dsg-corner-indicator-width', defaultValue: '10px', type: 'size' },
  {
    name: '--dsg-header-text-color',
    defaultValue: 'rgb(157, 166, 171)',
    type: 'color',
  },
  {
    name: '--dsg-header-active-text-color',
    defaultValue: 'black',
    type: 'color',
  },
  { name: '--dsg-cell-background-color', defaultValue: 'white', type: 'color' },
  {
    name: '--dsg-cell-disabled-background-color',
    defaultValue: 'rgb(250, 250, 250)',
    type: 'color',
  },
  { name: '--dsg-transition-duration', defaultValue: '.1s', type: 'duration' },
  {
    name: '--dsg-expand-rows-indicator-width',
    defaultValue: '10px',
    type: 'size',
  },
  { name: '--dsg-scroll-shadow-width', defaultValue: '7px', type: 'size' },
  {
    name: '--dsg-scroll-shadow-color',
    defaultValue: 'rgba(0,0,0,.2)',
    type: 'color',
  },
]

export default () => {
  const [cpValues, setCpValues] = useState({})
  const [data, setData] = useState<any[]>(() =>
    new Array(50).fill(0).map(() => ({
      active: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      job: faker.name.jobTitle(),
      area: faker.name.jobArea(),
      int: faker.datatype.number(1100),
      float: faker.datatype.number(1000) / 100,
      percent: faker.datatype.number(100) / 100,
      date: new Date(faker.date.past()),
    }))
  )

  const columns = useMemo(
    () => [
      { ...keyColumn('active', checkboxColumn), title: 'Active' },
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
      {
        ...keyColumn('int', intColumn),
        title: 'Integer',
        minWidth: 150,
        disabled: ({ rowData }) => rowData.active,
      },
      {
        ...keyColumn('float', floatColumn),
        title: 'Float',
        minWidth: 150,
        disabled: true,
      },
      {
        ...keyColumn('percent', percentColumn),
        title: 'Percentage',
        minWidth: 150,
      },
      { ...keyColumn('date', dateColumn), title: 'Date' },
      {
        ...keyColumn('job', textColumn),
        title: 'Job',
        minWidth: 250,
      },
      {
        ...keyColumn('area', textColumn),
        title: 'Job area',
        minWidth: 150,
      },
    ],
    []
  )

  return (
    <>
      <div className="generator-form" style={{ marginBottom: 20 }}>
        {customProps.map(({ name, defaultValue }) => (
          <div key={name}>
            <label htmlFor={name} className={cpValues[name] ? 'active' : ''}>
              {name}:
            </label>
            <input
              id={name}
              placeholder={defaultValue}
              value={cpValues[name]}
              onChange={(e) =>
                setCpValues({
                  ...cpValues,
                  [name]: e.target.value || undefined,
                })
              }
            />
          </div>
        ))}
      </div>
      <CodeBlock className="language-css">{`:root {${Object.entries(cpValues)
        .filter(([_, value]) => value)
        .map(([key, value]) => `\n  ${key}: ${value};`)
        .join('')}\n}`}</CodeBlock>
      <DynamicDataSheetGrid
        style={cpValues}
        value={data}
        onChange={setData}
        columns={columns}
        height={250}
      />
    </>
  )
}
