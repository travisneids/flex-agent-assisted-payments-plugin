'use strict'
const functions = Runtime.getFunctions() //eslint-disable-line no-undef

class Helpers {
  constructor(context, event) {
    /*
     * Load Logger Helper Methods
     */
    const loggerPath = functions['helpers/logger'].path
    const loggerLib = require(loggerPath).LoggerLib
    this.logger = new loggerLib(context, event)

    /*
     * Load Sync Service Helper Methods
     */
    const syncPath = functions['helpers/sync'].path
    const syncLib = require(syncPath).SyncHelper
    this.sync = new syncLib(this.logger)

    /*
     * Load Twilio Helper Methods
     */
    const twilioPath = functions['helpers/twilio'].path
    const twilioLib = require(twilioPath).TwilioHelper
    this.twilio = new twilioLib(this.logger)
  }
}

/** @module helpers */
module.exports = {
  Helpers,
}
