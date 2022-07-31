# react-datasheet-grid

[![Travis (.com)](https://img.shields.io/travis/com/nick-keller/react-datasheet-grid)](https://app.travis-ci.com/github/nick-keller/react-datasheet-grid)
[![Coveralls](https://img.shields.io/coveralls/github/nick-keller/react-datasheet-grid)](https://coveralls.io/github/nick-keller/react-datasheet-grid)
[![npm](https://img.shields.io/npm/dm/react-datasheet-grid)](https://www.npmjs.com/package/react-datasheet-grid)
[![GitHub last commit](https://img.shields.io/github/last-commit/nick-keller/react-datasheet-grid)](https://github.com/nick-keller/react-datasheet-grid)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-datasheet-grid)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

View [demo and documentation](https://react-datasheet-grid.netlify.app/)

An Airtable-like / Excel-like component to create beautiful spreadsheets.

![Preview](./images/preview.png)

Feature rich:
- Dead simple to set up and to use
- Supports copy / pasting to and from Excel, Google-sheet...
- Keyboard navigation and shortcuts fully-supported
- Supports right-clicking and custom context menu
- Supports dragging corner to expand selection
- Easy to extend and implement custom widgets
- Blazing fast, optimized for speed, minimal renders count
- Smooth animations
- Virtualized, supports hundreds of thousands of rows
- Extensively customizable, controllable behaviors
- Built with Typescript

## Install

```bash
npm i react-datasheet-grid
```

## Usage

```tsx
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'

// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'

const Example = () => {
  const [ data, setData ] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns = [
    {
      ...keyColumn('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn('lastName', textColumn),
      title: 'Last name',
    },
  ]

  return (
    <DataSheetGrid
      value={data}
      onChange={setData}
      columns={columns}
    />
  )
}
```
