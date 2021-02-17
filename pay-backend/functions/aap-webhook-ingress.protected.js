exports.handler = async function (context, event, callback) {
  const helpers = loadServerlessModules(context, event)
  const client = helpers.twilio.createClient(context)
  let response = helpers.twilio.defaultResponse()
  const listName = `aap:${event.CallSid}`
  helpers.logger.debug('aap webhook starting', event)

  try {
    let listItem = await helpers.sync.createListItem(
      client,
      context.SYNC_SERVICE_SID,
      listName,
      event,
    )

    helpers.logger.info('saved sync list item', listItem)
    response.setBody(listItem)
    helpers.logger.wait(() => {
      callback(null, response)
    })
  } catch (error) {
    helpers.logger.log(error)
    response.setBody(error)
    helpers.logger.wait(() => {
      callback(response)
    })
  }
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
