# Change Log

## 3.3.0
> Date: 2021-09-21
### Added
- User can now drag the corner of the selection to expand it.
### Fixed
- Headers width computation could be off in certain conditions because of the way flexbox computes 
  width when items have padding.

## 3.2.3
> Date: 2021-09-19
### Fixed
- Initial height computation made the grid jump 1 pixel

## 3.2.2
> Date: 2021-09-14
### Fixed
- Issues with SSR and DOMParser

## 3.2.0
> Date: 2021-09-14
### Added
- `activeCell` and `selection` of the ref now include `colId` if the column has an id.
- New props `onFocus`, `onBlur`, `onActiveCellChange`, and `onSelectionChange`
### Changed
- Prop `data` on `<DataSheetGrid/>` has been renamed `value` to match standards. `data` is still supported 
  but is now deprecated and support will be dropped on next major version.

## 3.1.2
> Date: 2021-09-07
### Improved
- Improved accessibility by allowing to focus next tabbable element in the dom when tabbing from the last cell, 
  and previous element when Shift+Tab from the first cell.

## 3.1.1
> Date: 2021-09-07
### Improved
- Improved copy / pasting by supporting text/html data type. Dealing with edge cases with special characters
  now works perfectly.

## 3.1.0
> Date: 2021-09-03
### Added
- Columns can now have an `id`, making `setActiveCell` and `setSelection` easier to use by specifying the column's `id` 
  instead of its index.

## 3.0.0
> Date: 2021-09-03
### Breaking changes
- Prop `isRowEmpty` on `<DataSheetGrid/>` has been deleted in favor of `isCellEmpty` on each column.

## 2.0.11
> Date: 2021-09-01 
### Added
- `disabled`, `deleteValue`, `copyValue`, `pasteValue`, `duplicateRow`, and `isRowEmpty` now have access to the `rowIndex`
- Columns can now specify `headerClassName` and `cellClassName`
- `<DataSheetGrid/>` now has `style` and `className` props

## Anterior versions
Changes were not track properly.