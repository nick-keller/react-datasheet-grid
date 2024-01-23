import {
  parseTextPlainData,
  parseTextHtmlData,
  encodeHtml,
} from './copyPasting'
import { JSDOM } from 'jsdom'

jest.mock('./domParser', () => ({
  parseDom: (html: string) => {
    const dom = new JSDOM(html)
    return dom.window.document
  },
}))

describe('parseTextHtmlData', () => {
  test('single empty cell GoogleSheet', () => {
    expect(
      parseTextHtmlData(
        '<meta charset=\'utf-8\'><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><span style="font-size:10pt;font-family:Arial;font-style:normal;"></span>'
      )
    ).toEqual([['']])
  })

  test('single cell GoogleSheet', () => {
    expect(
      parseTextHtmlData(
        '<meta charset=\'utf-8\'><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><span style="font-size:10pt;font-family:Arial;font-style:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;foo&quot;}" data-sheets-userformat="{&quot;2&quot;:513,&quot;3&quot;:{&quot;1&quot;:0},&quot;12&quot;:0}">foo</span>'
      )
    ).toEqual([['foo']])
  })

  test('single empty cell Excel', () => {
    expect(
      parseTextHtmlData(
        '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"> <head> <meta http-equiv=Content-Type content="text/html; charset=utf-8"> <meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 15"> <link id=Main-File rel=Main-File href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip.htm"> <link rel=File-List href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_filelist.xml"> <style> <!--table {mso-displayed-decimal-separator:"\\,"; mso-displayed-thousand-separator: ;} @page {margin:.75in .7in .75in .7in; mso-header-margin:.3in; mso-footer-margin:.3in;} tr {mso-height-source:auto;} col {mso-width-source:auto;} br {mso-data-placement:same-cell;} td {padding-top:1px; padding-right:1px; padding-left:1px; mso-ignore:padding; color:black; font-size:12.0pt; font-weight:400; font-style:normal; text-decoration:none; font-family:Calibri, sans-serif; mso-font-charset:0; mso-number-format:General; text-align:general; vertical-align:bottom; border:none; mso-background-source:auto; mso-pattern:auto; mso-protection:locked visible; white-space:nowrap; mso-rotate:0;} --> </style> </head> <body link="#0563C1" vlink="#954F72"> <table border=0 cellpadding=0 cellspacing=0 width=87 style=\'border-collapse: collapse;width:65pt\'> <col width=87 style=\'width:65pt\'> <tr height=21 style=\'height:16.0pt\'> <!--StartFragment--> <td height=21 width=87 style=\'height:16.0pt;width:65pt\'></td> <!--EndFragment--> </tr> </table> </body> </html>'
      )
    ).toEqual([['']])
  })

  test('single cell Excel', () => {
    expect(
      parseTextHtmlData(
        '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"> <head> <meta http-equiv=Content-Type content="text/html; charset=utf-8"> <meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 15"> <link id=Main-File rel=Main-File href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip.htm"> <link rel=File-List href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_filelist.xml"> <style> <!--table {mso-displayed-decimal-separator:"\\,"; mso-displayed-thousand-separator: ;} @page {margin:.75in .7in .75in .7in; mso-header-margin:.3in; mso-footer-margin:.3in;} tr {mso-height-source:auto;} col {mso-width-source:auto;} br {mso-data-placement:same-cell;} td {padding-top:1px; padding-right:1px; padding-left:1px; mso-ignore:padding; color:black; font-size:12.0pt; font-weight:400; font-style:normal; text-decoration:none; font-family:Calibri, sans-serif; mso-font-charset:0; mso-number-format:General; text-align:general; vertical-align:bottom; border:none; mso-background-source:auto; mso-pattern:auto; mso-protection:locked visible; white-space:nowrap; mso-rotate:0;} --> </style> </head> <body link="#0563C1" vlink="#954F72"> <table border=0 cellpadding=0 cellspacing=0 width=87 style=\'border-collapse: collapse;width:65pt\'> <col width=87 style=\'width:65pt\'> <tr height=21 style=\'height:16.0pt\'> <!--StartFragment--> <td height=21 width=87 style=\'height:16.0pt;width:65pt\'>foo</td> <!--EndFragment--> </tr> </table> </body> </html>'
      )
    ).toEqual([['foo']])
  })

  test('4 cells GoogleSheet', () => {
    expect(
      parseTextHtmlData(
        '<meta charset=\'utf-8\'><google-sheets-html-origin><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table xmlns="http://www.w3.org/1999/xhtml" cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px;border-collapse:collapse;border:none"><colgroup><col width="86"/><col width="100"/></colgroup><tbody><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;foo&quot;}">foo</td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;bar&quot;}">bar</td></tr><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;baz&quot;}">baz</td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-numberformat="{&quot;1&quot;:2,&quot;2&quot;:&quot;#,##0.00&quot;,&quot;3&quot;:1}"></td></tr></tbody></table>'
      )
    ).toEqual([
      ['foo', 'bar'],
      ['baz', ''],
    ])
  })

  test('4 cells Excel', () => {
    expect(
      parseTextHtmlData(
        '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"> <head> <meta http-equiv=Content-Type content="text/html; charset=utf-8"> <meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 15"> <link id=Main-File rel=Main-File href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip.htm"> <link rel=File-List href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_filelist.xml"> <style> <!--table {mso-displayed-decimal-separator:"\\,"; mso-displayed-thousand-separator: ;} @page {margin:.75in .7in .75in .7in; mso-header-margin:.3in; mso-footer-margin:.3in;} tr {mso-height-source:auto;} col {mso-width-source:auto;} br {mso-data-placement:same-cell;} td {padding-top:1px; padding-right:1px; padding-left:1px; mso-ignore:padding; color:black; font-size:12.0pt; font-weight:400; font-style:normal; text-decoration:none; font-family:Calibri, sans-serif; mso-font-charset:0; mso-number-format:General; text-align:general; vertical-align:bottom; border:none; mso-background-source:auto; mso-pattern:auto; mso-protection:locked visible; white-space:nowrap; mso-rotate:0;} .xl65 {font-size:10.0pt; font-family:Arial, sans-serif; mso-font-charset:0;} --> </style> </head> <body link="#0563C1" vlink="#954F72"> <meta charset=utf-8> <table border=0 cellpadding=0 cellspacing=0 width=174 style=\'border-collapse: collapse;width:130pt\' xmlns="http://www.w3.org/1999/xhtml"> <!--StartFragment--> <col width=87 span=2 style=\'width:65pt\'> <tr height=21 style=\'height:16.0pt\'> <td height=21 class=xl65 width=87 style=\'height:16.0pt;width:65pt;overflow: hidden;padding-bottom:2px;padding-top:2px\' data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;foo&quot;}">foo</td> <td class=xl65 width=87 style=\'width:65pt;overflow:hidden;padding-bottom: 2px;padding-top:2px\' data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;bar&quot;}">bar</td> </tr> <tr height=21 style=\'height:16.0pt\'> <td height=21 class=xl65 style=\'height:16.0pt;overflow:hidden;padding-bottom: 2px;padding-top:2px\' data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;baz&quot;}">baz</td> <td class=xl65 style=\'overflow:hidden;padding-bottom:2px;padding-top:2px\' data-sheets-numberformat="{&quot;1&quot;:2,&quot;2&quot;:&quot;#,##0.00&quot;,&quot;3&quot;:1}"></td> </tr> <!--EndFragment--> </table> </body> </html>'
      )
    ).toEqual([
      ['foo', 'bar'],
      ['baz', ''],
    ])
  })

  test('special chars GoogleSheet', () => {
    expect(
      parseTextHtmlData(
        '<meta charset=\'utf-8\'><google-sheets-html-origin><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table xmlns="http://www.w3.org/1999/xhtml" cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px;border-collapse:collapse;border:none"><colgroup><col width="86"/><col width="100"/></colgroup><tbody><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;&lt;foo&gt;&quot;}">&lt;foo&gt;</td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;bar\\nbaz&quot;}">bar<br/>baz</td></tr><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;foo\\&quot;bar&quot;}">foo&quot;bar</td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;foo/bar&quot;}" data-sheets-numberformat="{&quot;1&quot;:2,&quot;2&quot;:&quot;#,##0.00&quot;,&quot;3&quot;:1}">foo/bar</td></tr></tbody></table>'
      )
    ).toEqual([
      ['<foo>', 'bar\nbaz'],
      ['foo"bar', 'foo/bar'],
    ])
  })

  test('special chars Excel', () => {
    expect(
      parseTextHtmlData(
        '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"> <head> <meta http-equiv=Content-Type content="text/html; charset=utf-8"> <meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 15"> <link id=Main-File rel=Main-File href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip.htm"> <link rel=File-List href="file:////Users/nick/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_filelist.xml"> <style> <!--table {mso-displayed-decimal-separator:"\\,"; mso-displayed-thousand-separator: ;} @page {margin:.75in .7in .75in .7in; mso-header-margin:.3in; mso-footer-margin:.3in;} tr {mso-height-source:auto;} col {mso-width-source:auto;} br {mso-data-placement:same-cell;} td {padding-top:1px; padding-right:1px; padding-left:1px; mso-ignore:padding; color:black; font-size:12.0pt; font-weight:400; font-style:normal; text-decoration:none; font-family:Calibri, sans-serif; mso-font-charset:0; mso-number-format:General; text-align:general; vertical-align:bottom; border:none; mso-background-source:auto; mso-pattern:auto; mso-protection:locked visible; white-space:nowrap; mso-rotate:0;} .xl65 {font-size:10.0pt; font-family:Arial, sans-serif; mso-font-charset:0;} .xl66 {font-size:10.0pt; font-family:Arial, sans-serif; mso-font-charset:0; white-space:normal;} --> </style> </head> <body link="#0563C1" vlink="#954F72"> <meta charset=utf-8> <table border=0 cellpadding=0 cellspacing=0 width=174 style=\'border-collapse: collapse;width:130pt\' xmlns="http://www.w3.org/1999/xhtml"> <!--StartFragment--> <col width=87 span=2 style=\'width:65pt\'> <tr height=39 style=\'height:29.0pt\'> <td height=39 class=xl65 width=87 style=\'height:29.0pt;width:65pt;overflow: hidden;padding-bottom:2px;padding-top:2px\' data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;&lt;foo&gt;&quot;}">&lt;foo&gt;</td> <td class=xl66 width=87 style=\'width:65pt;overflow:hidden;padding-bottom: 2px;padding-top:2px\' data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;bar\\nbaz&quot;}">bar<br>baz</td> </tr> <tr height=21 style=\'height:16.0pt\'> <td height=21 class=xl65 style=\'height:16.0pt;overflow:hidden;padding-bottom: 2px;padding-top:2px\' data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;foo\\&quot;bar&quot;}">foo&quot;bar</td> <td class=xl65 style=\'overflow:hidden;padding-bottom:2px;padding-top:2px\' data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;foo/bar&quot;}" data-sheets-numberformat="{&quot;1&quot;:2,&quot;2&quot;:&quot;#,##0.00&quot;,&quot;3&quot;:1}">foo/bar</td> </tr> <!--EndFragment--> </table> </body> </html>'
      )
    ).toEqual([
      ['<foo>', 'bar\nbaz'],
      ['foo"bar', 'foo/bar'],
    ])
  })
})

