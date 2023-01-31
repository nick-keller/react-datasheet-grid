import { parseFloatIntl } from './internationalization'

const NARROW_NO_BREAK_SPACE = ' '
const NO_BREAK_SPACE = ' '

describe('parsePlainTextData', () => {
  test('Parse standard english number', () => {
    expect(parseFloatIntl('1,234.56', 'en')).toEqual(1234.56)
  })
  test('Parse awkward english number', () => {
    expect(parseFloatIntl('44,44,44.44', 'en')).toEqual(444444.44)
  })

  test('Parse standard german number', () => {
    expect(parseFloatIntl('1.234,56', 'de')).toEqual(1234.56)
  })
  test('Parse awkward german number', () => {
    expect(parseFloatIntl('44.44.44,44', 'de')).toEqual(444444.44)
  })

  test('Parse standard french number', () => {
    expect(
      parseFloatIntl(`1${NARROW_NO_BREAK_SPACE}234,56`, 'fr')
    ).toEqual(1234.56)
  })
  test('Parse awkward french number', () => {
    expect(
      parseFloatIntl(
        `44${NARROW_NO_BREAK_SPACE}44${NARROW_NO_BREAK_SPACE}44,44`,
        'fr'
      )
    ).toEqual(444444.44)
  })

  test('Parse standard polish number', () => {
    expect(
      parseFloatIntl(`1${NO_BREAK_SPACE}234,56`, 'pl')
    ).toEqual(1234.56)
  })
  test('Parse awkward polish number', () => {
    expect(
      parseFloatIntl(
        `44${NO_BREAK_SPACE}44${NO_BREAK_SPACE}44,44`,
        'pl'
      )
    ).toEqual(444444.44)
  })

  test('Parse standard spanish number', () => {
    expect(parseFloatIntl('1.234,56', 'es')).toEqual(1234.56)
  })
  test('Parse awkward spanish number', () => {
    expect(parseFloatIntl('44.44.44,44', 'es')).toEqual(444444.44)
  })
})
