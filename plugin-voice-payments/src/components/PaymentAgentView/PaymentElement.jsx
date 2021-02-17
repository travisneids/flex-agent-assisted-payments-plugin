import React from 'react'
import { withTheme, Button } from '@twilio/flex-ui'
import PaymentFormLabel from './PaymentFormLabel'

const styles = {
  inputContainer: {
    padding: 15,
    borderRadius: 7,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  formInput: {
    height: 26,
    fontSize: 20,
    borderRadius: 7,
    border: '1px solid #bbb',
    paddingLeft: 10,
    boxShadow: '0px 3px 3px 0px rgb(134 134 134 / 25%)',
    color: '#424242bf',
  },
  formBtn: {
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
class PaymentElement extends React.Component {
  getStyle = () => {
    if (
      this.props.paymentState[this.props.pascalCaseName] !== undefined &&
      this.props.paymentState[this.props.pascalCaseName] !== ''
    ) {
      return {
        ...styles.inputContainer,
        backgroundColor: '#3bb78f',
        backgroundImage: 'linear-gradient(315deg, rgb(59, 183, 143) 0%, rgb(136 218 182) 74%)',
      }
    }
    if (this.props.captureField === this.props.riverCaseName) {
      return {
        ...styles.inputContainer,
        backgroundColor: '#fec84e',
        backgroundImage: 'linear-gradient(315deg, #fec84e 0%, #ffdea8 74%)',
      }
    } else {
      return {
        ...styles.inputContainer,
        backgroundColor: '#e7eff9',
        backgroundImage: 'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
      }
    }
  }

  render() {
    return (
      <div style={this.getStyle()}>
        <PaymentFormLabel text={this.props.friendlyName} />
        <input
          style={styles.formInput}
          ref={this.paymentAmountRef}
          value={this.props.paymentState[this.props.pascalCaseName]}
        />

        <Button
          style={styles.formBtn}
          className="Twilio-TaskCanvasHeader-EndButton"
          type="button"
          onClick={() => this.props.requestCapture(this.props.riverCaseName)}
        >
          Request {this.props.friendlyName}
        </Button>

        <div className="circle-loader">
          <div className="checkmark draw"></div>
        </div>
      </div>
    )
  }
}

export default withTheme(PaymentElement)
