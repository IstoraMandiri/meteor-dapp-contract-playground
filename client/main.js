// init and export light wallet accounts
import Web3, { lightWallet } from 'meteor/digix:light-wallet-ui-materialize'
window.web3 = Web3('http://localhost:8545/')
window.lightWallet = lightWallet

// deploy contracts
import ensureDeployed from './imports/deployer.js'

// wait a second to to allow accounts to initialize; todo make this async
setTimeout(function () {
  ensureDeployed({
    'myToken': {
      contract: window.Standard_Token,
      params: [ 1337 ]
    },
    'myOtherToken': {
      contract: window.Standard_Token,
      params: [ 123123 ]
    },
    'simpleStorage': {
      contract: window.SimpleStorage
    }
  })
}, 1000)
