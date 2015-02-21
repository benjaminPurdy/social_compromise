var AppDispatcher = require('../dispatcher/AppDispatcher'),
    AppConstants = require('../constants/AppConstants'),
    assign = require('object-assign'),
    apps = __APPS__,
    AppStore;

AppStore = assign({}, {
   getApps: function() {
     return apps;
   }
});

function persistOrder(order) {
  var appIdsInNewOrder, i,
      app,
      count = apps.length;

  if (!order) {return;}

  appIdsInNewOrder = [];

  for(i=0;i<count;i++) {
    app = apps[order[i]];
    if (!app) {continue;}
    appIdsInNewOrder.push(app.id);
  }

  jQuery.ajax('/application_metadata/update_order', {

    type: "POST",

    data: {
      ordered_apps: appIdsInNewOrder
    },

    headers: {
      'X-CSRF-Token': jQuery('[name="csrf-token"]').attr('content')
    }

  });

}

function persistAppExpansion(app) {
  jQuery.ajax('/application_metadata/' + app.id, {

      type: "POST",

      data: {
          metadata: {
              is_big: !!app.metadata.is_big
          }
      },

      headers: {
          'X-CSRF-Token': jQuery('[name="csrf-token"]').attr('content')
      }

  });
}

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {

    case AppConstants.APP_DRAGGED :
      persistOrder(action.order);
      break;

    case AppConstants.APP_EXPANSION_TOGGLED:
      persistAppExpansion(action.app);
      break;

  }

  return true;
});

module.exports = AppStore;