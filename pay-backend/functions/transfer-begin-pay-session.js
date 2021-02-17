/*
 * Begins a pay session by transferring the customer leg out of the conference and into a pay session
 * Update customer conference participant to not end on exit
 * Update customer call to twiml pay
 */

const axios = require('axios')
const FormData = require('form-data')

const TokenValidator = require('twilio-flex-token-validator').functionValidator
exports.handler = TokenValidator(async function (context, event, callback) {
  const helpers = loadServerlessModules(context, event)

  helpers.logger.debug('starting transfer pay...', JSON.stringify(event))
  const client = helpers.twilio.createClient(context)
  const response = helpers.twilio.defaultResponse()

  const updatedCustomerParticipant = await updateCustomerConferenceParticipant(
    client,
    event,
    helpers,
  )
  helpers.logger.debug('customer end conference set', updatedCustomerParticipant)

  const twiml = generateVoiceTwiml(context, event, helpers)
  helpers.logger.info('new twiml', twiml)

  updateCustomerCallLegToPay(context, twiml.toString(), event.participantCallSid)
    .then(function (resp) {
      helpers.logger.info('updated call to pay', resp)
      response.setBody(resp)
      response.setStatusCode(200)
      callback(null, response)
    })
    .catch(function (response) {
      //handle error
      helpers.logger.error('error updating call with twiml', response)
      callback(response)
    })
})

const updateCustomerConferenceParticipant = async (client, event, helpers) => {
  const { conferenceSid, participantCallSid, conferenceUniqueName } = event

  helpers.logger.info('conference info', conferenceSid)
  helpers.logger.info('customer call sid', participantCallSid)
  helpers.logger.info('conferenceUniqueName', conferenceUniqueName)
  return client
    .conferences(conferenceSid)
    .participants(participantCallSid)
    .update({ endConferenceOnExit: false })
}

const generateVoiceTwiml = (context, event, helpers) => {
  const twiml = new Twilio.twiml.VoiceResponse()
  const { conferenceUniqueName, paymentMethod, currency, amount } = event
  const action = `https://${context.DOMAIN_NAME}/transfer-finish-pay-session?conferenceUniqueName=${conferenceUniqueName}`
  helpers.logger.debug('action url', action)
  twiml.say(`Your amount due is ${amount}. Payment processing will begin now.`)
  twiml.pay({
    chargeAmount: amount,
    paymentConnector: context.PAYMENT_CONNECTOR,
    action,
    paymentMethod,
    currency,
  })

  return twiml
}

const updateCustomerCallLegToPay = (context, twiml, participantCallSid) => {
  const data = new FormData()
  data.append('Twiml', twiml)

  return axios({
    method: 'post',
    url: `https://api.twilio.com/2010-04-01/Accounts/${context.ACCOUNT_SID}/Calls/${participantCallSid}.json`,
    data,
    headers: { ...data.getHeaders() },
    auth: {
      username: context.ACCOUNT_SID,
      password: context.AUTH_TOKEN,
    },
  })
}

/**
 * Twilio calls this method
 * @returns {Object} all helpers available
 */
const loadServerlessModules = (context, event) => {
  const functions = Runtime.getFunctions() //eslint-disable-line no-undef
  const serverlessHelperPath = functions['helpers/index'].path
  const serverlessHelper = require(serverlessHelperPath).Helpers
  return new serverlessHelper(context, event)
}
