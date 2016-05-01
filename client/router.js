/* globals BlazeLayout, FlowRouter */

BlazeLayout.setRoot('body')

FlowRouter.route('/', {
  name: 'landing',
  action: function () {
    BlazeLayout.render('mainLayout', {main: 'landing'})
  }
})

FlowRouter.route('/accounts', {
  name: 'accounts',
  action: function () {
    BlazeLayout.render('mainLayout', {main: 'accounts'})
  }
})
