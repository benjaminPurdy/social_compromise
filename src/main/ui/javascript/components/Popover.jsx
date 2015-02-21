function getScrollBarWidth() {

  if (getScrollBarWidth.width) {
    return getScrollBarWidth.width;
  }

  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);

  document.body.appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild(outer);

  getScrollBarWidth.width = w1 - w2;
  return getScrollBarWidth.width;
}

require('popover.css');

var React = require('react/lib/React'),

  CONSUMER_MIXIN = {

    didClickOnMenu: function () {
      this.popover.toggle();
    },

    _getPopoverContainer: function () {
      var popoverContainer = this.popoverContainer;

      if (!popoverContainer) {
        this.popoverContainer = popoverContainer =
          document.body.appendChild(document.createElement('DIV'));
      }
      return popoverContainer;
    },

    componentDidMount: function () {
      this._getPopover();
    },

    componentWillUnmount: function () {
      var node;
      if (this.popover) {
        node = this._getPopoverContainer();
        React.unmountComponentAtNode(this.popover, node);
        this.popover = null;
        node.parentNode.removeChild(node);
        this.popoverContainer = null;
      }
    },

    _getPopover: function () {
      if (this.popover) {
        return this.popover;
      }
      this.popover = React.render(<Popover
        titleLabel={this._getPopoverLabel && this._getPopoverLabel()}
        targetComponent={this._getPopoverTargetComponent && this._getPopoverTargetComponent() || this}
        clickTarget={this._getClickTarget && this._getClickTarget() || this}
        classNames={this._getPopoverClassNames && this._getPopoverClassNames() || []}
        popoverContent={this._getPopoverContent && this._getPopoverContent() || <div>IMPLEMENT _getPopoverContent</div>}
     />, this._getPopoverContainer());
      return this.popover;
    }
  },

  //scrollBarWidth = getScrollBarWidth(),

  Popover = React.createClass({

    propTypes: {

      popoverContent: React.PropTypes.element,

      targetComponent: React.PropTypes.object.isRequired,

      clickTarget: React.PropTypes.object.isRequired,

      classNames: React.PropTypes.array

    },

    statics: {
      CONSUMER_MIXIN: CONSUMER_MIXIN
    },

    getInitialState: function () {
      return {
        visible: false,

        position: {
          top: 0,
          left: 0,
          arrowLeft: 0,
          maxContentHeight: 0
        }
      };
    },

    _getWindowWidth: function () {
      var width;
      if (!window.innerWidth) {
        if (!(document.documentElement.clientWidth === 0)) {
          width = document.documentElement.clientWidth;
        } else {
          width = document.body.clientWidth;
        }
      } else {
        width = window.innerWidth;
      }

      return width - getScrollBarWidth();
    },

    _getWindowHeight: function () {
      var height;
      var bottomPadding = 10;

      if (!(document.documentElement.clientHeight === 0)) {
        height = document.documentElement.clientHeight;
      } else {
        height = document.body.clientHeight;
      }
      return height - bottomPadding;
    },

    _getOuterWidthOrHeight: function (node, direction) {
      var prevDisplay = node.style.display,
        prevVisbility = node.style.visibility,
        val;

      node.style.visibility = 'hidden';
      node.style.display = '';

      val = node['offset' + direction];

      node.style.display = prevDisplay;
      node.style.visibility = prevVisbility;

      return val;
    },


    //Separate function so it can be stubbed for testing
    getTargetNode: function () {
      return this.props.targetComponent.getDOMNode();
    },

    calculatePosition: function () {
      var targetNode = this.getTargetNode(),

      // Horizontal positioning
        rootNode = this.getDOMNode(),
        popoverWidth = this._getOuterWidthOrHeight(rootNode, 'Width'),
        sidePadding = 5,
        maxLeft = this._getWindowWidth() - popoverWidth - sidePadding,
        minLeft = sidePadding,
        targetElementWidth = this._getOuterWidthOrHeight(targetNode, 'Width'),
        targetLeft = targetNode.getBoundingClientRect().left + targetElementWidth / 2,
        overflowOffset = targetLeft - popoverWidth / 2,
        popoverLeft = Math.max(Math.min(overflowOffset, maxLeft), minLeft),
        popoverTop = targetNode.getBoundingClientRect().top +
          this._getOuterWidthOrHeight(targetNode, 'Height') + 10,
        arrowLeft = targetLeft - popoverLeft,

      // Vertical sizing
        contentNode = this.refs.contents.getDOMNode(),
        windowHeight = this._getWindowHeight(),
        contentTop = contentNode.getBoundingClientRect().top,
        contentHeight = this._getOuterWidthOrHeight(contentNode, 'Height'),
        maxContentHeight = windowHeight - contentTop,
        firstContentChild = contentNode.children[0];

//            // Adjust if the list is scrolling
//				if (this._getOuterWidthOrHeight(firstContentChild, 'Height') > maxContentHeight) {
//					// There is a scrollbar
//				}

      return {
        top: popoverTop,
        left: popoverLeft,
        arrowLeft: arrowLeft,
        maxContentHeight: maxContentHeight
      };
    },

    isOpen: false,

    show: function () {
      this.setState({visible: true});
      this.positionPopover();
    },

    hide: function () {
      this.setState({visible: false});
    },

    toggle: function () {
      this[this.state.visible ? 'hide' : 'show']();
    },

    positionPopover: function () {
      this.setState({position: this.calculatePosition()})
    },

    resizeTimer: null,

    componentDidMount: function () {
      this.positionPopover();
    },

    componentWillUnmount: function() {
      this._handleEventListener('off');
    },

    componentDidUpdate: function (prevProps, prevState) {
      var action;

      if (this.state.visible && !prevState.visible) {
        action = 'on';
        this.positionPopover();
      }

      if (!this.state.visible && prevState.visible) {
        action = 'off';
      }

      if (action) {
        this._handleEventListener(action)
        //_$(window)[action]('resize', this.windowDidResize);
        //_$(document.body)[action]('click', this.didClickOnBody);
      }

    },

    _clone: function (obj) {
      var clone = {};

      for (var prop in obj) {
        clone[prop] = obj[prop];
      }

      return clone;
    },

    _fixEvent: function (event) {

      function returnTrue() {
        return true;
      }

      function returnFalse() {
        return false;
      }

      if (!event || !event.stopPropagation) {
        var old = event || window.event;


        event = this._clone(old);

        if (!event.target) {
          event.target = event.srcElement || document;
        }

        event.relatedTarget = event.fromElement === event.target ?
          event.toElement :
          event.fromElement;

        event.preventDefault = function () {
          event.returnValue = false;
          event.isDefaultPrevented = returnTrue;

        };

        event.isDefaultPrevented = returnFalse;

        event.stopPropagation = function () {
          event.cancelBubble = true;
          event.isPropagationStopped = returnTrue;
        };

        event.isPropagationStopped = returnFalse;

        event.stopImmediatePropagation = function () {
          this.isImmediatePropagationStopped = returnTrue;
          this.stopPropagation();
        };

        event.isImmediatePropagationStopped = returnFalse;

        if (event.clientX != null) {
          var doc = document.documentElement,
            body = document.body;

          event.pageX = event.clientX +
            ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
            ( doc && doc.clientLeft || body && body.clientLeft || 0 );
          event.pageY = event.clientY +
            ( doc && doc.scrollTop || body && body.scrollTop || 0 ) -
            ( doc && doc.clientTop || body && body.clientTop || 0 );
        }

        event.which = event.charCode || event.keyCode;

        if (event.button != null) {
          event.button = (event.button & 1 ? 0 :
            (event.button & 4 ? 1 :
              (event.button & 2 ? 2 : 0)));
        }
      }

      return event;
    },

    _handleEventListener: function (action) {

      var that = this,
        clickCallback = function () {
          that.didClickOnBody.apply(document.body)
        };

      if ('on' === action) {
        if (window.addEventListener) {
          window.addEventListener('resize', this.windowDidResize);
          document.body.addEventListener('click', this.didClickOnBody);
        } else if (window.attachEvent) {
          window.attachEvent('onresize', this.windowDidResize);
          document.body.attachEvent('onclick', clickCallback);
        }
      } else if ('off' === action) {
        if (window.removeEventListener) {
          window.removeEventListener('resize', this.windowDidResize);
          document.body.removeEventListener('resize', this.windowDidResize);
          document.body.removeEventListener('click', clickCallback);
        } else if (window.detachEvent) {
          window.detachEvent('onresize', this.windowDidResize);
          document.body.detachEvent('onclick', clickCallback);
        }
      }
    },

    _contains: function (a, b) {
      if (b) {
        while ((b = b.parentNode)) {
          if (b === a) {
            return true;
          }
        }
      }
      return false;
    },

    didClickOnBody: function (e) {
      e = this._fixEvent(e);
      var clickedInsidePopover = this._contains(this.getDOMNode(), e.target),
        clickedTarget = this._contains(this.props.clickTarget.getDOMNode(), e.target);

      if (!clickedInsidePopover && !clickedTarget) {
        this.hide();
      }
    },

    windowDidResize: function () {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }

      this.resizeTimer = setTimeout(this.positionPopover, 150);
    },


    render: function () {

      var position = this.state.position,

        rootClassNames = this.props.classNames.concat("pc-popover-container").join(" "),

        rootStyle = {
          display: this.state.visible ? 'block' : 'none',
          top: position.top,
          left: position.left
        },

        arrowStyle = {
          left: position.arrowLeft
        },

        contentStyle = {
          maxHeight: position.maxContentHeight
        },

        labelStyle = {
          display: this.props.titleLabel ? 'block' : 'none'
        };

      return (
        <div style={rootStyle} className={rootClassNames}>
          <div className="pc-popover-underlay"></div>
          <div className="arrow" ref="arrow" style={arrowStyle}></div>
          <h2 style={labelStyle} className="pc-popover-label">{this.props.titleLabel}</h2>
          <div className="pc-popover-contents" ref="contents" style={contentStyle}>{this.props.popoverContent}</div>
        </div>
        );

    }

  });

module.exports = Popover;