var AppDispatcher = require('../dispatcher/AppDispatcher'),
    LayoutChangeConstants = require('../constants/LayoutChangeConstants');

module.exports = {

  updateLayoutWidth: function(newWidth) {
    AppDispatcher.handleViewAction({
      actionType: LayoutChangeConstants.WIDTH_CHANGED,
      newWidth: newWidth
    });
  },

  updateLayoutIterationOrder: function(newOrder) {
    AppDispatcher.handleViewAction({
      actionType: LayoutChangeConstants.ITERATION_ORDER_CHANGED,
      newOrder: newOrder
    });
  }

}
