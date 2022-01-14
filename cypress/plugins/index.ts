/// <reference types="cypress" />
import injectDevServer from '@cypress/react/plugins/react-scripts'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import injectCoverage from '@cypress/code-coverage/task'

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  injectCoverage(on, config)

  if (config.testingType === 'component') {
    injectDevServer(on, config)
  }

  return config
}
export default pluginConfig
