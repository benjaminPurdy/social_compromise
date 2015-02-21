var React = require('react'),
    jQuery = require('jquery'),
    Tile = require('./Tile'),
    Modal = require('../../lib/Modal'),
    AppModalContent = require('./AppModalContent'),
    LayoutStore = require('../../stores/LayoutStore'),
    LayoutActions = require('../../actions/LayoutActions'),
    AppActions = require('../../actions/AppActions'),
    ScrollbarSizer = require('../../lib/scrollbarSizer'),
    LayoutConstants = require('../../constants/LayoutRenderingConstants');

module.exports = React.createClass({

    mixins: [Modal.CONSUMER_MIXIN],

    getInitialState: function() {
      return {
        width: 0,
        appForModal: null,
        modalShouldBeOpen: false,
        layout: LayoutStore.getLayout(),
        currentDragXY: {}
      }
    },

    getDefaultProps: function() {
      return {
        apps: __APPS__
      }
    },

    componentDidMount: function() {
      jQuery(window).on('resize', this.handleResize);
      LayoutStore.addLayoutChangeListener(this._layoutDidChange);
      this.updateLayoutForWindow();
    },

    componentWillUnmount: function() {
      jQuery(window).off('resize', this.handleResize);
      LayoutStore.removeLayoutChangeListener(this._layoutDidChange);
    },

    _layoutDidChange: function() {
      this.setState({layout: LayoutStore.getLayout()});
    },

    handleResize: function() {
      if (this._resizeTimer) {
        clearTimeout(this._resizeTimer);
      }
      this._resizeTimer = setTimeout(this.didStopResizing, 150);
    },

    didStopResizing: function() {
      this._resizeTimer = null;
      if (!this.isMounted) {return;}
      this.updateLayoutForWindow();
    },

    updateLayoutForWindow: function() {
      var width = jQuery(this.getDOMNode()).width() - ScrollbarSizer();
      if (width && !this.state.shouldAnimate) {
        setTimeout(this._hookAnimations, 800);
      }
      LayoutActions.updateLayoutWidth(width);
    },

    _hookAnimations: function() {
      this.setState({shouldAnimate: true});
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      if (nextState.appBeingDragged && nextState.currentDragXY &&
        this.state.currentDragXY.x && this.state.currentDragXY.y &&
        (nextState.currentDragXY.x !== this.state.currentDragXY.x ||
         nextState.currentDragXY.y !== this.state.currentDragXY.y
        )) {return false;}

      return true;
    },

    _lastUpdateDraggedTileParams: null,

    _updateLastUpdateDraggedTileParams: function(e) {
      this._lastUpdateDraggedTileParams = {
        time: new Date().getTime(),
        x: e.pageX,
        y: e.pageY
      };
    },

    // I'm throttled to 60hz
    updateDraggedTilePosition: function(e) {
        var state = this.state,
            dragStart = state.dragStartCoordinates,
            now = new Date().getTime(),
            lastCallParams = this._lastUpdateDraggedTileParams,
            velocity,
            dragProxyNode = jQuery(this.refs.dragProxy.getDOMNode());

      dragProxyNode.css({
        left: ((dragStart.nodeX + (e.pageX - dragStart.startX)) - 4) + 'px',
        top: ((dragStart.nodeY + (e.pageY - dragStart.startY)) - 4) + 'px'
      });

      if (!lastCallParams) {
        this._updateLastUpdateDraggedTileParams(e);
        return;
      }

      velocity = Math.sqrt(Math.pow(lastCallParams.x - e.pageX, 2) +
                           Math.pow(lastCallParams.y - e.pageY, 2)) / (now - lastCallParams.time);

      if (velocity > 0.05) {
        this._updateLastUpdateDraggedTileParams(e);
        return;
      }

      this.setState({
          currentDragXY: {
              x: dragStart.nodeX + (e.pageX - dragStart.startX),
              y: dragStart.nodeY + (e.pageY - dragStart.startY),
              active: e.pageX && e.pageY
          }
      }, this._scheduleDraggedTileInsertion);

      this._updateLastUpdateDraggedTileParams(e);
    },

   _scheduleDraggedTileInsertion: function() {
    setTimeout(this._insertDraggedTile, 0);
   },

   _insertDraggedTile: function() {
     var  state = this.state,
          tileWidth = LayoutConstants.TARGET_COLUMN_WIDTH / 2,
          tileHeight = tileWidth * LayoutConstants.TILE_DIMENSIONS_RATIO,
          halfTileWidth = tileWidth / 2,
          halfTileHeight = tileHeight + LayoutConstants.PADDING_BETWEEN_TILES,
          currentTileHeights = Math.max(Math.floor((state.currentDragXY.y) / halfTileHeight), 0), // Clamp to 0,
          iterationOrder;

     iterationOrder = state.layout.insert(state.appBeingDragged,
       Math.floor((state.currentDragXY.x  - state.layout.leftOfContainer + halfTileWidth) / tileWidth),
       currentTileHeights
     );

     LayoutActions.updateLayoutIterationOrder(iterationOrder);
   },

    _lastDragTileCall: new Date().getTime(),

    didDragTile: function(e) {
        var now = new Date().getTime(),
            state = this.state,
            distance;

      if (!state.appBeingDragged) {return; }
      if (now >= this._lastDragTileCall + LayoutConstants.ONE_SIXTIETH) {

            distance = Math.sqrt(
                Math.pow((state.dragStartCoordinates.startX - e.pageX), 2) +
                Math.pow((state.dragStartCoordinates.startY - e.pageY), 2)
            );

            if (isNaN(distance) || distance < 3) {return; }

            this.updateDraggedTilePosition(e);
            this._lastDragTileCall = now;
        }
    },

    tileExpansionToggled: function(app) {
      AppActions.appExpansionWasToggled(app);
      this.updateLayoutForWindow();
    },

    renderTileWithStyle: function(app, style) {
        var appIsOpenInModal = app === this.state.appForModal,
            appIsBeingDragged = app === this.state.appBeingDragged,
            shouldNotDraw = appIsOpenInModal || appIsBeingDragged;

        return (<Tile key={app.name+ "--" + app.id}
                      app={app}
                      style={style}
                      shouldDraw={!shouldNotDraw}
                      shouldAnimate={this.state.shouldAnimate}
                      onTileToggle={this.tileExpansionToggled}
                      onInfoClick={this.showModalForApp}
                      onMouseDown={this.mouseWentDownOnTile}
                      onMove={appIsOpenInModal ? this.modalAppMoved : null}
                      isSmallScreen={this.state.layout.isSmallScreen}
          />);
    },

    _mouseWentDownAt: null,

    mouseWentDownOnTile: function(e, app, styles) {
      this._mouseWentDownAt = new Date().getTime();

      this.setState({
        appBeingDragged: app,
        currentDragTargetStyles: styles,
        currentDragXY: {
          x: styles.left,
          y: styles.top
        },
        dragStartCoordinates: {
          nodeX: styles.left,
          nodeY: styles.top,
          startX: e.pageX,
          startY: e.pageY
        }
      });

      jQuery(document)
        .on('mouseup', this.mouseWentUp)
        .on('mouseleave', this.mouseWentUp)
        .on('mousemove', this.didDragTile)
        .on('selectstart', this._noopEvent);
    },

    _noopEvent: function(e) {
      e.preventDefault() && e.stopPropagation();
      return false;
    },

    mouseWentUp: function(e) {
      var self = this,
          now = new Date().getTime(),
          state = this.state,
          dragHappened = true,
          distance;

      e.preventDefault() && e.stopPropagation();

      jQuery(document)
        .off('mouseup', this.mouseWentUp)
        .off('mousemove', this.didDragTile)
        .off('mouseleave', this.mouseWentUp)
        .off('selectstart', this._noopEvent);

      distance = Math.sqrt(Math.pow((state.dragStartCoordinates.nodeX - state.currentDragXY.x), 2) +
                 Math.pow((state.dragStartCoordinates.nodeY - state.currentDragXY.y), 2));

      if (isNaN(distance) || distance < 13 && this._mouseWentDownAt && now <= this._mouseWentDownAt + 750) {
        this._mouseWentDownAt = null;
        window.open(this.state.appBeingDragged.url);
        dragHappened = false;
      }

      setTimeout(function() {
        self.setState.call(self, {
          appBeingDragged: null,
          currentDragXY: {},
          dragStartCoordinates: null
        });
      }, 2);

      if (dragHappened) {
        AppActions.appWasDragged(state.layout.iterationOrder);
      }

    },

    modalAppMoved: function(app, tileBoundingRect) {
      this.updateModalStartingPosition(
        this._extractModalDimensionsFromBounds(tileBoundingRect)
      );
    },

    _extractModalDimensionsFromBounds: function(bounds) {
      return {
        top: bounds.top,
        left: bounds.left,
        bottom: jQuery(window).height() - bounds.bottom,
        width: bounds.right - bounds.left
      }
    },

    showModalForApp: function(app, tileBoundingRect) {
      this.setState({
          appForModal: app
      }, function() {
          this.showModalStartingAt(
            this._extractModalDimensionsFromBounds(tileBoundingRect));
      });
    },

    modalDidTearDown: function() {
        this.setState({
            appForModal: null
        });
    },

    _getModalContent: function() {
      return (
        <AppModalContent app={this.state.appForModal} onClose={this.hideModal} />
      );
    },

    _getTilesUsingLayout: function(layout) {
        var apps = this.props.apps,
            i,
            nodes = [],
            currentApp,
            styles = layout.tileStyles,
            style;

        for (i=0;i<apps.length;i++){
            currentApp = apps[i];
            currentApp.__index__ = i;
            style = styles[currentApp.id];
            nodes.push(this.renderTileWithStyle(currentApp, style));
        }

        return nodes;
    },

    render: function() {
        var layout = this.state.layout,
            containerStyles = {
              height: layout.containerHeight + 'px'
            },
            state = this.state,
            proxyContentStyles,
            proxyContent,
            proxyStyles;

        if (this.state.appBeingDragged) {

            proxyContentStyles = {
                position: 'absolute',
                height: state.currentDragTargetStyles.height,
                width: state.currentDragTargetStyles.width,
                top: '3px',
                left: '2px'
            };

            proxyContent = <Tile app={this.state.appBeingDragged}
                                 style={proxyContentStyles}
                                 shouldDraw={true}
                                 shouldDrawImmediately={true}
                                 isSmallScreen={this.state.layout.isSmallScreen}/>

            proxyStyles = {
                position: 'absolute',
                height: (parseInt(state.currentDragTargetStyles.height) + 8) + 'px',
                width: (parseInt(state.currentDragTargetStyles.width) + 4) + 'px',
                left: (state.currentDragXY.x - 2) + 'px',
                top: (state.currentDragXY.y - 2) + 'px',
                zIndex: 1000000
            };

        } else {
            proxyStyles = {display: 'none'};
        }

        return (
            <div className="ss-tile-layout" style={containerStyles}>
              {this._getTilesUsingLayout(layout)}
                <div ref="dragImage">&nbsp;</div>
                <div ref="dragProxy" style={proxyStyles}>
                  <div className="shadow shadow-corner shadow-corner-tl"></div>
                  <div className="shadow shadow-corner shadow-corner-tr"></div>
                  <div className="shadow shadow-corner shadow-corner-bl"></div>
                  <div className="shadow shadow-corner shadow-corner-br"></div>
                  <div className="shadow shadow-edge shadow-edge-t"></div>
                  <div className="shadow shadow-edge shadow-edge-r"></div>
                  <div className="shadow shadow-edge shadow-edge-b"></div>
                  <div className="shadow shadow-edge shadow-edge-l"></div>
                  <div className="dragProxyContent"
                       style={proxyContentStyles}>{proxyContent}</div>
                </div>
            </div>
        );
    }

});