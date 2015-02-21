var AppDispatcher = require('../dispatcher/AppDispatcher'),
    AppConstants = require('../constants/AppConstants');

module.exports = {

  appWasDragged: function(order) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.APP_DRAGGED,
      order: order
    });
  },

  appExpansionWasToggled: function(app) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.APP_EXPANSION_TOGGLED,
      app: app
    });
  }

}