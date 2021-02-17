import React from 'react'
import { withTaskContext } from '@twilio/flex-ui'
import { paymentService, syncService } from '../../services'
import PaymentForm from './PaymentForm'
import PaymentInProgress from './PaymentInProgress'
import PaymentSuccess from './PaymentSuccess'
import PaymentLoading from './PaymentLoading'
import PaymentBackground from './PaymentBackground'

const styles = {
  componentContainer: {
    boxShadow: 'inset 20px -1px 20px rgb(134 134 134 / 25%)',
    minHeight: 450,
    overflow: 'auto',
    width: '100%',
    position: 'relative',
  },
  panel3Container: {
    boxShadow: 'inset 20px -1px 20px rgb(134 134 134 / 25%)',
    minHeight: 300,
    overflow: 'auto',
    height: '100%',
    width: 400,
    position: 'relative',
  },
  card: {
    position: 'relative',
    margin: 20,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 0px 20px 12px rgb(134 134 134 / 25%)',
  },
}

// It is recommended to keep components stateless and use redux for managing states
class PaymentAgentView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      paymentSid: null,
      aapStatus: [],
      captureField: undefined,
      paymentMethod: 'credit-card',
      paymentType: 'aap',
      showPaymentForm: false,
      initializingSync: false,
      paymentProcessing: false,
    }

    this.props.flex.Actions.addListener('afterDisplayPayment', (payload) => {
      console.log('showing payment form')
      const paymentState = this._latestPaymentState()
      if (this.state.showPaymentForm) {
        this.setState({ showPaymentForm: false })
      } else if (!paymentState) {
        this.setState({ showPaymentForm: true })
      } else if (paymentState && paymentState.Result !== 'success') {
        this.setState({ showPaymentForm: true })
      } else if (paymentState && paymentState.Result === 'success') {
        // resetting to new payment
        this.setState({ ...this._getDefaultState(), showPaymentForm: true })
      } else {
        this.setState({ ...this._getDefaultState() })
      }
    })
  }

  componentDidMount() {
    this.props.flex.Actions.addListener('afterAcceptTask', (payload) => {
      //props.resetPay();
      this.setState({ ...this._getDefaultState() })
    })

    this.props.flex.Actions.addListener('afterCompleteTask', (payload) => {
      this.setState({ ...this._getDefaultState() })
    })
  }

  _getDefaultState = () => {
    return {
      paymentSid: null,
      aapStatus: [],
      captureField: undefined,
      paymentMethod: 'credit-card',
      showPaymentForm: false,
    }
  }

  _getCallSid = () => {
    if (this.props.task.attributes.direction === 'outbound') {
      return this.props.task.conference.participants[1].callSid
    }
    return this.props.task.attributes.conference.participants.customer
  }

  _getShowPaymentForm = () => {
    // depending on location, show/hide form vs being always on task info tab
    return this.props.taskInfo || this.state.showPaymentForm
  }

  _addEventToState = (newItem) => {
    const aapStatus = [...this.state.aapStatus, newItem]
    if (newItem && newItem.Result === 'success') {
      console.log('setting payment to completed processing')
      this.setState({ paymentProcessing: false })
    }
    this.setState({ aapStatus })
  }

  _setupSync = async () => {
    const callSid = this._getCallSid()
    const syncList = await syncService.subscribeToSync(callSid)
    if (syncList) {
      const currentEvents = await syncService.getListItems(syncList)
      this.setState({ aapStatus: [...currentEvents] })
      console.log('fetched current events')
      syncList.on('itemAdded', (event) => {
        console.log('Received itemAdded event: ', event)
        this._addEventToState(event.item.data.value)
      })
      this.setState({ initializingSync: false })
    } else {
      //TODO how to handle sync error ui/retry
      this.setState({ initializingSync: false })
    }
  }

  _startAap = async (currency, chargeAmount, paymentMethod, description) => {
    const callSid = this._getCallSid()
    const paymentSid = await paymentService.startAgentAssistPayment(
      callSid,
      currency,
      chargeAmount,
      paymentMethod,
      description,
    )
    console.log('request card number', paymentSid)
    const firstCapture = await this.requestCapture('payment-card-number', paymentSid)
    console.log('first capture started', firstCapture)
    this.setState({
      paymentSid,
    })
  }

  _startTransfer = async (currency, chargeAmount) => {
    this.setState({ paymentProcessing: true })
    const callSid = this._getCallSid()
    //transfer to ivr
    let conference = this.props.task.conference
    let conferenceUniqueName = conference.sid
    let conferenceSid = conference.conferenceSid
    const transferResult = await paymentService.transferPayment(
      conferenceSid,
      conferenceUniqueName,
      callSid,
      chargeAmount,
      currency,
    )
    console.log('transfer result', transferResult)
  }

  _latestPaymentState = () => {
    if (this.state.aapStatus.length === 0) return null
    return this.state.aapStatus[this.state.aapStatus.length - 1]
  }

  initiatePayment = async (currency, chargeAmount, paymentMethod, description, paymentType) => {
    console.log(this.props.task.attributes)

    this.setState({
      ChargeAmount: chargeAmount,
      Currency: currency,
      aapStatus: [{ step: 'initiating' }],
      paymentType,
      initializingSync: true,
    })

    console.log(`Initiating Payment of type ${paymentType}`)
    this._setupSync()

    if (paymentType === 'aap') {
      this._startAap(currency, chargeAmount, paymentMethod, description)
    } else if (paymentType === 'ivr') {
      this._startTransfer(currency, chargeAmount)
    } else {
      console.error('invalid payment type')
    }
  }

  requestCapture = async (requestCaptureField, paymentSid) => {
    const callSid = this._getCallSid()
    if (!paymentSid) paymentSid = this.state.paymentSid
    const captureField = await paymentService.requestFieldCapture(
      callSid,
      paymentSid,
      requestCaptureField,
    )

    this.setState({ captureField })
  }

  processPayment = async () => {
    this.setState({ paymentProcessing: true })
    const callSid = this._getCallSid()
    try {
      const result = await paymentService.processPayment(callSid, this.state.paymentSid)
      console.log('processed payment result', result)
      this.props.flex.Actions.invokeAction('CompletePayment', { result, task: this.props.task })
    } catch (err) {
      // TODO how to handle process failure ui
      this.setState({ paymentProcessing: false })
    }
  }

  render() {
    const showPaymentForm = this._getShowPaymentForm()

    if (!showPaymentForm) {
      return null
    }

    const paymentState = this._latestPaymentState()

    let pageContent
    if (this.state.initializingSync || this.state.paymentProcessing) {
      if (this.state.paymentType === 'ivr') {
        pageContent = <PaymentLoading helpText="Awaiting customer to complete payment" />
      } else {
        pageContent = <PaymentLoading />
      }
    } else if (showPaymentForm && !paymentState) {
      pageContent = (
        <PaymentForm initiatePayment={this.initiatePayment} paymentState={paymentState} />
      )
    } else if (
      paymentState &&
      paymentState.Result !== 'success' &&
      this.state.paymentMethod === 'credit-card'
    ) {
      pageContent = (
        <PaymentInProgress
          captureField={this.state.captureField}
          paymentState={paymentState}
          requestCapture={this.requestCapture}
          processPayment={this.processPayment}
          chargeAmount={this.state.ChargeAmount}
          currency={this.state.Currency}
        />
      )
    } else if (paymentState && paymentState.Result === 'success') {
      pageContent = (
        <PaymentSuccess
          chargeAmount={this.state.ChargeAmount}
          currency={this.state.Currency}
          confirmation={paymentState.PaymentConfirmationCode}
        />
      )
    }

    return (
      <div style={this.props.inPanel3 ? styles.panel3Container : styles.componentContainer}>
        <PaymentBackground />
        <div style={styles.card}>{pageContent}</div>
      </div>
    )
  }
}

export default withTaskContext(PaymentAgentView)
