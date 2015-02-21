var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    assign = require('object-assign'),
    keyMirror = require('keymirror'),
    constants = require('../constants/LayoutChangeConstants'),
    EVENTS = keyMirror({
      LAYOUT_CHANGE: null
    }),
    EventMethods = {},
    LayoutConstants = require('../constants/LayoutRenderingConstants'),
    LayoutSolverFactory = require('../lib/BlockLayoutSolver'),
    LayoutSolver = LayoutSolverFactory({
      targetColumnWidth: LayoutConstants.TARGET_COLUMN_WIDTH,
      minColumnCount: LayoutConstants.MIN_COLUMN_COUNT,
      maxColumnCount: LayoutConstants.MAX_COLUMN_COUNT,
      padding: LayoutConstants.PADDING_BETWEEN_TILES,
      tileDimensionRatio: LayoutConstants.TILE_DIMENSIONS_RATIO,
      bigTileHeightRatio: LayoutConstants.BIG_TILE_HEIGHT_RATIO,
      bigTileWidthRatio: LayoutConstants.BIG_TILE_WIDTH_RATIO
    }),
    AppStore = require('./AppStore'),
    apps = AppStore.getApps(),
    currentLayout = LayoutSolver(apps, 0),
    currentWidth,
    currentOrder,
    LayoutStore;

function camelCase(input) {
  var camelCased = input.toLowerCase().replace(/_(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });

  return camelCased.charAt(0).toUpperCase() + camelCased.substr(1);
}

function updateLayoutForWidth(width) {
  currentLayout = LayoutSolver(apps, width, currentOrder);
  currentWidth = width;
  LayoutStore.emitLayoutChange.call(LayoutStore);
}

function updateLayoutForIterationOrder(order) {
  currentOrder = order;
  currentLayout = LayoutSolver(apps, currentWidth, currentOrder);
  LayoutStore.emitLayoutChange.call(LayoutStore);
}

Object.keys(EVENTS).forEach(function(key) {
  var camelCasedKey = camelCase(key);

  EventMethods['add' + camelCasedKey + 'Listener'] = function(callback) {
    this.on(EVENTS[key], callback) ;
  };

  EventMethods['remove' + camelCasedKey + 'Listener'] = function(callback) {
    this.removeListener(EVENTS[key], callback) ;
  };

  EventMethods['emit' + camelCasedKey] = function(callback) {
    this.emit(EVENTS[key], callback) ;
  };

});

LayoutStore = assign({}, EventEmitter.prototype, EventMethods, {

  getLayout: function() {
    return currentLayout;
  },

  getWidth: function() {
    return currentWidth;
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {

    case constants.WIDTH_CHANGED :
      updateLayoutForWidth(action.newWidth);
      break;

    case constants.ITERATION_ORDER_CHANGED :
      updateLayoutForIterationOrder(action.newOrder);
      break;

  }

  return true;
});

module.exports = LayoutStore;






