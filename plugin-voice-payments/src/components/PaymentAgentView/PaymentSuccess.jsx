import React from 'react'
import PaymentFormHeading from './PaymentFormHeading'

const styles = {
  divider: {
    border: 'solid 1px #bbb',
    width: '50%',
    marginTop: 15,
    marginBottom: 15,
  },
  checkmark: {
    backgroundImage: `url("${process.env.REACT_APP_SERVERLESS_URL}/Flat_tick_icon.png")`,
    height: 50,
    width: 50,
    margin: '0 auto',
    marginBottom: 30,
    backgroundSize: 'contain',
  },
  text: {
    textAlign: 'center',
  },
}
export default class PaymentSuccess extends React.Component {
  render() {
    let currency = '$'
    if (this.props.currency === 'gbp') {
      currency = '£'
    }

    return (
      <React.Fragment>
        <div style={styles.checkmark}></div>
        <PaymentFormHeading text="Payment Complete" />
        <hr style={styles.divider} />
        <p style={styles.text}>
          <strong>Amount:</strong> {currency} {this.props.chargeAmount}
        </p>
        <p style={styles.text}>
          <strong>Confirmation Code:</strong> {this.props.confirmation}
        </p>
      </React.Fragment>
    )
  }
}
