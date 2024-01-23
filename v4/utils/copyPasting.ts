import { parseDom } from './domParser'

export const parseTextHtmlData = (data: string): string[][] => {
  const doc = parseDom(data.replace(/<br\/?>/g, '\n'))
  const table = doc.getElementsByTagName('table')[0]

  if (table) {
    const rows: string[][] = []

    for (let i = 0; i < table.rows.length; i++) {
      const row: string[] = []
      rows.push(row)

      for (let j = 0; j < table.rows[i].cells.length; j++) {
        row.push(table.rows[i].cells[j].textContent ?? '')
      }
    }

    return rows
  }

  const span = doc.getElementsByTagName('span')[0]

  if (span) {
    return [[span.textContent ?? '']]
  }

  return [['']]
}

export const parseTextPlainData = (data: string): string[][] => {
  const cleanData = data.replace(/\r|\n$/g, '')
  const output: string[][] = [[]]
  let cursor = 0
  let startCell = 0
  let quoted = false
  let lastRowIndex = 0

  const saveCell = () => {
    let str = cleanData.slice(startCell, cursor)

    if (quoted && str[str.length - 1] === '"' && str.includes('\n')) {
      str = str.slice(1, str.length - 1).replace(/""/g, '"')
    }

    if (quoted && str[str.length - 1] !== '"') {
      str.split('\n').forEach((cell, i, { length }) => {
        output[lastRowIndex].push(cell)

        if (i < length - 1) {
          output.push([])
          lastRowIndex++
        }
      })
    } else {
      output[lastRowIndex].push(str)
    }
  }

  while (cursor < cleanData.length) {
    if (
      quoted &&
      cleanData[cursor] === '"' &&
      ![undefined, '\t', '"'].includes(cleanData[cursor + 1])
    ) {
      quoted = false
    }

    if (quoted && cleanData[cursor] === '"' && cleanData[cursor + 1] === '"') {
      cursor++
    }

    if (cursor === startCell && cleanData[cursor] === '"') {
      quoted = true
    }

    if (cleanData[cursor] === '\t') {
      saveCell()
      startCell = cursor + 1
      quoted = false
    }

    if (cleanData[cursor] === '\n' && !quoted) {
      saveCell()
      output.push([])
      startCell = cursor + 1
      lastRowIndex++
    }

    cursor++
  }

  saveCell()

  return output
}

export const encodeHtml = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
