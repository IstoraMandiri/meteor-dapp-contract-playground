Template.simpleStorageButton.onCreated(function () {
  // use a reactive variable to keep track of the value
  this.reactiveValue = new ReactiveVar()
  const getValue = () => {
    // call the contract
    this.reactiveValue.set(contracts.simpleStorage.get().toNumber())
  }
  // immediately envoke
  getValue()
  // start a timer
  this.interval = setInterval(() => {
    getValue()
  }, 1000)
})

Template.simpleStorageButton.onDestroyed(function () {
  // clean up when template is not rendered
  clearInterval(this.interval)
})

Template.simpleStorageButton.helpers({
  value () {
    return Template.instance().reactiveValue.get()
  }
})

Template.simpleStorageButton.events({
  'click .btn' () {
    // send a transaction using lightWallet for simplicity
    lightWallet.methods.sendTransaction({
      abi: contracts.simpleStorage.abi,
      to: contracts.simpleStorage.address,
      method: 'set',
      hideValue: true
    })
  }
})
