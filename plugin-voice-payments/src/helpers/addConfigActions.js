import { packageName, pluginConfig, configForm, uiSchema } from '../constants'

const addConfigActions = (flex) => {
  flex.Actions.registerAction('FetchPluginConfig', (payload) => {
    return payload
  })
  flex.Actions.registerAction('FetchedPluginConfig', (payload) => {
    return payload
  })

  flex.Actions.addListener('beforeFetchPluginConfig', (payload) => {
    if (payload.name === packageName) {
      flex.Actions.invokeAction('FetchedPluginConfig', {
        name: packageName,
        configForm,
        uiSchema,
        defaultValues: pluginConfig,
      })
    }
  })
}

export default addConfigActions
