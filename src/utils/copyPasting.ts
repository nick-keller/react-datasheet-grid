export const parseData = (data: string): string[][] => {
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
