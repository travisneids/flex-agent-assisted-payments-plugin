import React from 'react'
import { Button } from '@material-ui/core'
import PaymentIcon from './PaymentIcon'
import PaymentFormHeading from './PaymentFormHeading'
import PaymentFormLabel from './PaymentFormLabel'

const paymentCurrencyOptions = [
  {
    label: 'USD ($)',
    value: 'usd',
  },
  {
    label: 'GBP (£)',
    value: 'gbp',
  },
]

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    paddingLeft: 0,
  },
  formBtn: {
    marginTop: 10,
    minHeight: 40,
    fontSize: 17,
    borderRadius: 7,
    border: 'none',
    background: '#64be94',
    color: 'white',
    boxShadow: '0px 3px 3px 0px rgb(134 134 134 / 25%)',
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
  formSelect: {
    height: 30,
    fontSize: 20,
    borderRadius: 7,
    border: '1px solid #bbb',
    paddingLeft: 10,
    boxShadow: '0px 3px 3px 0px rgb(134 134 134 / 25%)',
    color: '#424242bf',
  },
}

class PaymentForm extends React.Component {
  constructor(props) {
    super(props)

    this.paymentAmountRef = React.createRef()
    this.paymentCurrencyRef = React.createRef()
    this.paymentDescriptionRef = React.createRef()
  }

  initiatePayment = (paymentType) => {
    //TODO: how to support tokenized payments?
    this.props.initiatePayment(
      this.paymentCurrencyRef.current.value,
      this.paymentAmountRef.current.value,
      'credit-card',
      this.paymentDescriptionRef.current.value,
      paymentType,
    )
  }

  render() {
    return (
      <React.Fragment>
        <PaymentIcon />
        <PaymentFormHeading text="Checkout with Twilio Pay" />

        <div style={styles.form}>
          <div style={styles.formRow}>
            <PaymentFormLabel text="Currency" />
            <select style={styles.formSelect} ref={this.paymentCurrencyRef}>
              {paymentCurrencyOptions.map((opt) => (
                <option value={opt.value} key={'currOpt-' + opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div style={styles.formRow}>
            <PaymentFormLabel text="Charge Amount" />
            <input ref={this.paymentAmountRef} style={styles.formInput} defaultValue="10.00" />
          </div>
          <br />
          <div style={styles.formRow}>
            <PaymentFormLabel text="Charge Description" />
            <input
              ref={this.paymentDescriptionRef}
              style={styles.formInput}
              placeholder="Description"
            />
          </div>
        </div>
        <br></br>
        <Button style={styles.formBtn} onClick={() => this.initiatePayment('aap')}>
          Request payment via Agent-Assisted
        </Button>
        <Button style={styles.formBtn} onClick={() => this.initiatePayment('ivr')}>
          Request payment via Secure IVR
        </Button>
      </React.Fragment>
    )
  }
}

export default PaymentForm
