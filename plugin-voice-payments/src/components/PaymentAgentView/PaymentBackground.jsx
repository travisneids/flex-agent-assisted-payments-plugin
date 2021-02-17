import React from 'react'

const styles = {
  hero: {
    position: 'absolute',
    height: 500,
    width: '140%',
    transform: 'rotate(-12deg)',
    top: -240,
    left: -110,
    zIndex: 0,
    background: `
    -webkit-radial-gradient( 5% 5%, ellipse, #f32f46 0%, rgba(240, 172, 173, 0) 75%),
    -webkit-radial-gradient(95% 5%, ellipse, #0263e0 0%, rgba( 248, 174, 75, 0) 75%),
    -webkit-radial-gradient(95% 95%, ellipse, #36d576 -15%, rgba( 219, 176, 72, 0) 75%),
    -webkit-radial-gradient(5% 95%, ellipse, #8c5bd8 50%, rgba( 194, 132, 233, 0) 75%)`,
  },
}

const PaymentHeroBackground = () => {
  return <div style={styles.hero}></div>
}

export default PaymentHeroBackground
