import { Manager } from '@twilio/flex-ui'
import { SyncClient } from 'twilio-sync'
const runtimeUrl = process.env.REACT_APP_SERVERLESS_URL
const syncUrl = runtimeUrl + '/sync-token'

class SyncService {
  _getUserToken = () => {
    const manager = Manager.getInstance()
    return manager.user.token
  }

  _getUserIdentity = () => {
    const manager = Manager.getInstance()
    return manager.workerClient.attributes.email
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

  _fetchSyncToken = async function () {
    try {
      const options = this._createFetchOptions({
        Token: this._getUserToken(),
        identity: this._getUserIdentity(),
      })
      let token = await fetch(syncUrl, options)
      let json = await token.json()
      return json.token
    } catch (error) {
      console.log('Unexpected error fetching sync token', error)
    }
  }

  subscribeToSync = async function (callSid) {
    const token = await this._fetchSyncToken()
    console.log('Subscribing to Sync list for aap:' + callSid)
    try {
      const sync = new SyncClient(token)
      const list = await sync.list('aap:' + callSid)
      console.log('Successfully opened a List. SID: ' + list.sid)
      return list
    } catch (error) {
      console.log('Unexpected error', error)
    }
  }

  getListItems = async function (syncList) {
    try {
      const paginator = await syncList.getItems({ from: 0, order: 'asc' })
      // console.log(paginator)
      return paginator.items.map((item) => item.data.value)
    } catch (error) {
      console.error('List getItems() failed', error)
      return []
    }
  }
}

const syncService = new SyncService()
export default syncService
