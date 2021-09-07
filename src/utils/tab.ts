export const getAllTabbableElements = () =>
  Array.from(document.querySelectorAll('*')).filter((element) => {
    return (
      element instanceof HTMLElement &&
      typeof element.tabIndex === 'number' &&
      element.tabIndex >= 0 &&
      !(element as HTMLInputElement).disabled &&
      (!(element instanceof HTMLAnchorElement) ||
        !!element.href ||
        element.getAttribute('tabIndex') !== null) &&
      getComputedStyle(element).visibility !== 'collapse'
    )
  }) as HTMLElement[]
