// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './commands'
import '@cypress/code-coverage/support'

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }

  return true
})
