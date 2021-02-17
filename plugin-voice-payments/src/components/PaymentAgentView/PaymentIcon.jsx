import React from 'react'

const styles = {
  pay: {
    backgroundImage: `url("${process.env.REACT_APP_SERVERLESS_URL}/product-icon-pay.png")`,
    height: 35,
    width: 35,
    marginBottom: 20,
    marginRight: 20,
    backgroundSize: 'contain',
  },
}

const PaymentIcon = () => {
  return <div style={styles.pay}></div>
}

export default PaymentIcon
