const TokenValidator = require('twilio-flex-token-validator').functionValidator
exports.handler = TokenValidator(async function (context, event, callback) {
  const helpers = loadServerlessModules(context, event)
  const client = helpers.twilio.createClient(context)
  let response = helpers.twilio.defaultResponse()
  const statusCallback = `https://${context.DOMAIN_NAME}/aap-webhook-ingress`

  try {
    let success = await client
      .calls(event.CallSid)
      .payments(event.PaymentSid)
      .update({
        status: 'complete',
        idempotencyKey: event.IdempotencyKey,
        statusCallback,
      })
    helpers.logger.info('completed payment', success)
    response.setBody(success)
    helpers.logger.wait(() => {
      callback(null, response)
    })
  } catch (error) {
    helpers.logger.error(error)
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
