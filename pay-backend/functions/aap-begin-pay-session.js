const TokenValidator = require('twilio-flex-token-validator').functionValidator
exports.handler = TokenValidator(async function (context, event, callback) {
  const helpers = loadServerlessModules(context, event)

  helpers.logger.debug('starting aap pay session...', JSON.stringify(event))

  const client = helpers.twilio.createClient(context)
  const response = helpers.twilio.defaultResponse()
  const statusCallback = `https://${context.DOMAIN_NAME}/aap-webhook-ingress`
  const listName = `aap:${event.CallSid}`

  try {
    let syncList
    try {
      syncList = await helpers.sync.createList(client, context.SYNC_SERVICE_SID, listName)
    } catch (err) {
      syncList = await helpers.sync.fetchList(client, context.SYNC_SERVICE_SID, listName)
    }
    helpers.logger.info('list created. Starting payment', syncList.sid)
    try {
      let success = await client.calls(event.CallSid).payments.create({
        chargeAmount: event.ChargeAmount,
        idempotencyKey: event.IdempotencyKey,
        paymentConnector: context.PAYMENT_CONNECTOR,
        postalCode: false,
        statusCallback,
        currency: event.Currency,
        validCardTypes: 'visa mastercard amex',
        paymentMethod: event.PaymentMethod,
        description: event.Description,
      })
      helpers.logger.debug('payment created', success)
      response.setBody(success)
      helpers.logger.wait(() => {
        callback(null, response)
      })
    } catch (error) {
      helpers.logger.error('unable to create payment', error)
      response.setBody(error)
      helpers.logger.wait(() => {
        callback(response)
      })
    }
  } catch (error) {
    helpers.logger.error('could not get sync list', error)
    response.setBody(error)
    helpers.logger.wait(() => {
      callback(response)
    })
  }
})

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
