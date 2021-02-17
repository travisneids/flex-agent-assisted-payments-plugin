class SyncHelper {
  constructor(logger) {
    this.logger = logger
  }

  async createToken(context, identity) {
    const { ACCOUNT_SID, SYNC_SERVICE_SID, TWILIO_API_KEY, TWILIO_API_SECRET } = context

    const AccessToken = Twilio.jwt.AccessToken
    const SyncGrant = AccessToken.SyncGrant

    const syncGrant = new SyncGrant({
      serviceSid: SYNC_SERVICE_SID,
    })

    const accessToken = new AccessToken(ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET)

    accessToken.addGrant(syncGrant)
    accessToken.identity = identity
    return accessToken.toJwt()
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @returns {Promise}
   */
  async fetchDocument(twilioClient, serviceSid, uniqueName) {
    return twilioClient.sync.services(serviceSid).documents(uniqueName).fetch()
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @param {Object} data
   * @param {number} [3600] ttl - Time To Live
   * @returns {Promise}
   */
  async createDocument(twilioClient, serviceSid, uniqueName, data, ttl = 3600) {
    return twilioClient.sync.services(serviceSid).documents.create({
      data,
      ttl,
      uniqueName,
    })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @param {Object} data
   * @returns {Promise}
   */
  async updateDocument(twilioClient, serviceSid, uniqueName, data) {
    return twilioClient.sync.services(serviceSid).documents(uniqueName).update({
      data,
    })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @returns {Promise}
   */
  async fetchList(twilioClient, serviceSid, uniqueName) {
    return twilioClient.sync.services(serviceSid).syncLists(uniqueName).fetch()
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @param {number} [3600] ttl - Time To Live
   * @returns {Promise}
   */
  async createList(twilioClient, serviceSid, uniqueName, ttl = 3600) {
    return twilioClient.sync.services(serviceSid).syncLists.create({
      ttl,
      uniqueName,
    })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} uniqueName
   * @param {object} data
   * @returns {Promise}
   */
  async createListItem(twilioClient, serviceSid, uniqueName, data) {
    return twilioClient.sync.services(serviceSid).syncLists(uniqueName).syncListItems.create({
      data,
    })
  }
}

/** @module syncHelper */
module.exports = {
  SyncHelper,
}
