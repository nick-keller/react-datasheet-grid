const parser = new DOMParser()

export const parseDom = (html: string): Document => {
  return parser.parseFromString(html, 'text/html')
}
