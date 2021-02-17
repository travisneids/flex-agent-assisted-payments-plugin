import React from 'react'
import { withTheme, Button } from '@twilio/flex-ui'
import PaymentElement from './PaymentElement'
import PaymentIcon from './PaymentIcon'
import PaymentFormHeading from './PaymentFormHeading'

const styles = {
  container: {
    display: 'flex',
  },
  payBtn: {
    marginTop: 10,
    height: 40,
    fontSize: 17,
    borderRadius: 7,
    border: 'none',
    background: '#64be94',
    color: 'white',
    boxShadow: '0px 3px 3px 0px rgb(134 134 134 / 25%)',
  },
}
class PaymentInProgress extends React.Component {
  render() {
    if (
      !(
        this.props.paymentState.Result === undefined || this.props.paymentState.Result !== 'success'
      )
    ) {
      return null
    }

    let currency = '$'
    if (currency === 'gbp') {
      currency = '£'
    }
    // TODO: add other currencies

    return (
      <>
        <div style={styles.container}>
          <PaymentIcon />
          <PaymentFormHeading text={`${currency} ${this.props.chargeAmount}`} />
        </div>
        <PaymentFormHeading text="Capture Credit Card Information" />
        <hr />
        <PaymentElement
          captureField={this.props.captureField}
          requestCapture={this.props.requestCapture}
          paymentState={this.props.paymentState}
          friendlyName="Payment Card Number"
          pascalCaseName="PaymentCardNumber"
          riverCaseName="payment-card-number"
        />
        <PaymentElement
          captureField={this.props.captureField}
          requestCapture={this.props.requestCapture}
          paymentState={this.props.paymentState}
          friendlyName="Expiration Date"
          pascalCaseName="ExpirationDate"
          riverCaseName="expiration-date"
        />
        <PaymentElement
          captureField={this.props.captureField}
          requestCapture={this.props.requestCapture}
          paymentState={this.props.paymentState}
          friendlyName="Security Code"
          pascalCaseName="SecurityCode"
          riverCaseName="security-code"
        />
        <>
          {this.props.paymentState.ErrorType !== undefined &&
            this.props.paymentState.ErrorType !== '' && (
              <div style={{ color: 'red', fontWeight: 'bold' }}>
                Error: {this.props.paymentState.ErrorType}
              </div>
            )}
          {this.props.paymentState.Required !== undefined && (
            <Button
              style={styles.payBtn}
              className="Twilio-TaskCanvasHeader-EndButton"
              disabled={this.props.paymentState.Required !== ''}
              type="button"
              onClick={() => this.props.processPayment()}
            >
              Process Payment
            </Button>
          )}
        </>
      </>
    )
  }
}

export default withTheme(PaymentInProgress)
