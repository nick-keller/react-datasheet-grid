import { parseFloatIntl } from '../utils/internationalization'
import { createTextColumn } from './textColumn'

export const intColumn = createTextColumn<number | null>({
  alignRight: true,
  formatBlurredInput: (value) =>
    typeof value === 'number' ? new Intl.NumberFormat().format(value) : '',
  parseUserInput: (value) => {
    const number = parseFloatIntl(value)
    return !isNaN(number) ? Math.round(number) : null
  },
  parsePastedValue: (value) => {
    const number = parseFloatIntl(value)
    return !isNaN(number) ? Math.round(number) : null
  },
})
