import { parseData } from './copyPasting'

describe('parseData', () => {
  test('single cell', () => {
    expect(parseData('')).toEqual([['']])
    expect(parseData('foo')).toEqual([['foo']])
  })

  test('single row', () => {
    expect(parseData('\t\t')).toEqual([['', '', '']])
    expect(parseData('foo\tbar\tbaz')).toEqual([['foo', 'bar', 'baz']])
  })

  test('single column', () => {
    expect(parseData('\n\n')).toEqual([[''], [''], ['']])
    expect(parseData('foo\nbar\nbaz')).toEqual([['foo'], ['bar'], ['baz']])
  })

  test('multiple rows and columns', () => {
    expect(parseData('\t\n\t\n\t')).toEqual([
      ['', ''],
      ['', ''],
      ['', ''],
    ])
    expect(parseData('a\tb\tc\nd\te\tf')).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ])
  })

  test('single cell multi line', () => {
    expect(parseData('"foo\nbar""baz"""')).toEqual([['foo\nbar"baz"']])
  })

  test('quoted first cell', () => {
    expect(parseData('"foo\nbar')).toEqual([['"foo'], ['bar']])
  })

  test('two quoted cells', () => {
    expect(parseData('"foo\tbar"')).toEqual([['"foo', 'bar"']])
    expect(parseData('"foo"\t"bar"')).toEqual([['"foo"', '"bar"']])
  })
})
