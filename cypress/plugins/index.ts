/// <reference types="cypress" />
import injectDevServer from '@cypress/react/plugins/react-scripts'

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  if (config.testingType === 'component') {
    injectDevServer(on, config)
  }

  return config
}
export default pluginConfig
