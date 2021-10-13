import { createTextColumn } from './textColumn'

const TEN_TO_THE_12 = 1000000000000
const TEN_TO_THE_10 = 10000000000

export const percentColumn = createTextColumn<number | null>({
  alignRight: true,
  formatBlurredInput: (value) =>
    typeof value === 'number'
      ? new Intl.NumberFormat(undefined, { style: 'percent' }).format(value)
      : '',
  // We turn percentages (numbers between 0 and 1) into string (between 0 and 100)
  // We could have just multiply percentages by 100, but floating point arithmetic won't work as expected: 0.29 * 100 === 28.999999999999996
  // So we have to round those numbers to 10 decimals before turning them into strings
  formatInputOnFocus: (value) =>
    typeof value === 'number' && !isNaN(value)
      ? String(Math.round(value * TEN_TO_THE_12) / TEN_TO_THE_10)
      : '',
  parseUserInput: (value) => {
    const number = parseFloat(value)
    return !isNaN(number) ? number / 100 : null
  },
  parsePastedValue: (value) => {
    const number = parseFloat(value)
    return !isNaN(number) ? number : null
  },
})
