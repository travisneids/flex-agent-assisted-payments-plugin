const TokenValidator = require('twilio-flex-token-validator').functionValidator

exports.handler = TokenValidator(async function (context, event, callback) {
  const helpers = loadServerlessModules(context, event)

  helpers.logger.debug('creating payment sync token...', JSON.stringify(event))

  const response = helpers.twilio.defaultResponse()
  try {
    const token = await helpers.sync.createToken(context, event.identity)

    response.setBody({ token })
    helpers.logger.wait(() => {
      callback(null, response)
    })
  } catch (err) {
    helpers.logger.error('could not get sync token', err)
    response.setBody(err)
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
