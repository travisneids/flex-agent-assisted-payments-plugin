import React from 'react'
import { VERSION } from '@twilio/flex-ui'
import { FlexPlugin } from 'flex-plugin'
import { addConfigActions, getDefaultConfig } from './helpers'
import { packageName } from './constants'
import PaymentAgentView from './components/PaymentAgentView/PaymentAgentView'
import PaymentButton from './components/PaymentAgentView/PaymentButton'

const PLUGIN_NAME = 'VoicePaymentsPlugin'

export default class VoicePaymentsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    addConfigActions(flex)

    let accountSid = manager.serviceConfiguration.account_sid
    accountSid = accountSid.slice(accountSid.length - 6)
    //enabled by default
    const enabledLsKey = packageName + '-' + accountSid
    const enabled = localStorage.getItem(enabledLsKey)
    if (!enabled) {
      localStorage.setItem(enabledLsKey, 'false')
    } else if (enabled === 'false') {
      console.log('not activating plugin', packageName)
      return
    }

    const config = getDefaultConfig(accountSid)
    this.registerReducers(manager)

    flex.Actions.registerAction('DisplayPayment', (payload) => {
      return payload
    })

    // invoking complete payment to let other plugins listen for event
    flex.Actions.registerAction('CompletePayment', (payload) => {
      return payload
    })

    const options = {
      sortOrder: -1,
    }
    //display locations - panel2, panel2right, taskinfo
    let displayLocation = config?.agent?.location
    if (displayLocation === 'panel2') {
      flex.AgentDesktopView.Panel2.Content.add(
        <PaymentAgentView key="payment-component" flex={flex} />,
        options,
      )
      flex.CallCanvasActions.Content.add(<PaymentButton key="payment-btn" flex={flex} />, options)
    } else if (displayLocation === 'taskinfo') {
      flex.TaskCanvasTabs.Content.add(
        <PaymentAgentView key="payment-tab-component" label="Payment" flex={flex} taskInfo />,
        {
          if: (props) =>
            props.task && props.task.taskChannelUniqueName && props.task.taskStatus === 'assigned',
        },
      )
    } else if (displayLocation === 'panel3') {
      flex.AgentDesktopView.Content.add(
        <PaymentAgentView key="payment-component" manager={manager} flex={flex} inPanel3 />,
        {
          sortOrder: 2,
        },
      )
      flex.CallCanvasActions.Content.add(<PaymentButton key="payment-btn" flex={flex} />, {
        sortOrder: -1,
        if: (props) => props.task && props.task.taskStatus === 'assigned',
      })
    }
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`,
      )
      return
    }

    //manager.store.addReducer(namespace, reducers);
  }
}