describe('parsePlainTextData', () => {
  test('single cell', () => {
    expect(parseTextPlainData('')).toEqual([['']])
    expect(parseTextPlainData('foo')).toEqual([['foo']])
  })

  test('single row', () => {
    expect(parseTextPlainData('\t\t')).toEqual([['', '', '']])
    expect(parseTextPlainData('foo\tbar\tbaz')).toEqual([['foo', 'bar', 'baz']])
  })

  test('single column', () => {
    expect(parseTextPlainData('\n\n')).toEqual([[''], ['']])
    expect(parseTextPlainData('foo\nbar\nbaz')).toEqual([
      ['foo'],
      ['bar'],
      ['baz'],
    ])
  })

  test('multiple rows and columns', () => {
    expect(parseTextPlainData('\t\n\t\n\t')).toEqual([
      ['', ''],
      ['', ''],
      ['', ''],
    ])
    expect(parseTextPlainData('a\tb\tc\nd\te\tf')).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ])
  })

  test('ignore last line return', () => {
    expect(parseTextPlainData('\t\n\t\n\t\n')).toEqual([
      ['', ''],
      ['', ''],
      ['', ''],
    ])
    expect(parseTextPlainData('a\tb\tc\nd\te\tf\n')).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ])
  })

  test('single cell multi line', () => {
    expect(parseTextPlainData('"foo\nbar""baz"""')).toEqual([['foo\nbar"baz"']])
  })

  test('quoted first cell', () => {
    expect(parseTextPlainData('"foo\nbar')).toEqual([['"foo'], ['bar']])
  })

  test('non-quoted cell', () => {
    expect(parseTextPlainData('"foo"bar')).toEqual([['"foo"bar']])
  })

  test('two quoted cells', () => {
    expect(parseTextPlainData('"foo\tbar"')).toEqual([['"foo', 'bar"']])
    expect(parseTextPlainData('"foo"\t"bar"')).toEqual([['"foo"', '"bar"']])
  })
})

test('encodeHtml', () => {
  expect(encodeHtml('<div title="foo\'bar">baz</div>')).toBe(
    '&lt;div title=&quot;foo&#039;bar&quot;&gt;baz&lt;/div&gt;'
  )
})
