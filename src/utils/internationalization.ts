// For more information on how this works, check out this blogpost
// https://observablehq.com/@mbostock/localized-number-parsing
export const parseFloatIntl = (
  float: string,
  locale?: string
): number => {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  // Non null assertions since there will always be group + decimal parts in 12345.6
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const groupValue = parts.find((d) => d.type === 'group')!.value
  const group = new RegExp(`[${groupValue}]`, 'g')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const decimalValue = parts.find((d) => d.type === 'decimal')!.value
  const decimal = new RegExp(`[${decimalValue}]`)

  const val = float.trim().replace(group, '').replace(decimal, '.')

  return parseFloat(val)
}
