import React from 'react'

const styles = {
  heading: {
    color: '#424242bf',
    fontWeight: 800,
    fontSize: 11,
    paddingBottom: 3,
  },
}

const PaymentFormLabel = ({ text }) => {
  return <h1 style={styles.heading}>{text}</h1>
}

export default PaymentFormLabel
