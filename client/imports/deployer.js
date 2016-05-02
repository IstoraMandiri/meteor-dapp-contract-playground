import async from 'async'
import { Session } from 'meteor/session'
import { EZModal } from 'meteor/hitchcott:ez-modal'
import { lightWallet } from 'meteor/digix:light-wallet-ui-materialize'

// deploy a contract and keep it's address persistent over refreshes
Session.set('ready', false)

// a quick 'n' dirty hash function
const hashCode = function (s) {
  return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

const stickyDeploy = function (obj, callback) {
  // just in case we need to redeploy
  let $modal
  // make key accessible
  Object.keys(obj).forEach((key) => {
    obj[key].key = key
  })
  // asyncronously deal with each contract instance
  async.mapSeries(obj, (obj, callback) => {
    // default empty parms if not set
    if (!obj.params) { obj.params = [] }
    // all contracts need to have their `eth` overriden due to `solc` compiler
    obj.contract.eth = web3.eth
    // check if we have previously deployed a contract with this name, params and bytecode hash
    // this let's hot code push on the contract override on changes
    const uniqueKey = hashCode(`${obj.key}_${obj.params.join(',')}_${obj.contract.bytecode}`)
    const storageKey = `stickyDeploy_${uniqueKey}`
    const existingAddrress = window.localStorage.getItem(storageKey)
    // define our deploy function, but don't call it yet...
    const deployContract = function () {
      // let user know this might take a while.
      if (!$modal) {
        $modal = EZModal('Deploying. Hold on a sec...')
      }
      // add the transaction object
      obj.params.push({
        from: lightWallet.accounts.defaultAccount().address,
        gas: 3000000,
        data: obj.contract.bytecode
      })
      // add the callback
      obj.params.push(function (err, contract) {
        if (err) { throw err }
        if (!contract.address) {
          // wait for the contract to be mined
          console.log('mining...', contract)
        } else {
          // save the address to localstorage for next time
          window.localStorage.setItem(storageKey, contract.address)
          // mining complete, callback the deployed contract
          callback(null, obj.contract.at(contract.address))
        }
      })
      // let's do it!
      obj.contract.new.apply(obj.contract, obj.params)
    }
    // check if we need to deploy
    if (existingAddrress) {
      // looks like we have deployed already, let's check if it's still there
      web3.eth.getCode(existingAddrress, function (err, code) {
        if (err) { throw err }
        // if the code isn't null...
        if (code && code !== '0x') {
          // we don't need to deploy, return this contract
          callback(null, obj.contract.at(existingAddrress))
        } else {
          // looks like it wasn't deployed, let's redo that.
          deployContract()
        }
      })
    } else {
      // no address in local storage, let's deploy it
      deployContract()
    }
  }, (err, contracts) => {
    if ($modal) { $modal.closeModal() }
    callback(err, contracts)
  })
}

const initialize = function (contracts) {
  // make sure we have an address that can deploy
  const defaultAccount = lightWallet.accounts.defaultAccount()
  if (defaultAccount && defaultAccount.balance() > 1e16) {
    // define some contracts that we want to make sure are deployed
    stickyDeploy(contracts, (err, contracts) => {
      if (!err) {
        window.contracts = contracts
        Session.set('ready', true)
      } else {
        EZModal(err)
        throw err
      }
    })
  } else {
    Session.set('ready', true)
    EZModal('Please create a light wallet account, send it some Eth, and then refresh to deploy contracts.')
  }
}

export default initialize
