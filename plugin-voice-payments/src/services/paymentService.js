import { Manager } from '@twilio/flex-ui'
const runtimeUrl = process.env.REACT_APP_SERVERLESS_URL
const startUrl = runtimeUrl + '/aap-begin-pay-session'
const captureUrl = runtimeUrl + '/aap-capture-parameter'
const completeUrl = runtimeUrl + '/aap-complete-pay-session'
const startTransferUrl = runtimeUrl + '/transfer-begin-pay-session'

class PaymentService {
  constructor() {
    this.idempotencyKey = 0
  }
  _getUserToken = () => {
    const manager = Manager.getInstance()
    return manager.user.token
  }

  _createFetchOptions = (body) => {
    return {
      method: 'POST',
      body: new URLSearchParams(body),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    }
  }

  _createDefaultBody = () => {
    return {
      Token: this._getUserToken(),
      IdempotencyKey: ++this.idempotencyKey,
    }
  }

  startAgentAssistPayment = async (callSid, currency, chargeAmount, paymentMethod, description) => {
    // Now post to Begin Session
    let body = {
      ...this._createDefaultBody(),
      CallSid: callSid,
      ChargeAmount: chargeAmount,
      Currency: currency,
      Description: description,
      PaymentMethod: paymentMethod,
    }
    console.table(body)

    let options = this._createFetchOptions(body)

    let success = await fetch(startUrl, options)

    console.log('Initiated AAP')
    let response = await success.json()
    console.log(response)
    return response.sid
  }

  requestFieldCapture = async (callSid, paymentSid, captureField) => {
    const body = {
      ...this._createDefaultBody(),
      CallSid: callSid,
      PaymentSid: paymentSid,
      Capture: captureField,
    }

    console.log('Requesting capture of field', body)

    const options = this._createFetchOptions(body)

    try {
      const success = await fetch(captureUrl, options)
      console.log('Requested capture field', success)
      return captureField
    } catch (err) {
      console.error('Failed to request element', err)
    }
  }

  processPayment = async (callSid, paymentSid) => {
    console.log('attempting to process payment via Pay Connector')

    const body = {
      ...this._createDefaultBody(),
      CallSid: callSid,
      PaymentSid: paymentSid,
      Status: 'complete',
    }

    const options = this._createFetchOptions(body)
    try {
      let success = await fetch(completeUrl, options)
      console.log('Payment completed successfully', success)
      return success
    } catch (err) {
      console.error('Failed to complete payment', err)
    }
  }

  transferPayment = async (
    conferenceSid,
    conferenceUniqueName,
    participantCallSid,
    amount,
    currency,
    paymentMethod,
  ) => {
    const body = {
      ...this._createDefaultBody(),
      conferenceSid,
      conferenceUniqueName,
      participantCallSid,
      amount,
      currency,
      paymentMethod,
    }
    const options = this._createFetchOptions(body)
    fetch(startTransferUrl, options).then((data) => {
      console.log('sent start pay', data)
    })
  }
}

const paymentService = new PaymentService()
export default paymentService
