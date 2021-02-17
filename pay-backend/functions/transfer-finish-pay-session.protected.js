exports.handler = async function (context, event, callback) {
  const helpers = loadServerlessModules(context, event)

  helpers.logger.debug('starting finish transfer pay...', JSON.stringify(event))
  const client = helpers.twilio.createClient(context)
  const twiml = generateVoiceTwiml(event, helpers)

  const listName = `aap:${event.CallSid}`

  try {
    let listItem = await helpers.sync.createListItem(
      client,
      context.SYNC_SERVICE_SID,
      listName,
      event,
    )
    helpers.logger.debug('inserted sync list item', listItem)
    helpers.logger.wait(() => {
      helpers.logger.debug('returning return to conference twiml', twiml.toString())
      callback(null, twiml)
    })
  } catch (err) {
    const response = helpers.twilio.defaultResponse()
    response.setBody(err)
    response.setStatusCode(500)
    callback(response)
  }
}

const generateVoiceTwiml = (event, helpers) => {
  let twiml = new Twilio.twiml.VoiceResponse()

  switch (event.Result) {
    case 'success':
      text = 'Thank you for your payment'
      helpers.logger.debug('successful payment')
      break
    case 'payment-connector-error':
      text = 'The Payment Gateway is reporting an error'
      helpers.logger.warning(decodeURIComponent(event.PaymentError))
      break

    default:
      text = 'The payment was not completed successfully'
      helpers.logger.warning('unsuccessful payment', event)
  }

  twiml.say(text)
  const dial = twiml.dial()
  dial.conference(
    {
      beep: true,
      endConferenceOnExit: true,
    },
    event.conferenceUniqueName,
  )
  return twiml
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
