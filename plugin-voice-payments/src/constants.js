const packageName = 'plugin-voice-payments.js'

const pluginConfig = {
  agent: {
    location: 'panel2',
  },
}

const configForm = {
  title: 'Voice Payments Settings',
  type: 'object',
  properties: {
    agent: {
      $ref: '#/definitions/agent',
    },
  },
  definitions: {
    agent: {
      title: 'Agent',
      type: 'object',
      properties: {
        location: {
          type: 'string',
          title: 'Location',
          enum: ['panel2', 'panel3', 'taskCanvas'],
          enumNames: ['Primary Panel', 'Right-Side Panel', 'Task Canvas'],
          default: 'panel2',
        },
      },
    },
  },
}

const uiSchema = {}

export { packageName, pluginConfig, configForm, uiSchema }
