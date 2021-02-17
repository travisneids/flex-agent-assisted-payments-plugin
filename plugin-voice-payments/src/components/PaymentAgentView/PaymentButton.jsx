import React from 'react'
import { withTaskContext, IconButton } from '@twilio/flex-ui'
import { PaymentOutlined as PaymentIcon } from '@material-ui/icons'

class PaymentButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { paymentActive: false }
  }

  startPayment = () => {
    this.setState({ paymentActive: true })
    this.props.flex.Actions.invokeAction('DisplayPayment')
  }

  render() {
    let disabled = this.props.task && this.props.task.taskStatus !== 'assigned'
    return (
      <IconButton
        icon={<PaymentIcon />}
        title={this.state.paymentActive && !disabled ? 'Payment' : 'Start Payment'}
        onClick={this.startPayment}
        disabled={disabled}
      />
    )
  }
}

export default withTaskContext(PaymentButton)
