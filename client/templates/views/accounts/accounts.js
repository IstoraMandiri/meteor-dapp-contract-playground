Template.accounts.helpers({
  walletConfig () {
    return {
      'tokens': [
        { name: 'Leet', address: contracts.myToken.address },
        { name: 'EDF', address: contracts.myOtherToken.address }
      ]
    }
  }
})
