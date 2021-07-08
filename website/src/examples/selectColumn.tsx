import React, { useLayoutEffect, useRef, useState } from 'react'
import {
  DataSheetGrid,
  CellProps,
  Column,
  keyColumn,
  intColumn,
} from 'react-datasheet-grid'
import Select from 'react-select'

type Choice = {
  label: string
  value: string
}

type SelectOptions = {
  choices: Choice[]
  disabled?: boolean
}

const SelectComponent = React.memo(
  ({
    active,
    rowData,
    setRowData,
    focus,
    stopEditing,
    columnData,
  }: CellProps<string | null, SelectOptions>) => {
    const ref = useRef<Select>(null)

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.focus()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            flex: 1,
            alignSelf: 'stretch',
            pointerEvents: focus ? undefined : 'none',
          }),
          control: (provided) => ({
            ...provided,
            height: '100%',
            border: 'none',
            boxShadow: 'none',
            background: 'none',
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            opacity: 0,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
        }}
        isDisabled={columnData.disabled}
        value={
          columnData.choices.find(({ value }) => value === rowData) ?? null
        }
        menuPortalTarget={document.body}
        menuIsOpen={focus}
        onChange={({ value }) => {
          setRowData(value)
          setTimeout(stopEditing, 0)
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        options={columnData.choices}
      />
    )
  }
)

SelectComponent.displayName = 'SelectComponent'

const defaultChoices = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
]

const selectColumn = (
  options: SelectOptions
): Column<string | null, SelectOptions> => ({
  component: SelectComponent,
  columnData: options,
  disableKeys: true,
  keepFocus: true,
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) =>
    options.choices.find((choice) => choice.value === rowData)?.label,
  pasteValue: ({ value }) =>
    options.choices.find((choice) => choice.label === value)?.value ?? null,
})

export const FinalResult = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            ...selectColumn({
              choices: defaultChoices,
            }),
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

type Row = {
  flavor: string | null
  quantity: number | null
}

export const MultipleColumns = () => {
  const [data, setData] = useState<Row[]>([
    { flavor: 'chocolate', quantity: 3 },
    { flavor: 'strawberry', quantity: 5 },
    { flavor: null, quantity: null },
  ])

  const columns: Column<Row>[] = [
    {
      ...keyColumn(
        'flavor',
        selectColumn({
          choices: defaultChoices,
        })
      ),
      title: 'Flavor',
    },
    {
      ...keyColumn('quantity', intColumn),
      title: 'Quantity',
    },
  ]

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid data={data} onChange={setData} columns={columns} />
    </div>
  )
}

export const Step1 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: Select,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

const SelectComponent2 = () => {
  return (
    <Select
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
      }}
    />
  )
}

export const Step2 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent2,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

const SelectComponent3 = ({ active, focus }: CellProps) => {
  return (
    <Select
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      options={defaultChoices}
    />
  )
}

export const Step3 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
    null,
    null,
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent3,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

const SelectComponent4 = ({ active, focus }: CellProps) => {
  return (
    <Select
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      menuPortalTarget={document.body}
      menuIsOpen={focus}
      options={defaultChoices}
    />
  )
}

export const Step4 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent4,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

const SelectComponent5 = ({ active, focus }: CellProps) => {
  const ref = useRef<Select>(null)

  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [focus])

  return (
    <Select
      ref={ref}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      menuPortalTarget={document.body}
      menuIsOpen={focus}
      options={defaultChoices}
    />
  )
}

export const Step5 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent5,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

const SelectComponent6 = ({ active, focus, stopEditing }: CellProps) => {
  const ref = useRef<Select>(null)

  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [focus])

  return (
    <Select
      ref={ref}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      menuPortalTarget={document.body}
      onMenuClose={() => stopEditing({ nextRow: false })}
      menuIsOpen={focus}
      options={defaultChoices}
    />
  )
}

export const Step6 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent6,
            keepFocus: true,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

const SelectComponent7 = ({ active, focus, stopEditing }: CellProps) => {
  const ref = useRef<Select>(null)

  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [focus])

  return (
    <Select
      ref={ref}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      menuPortalTarget={document.body}
      menuIsOpen={focus}
      onMenuClose={() => stopEditing({ nextRow: false })}
      options={defaultChoices}
    />
  )
}

export const Step7 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent7,
            disableKeys: true,
            keepFocus: true,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

const SelectComponent8 = ({
  active,
  focus,
  rowData,
  setRowData,
  stopEditing,
}: CellProps) => {
  const ref = useRef<Select>(null)

  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [focus])

  return (
    <Select
      ref={ref}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: 'stretch',
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      menuPortalTarget={document.body}
      value={defaultChoices.find(({ value }) => value === rowData) ?? null}
      menuIsOpen={focus}
      onChange={({ value }) => {
        setRowData(value)
        setTimeout(stopEditing, 0)
      }}
      onMenuClose={() => stopEditing({ nextRow: false })}
      options={defaultChoices}
    />
  )
}

export const Step8 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent8,
            disableKeys: true,
            keepFocus: true,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}

export const Step9 = () => {
  const [data, setData] = useState<Array<string | null>>([
    'chocolate',
    'strawberry',
    null,
  ])

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          {
            component: SelectComponent8,
            disableKeys: true,
            keepFocus: true,
            deleteValue: () => null,
            copyValue: ({ rowData }) =>
              defaultChoices.find((choice) => choice.value === rowData)?.label,
            pasteValue: ({ value }) =>
              defaultChoices.find((choice) => choice.label === value)?.value ??
              null,
            title: 'Flavor',
          },
        ]}
      />
    </div>
  )
}
