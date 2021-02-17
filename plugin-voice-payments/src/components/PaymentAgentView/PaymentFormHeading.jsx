import React from 'react'

const styles = {
  heading: {
    fontSize: 25,
    color: '#333',
    textAlign: 'center',
  },
}

const PaymentFormHeading = ({ text }) => {
  return <h1 style={styles.heading}>{text}</h1>
}

export default PaymentFormHeading
