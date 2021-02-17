import React from 'react'
import { withTheme } from '@twilio/flex-ui'
import { CircularProgress } from '@material-ui/core'
const style = {
  margin: 'auto',
}

class PaymentLoading extends React.Component {
  render() {
    return (
      <React.Fragment>
        {' '}
        <CircularProgress style={style} />
        {this.props.helpText ? <div style={style}>{this.props.helpText}</div> : null}
      </React.Fragment>
    )
  }
}

export default withTheme(PaymentLoading)
