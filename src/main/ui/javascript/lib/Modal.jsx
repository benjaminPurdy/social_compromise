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
  outer.style.overflow = "auto";
  outer.appendChild(inner);

  document.body.appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 === w2) w2 = outer.clientWidth;

  document.body.removeChild(outer);

  getScrollBarWidth.width = w1 - w2;
  return getScrollBarWidth.width;
}

require('modal.css');

require('velocity-animate/velocity');

var MAX_WIDTH = 800,
    PADDING = 20,
    ANIMATION_DURATION = 0.3 * 1000,
    ANIMATION_DIRECTION = {
      IN: 1,
      OUT: 2,
      NONE: null
    },
    React = require('react/lib/React'),

  CONSUMER_MIXIN = {

    toggleModal: function () {
      this._getModal().toggle();
    },

    showModal: function() {
      this._getModal().show();
    },

    hideModal: function() {
      this._getModal().hide();
    },

    showModalStartingAt: function(position) {
      this._getModal().showStartingAt(position);
    },

    updateModalStartingPosition: function(position) {
      this._getModal().updateStartingPosition(position);
    },

    _teardownModal: function() {
      React.unmountComponentAtNode(this._getModalContainer());
      this._getModalContainer().parentNode.removeChild(this._getModalContainer());
      this.modal = null;
      this.modalContainer = null;
      this.modalDidTearDown && this.modalDidTearDown();
    },

    _getModalContainer: function () {
      var modalContainer = this.modalContainer;

      if (!modalContainer) {
        this.modalContainer = modalContainer =
          document.body.appendChild(document.createElement('DIV'));
      }
      return modalContainer;
    },

    componentWillUnmount: function () {
      var node;
      if (this.modal) {
        node = this._getModalContainer();
        React.unmountComponentAtNode(node);
        this.modal = null;
        node.parentNode.removeChild(node);
        this.modalContainer = null;
      }
    },

    _getModal: function () {
      if (this.modal) {
        return this.modal;
      }
      this.modal = React.render(<Modal
        onHide={this._teardownModal}
      classNames={this._getModalClassNames && this._getModalClassNames() || []}
      modalContent={this._getModalContent && this._getModalContent() || <div>IMPLEMENT _getModalContent</div>}
      />, this._getModalContainer());
      return this.modal;
    }
  },

  Modal = React.createClass({

    propTypes: {

      modalContent: React.PropTypes.element,

      classNames: React.PropTypes.array,

      onHide: React.PropTypes.func

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

    position: function(position, shouldAnimate) {
      this.positionModal(position, shouldAnimate);
    },

    updateStartingPosition: function(position) {
      this.setState({
        startingPosition: position
      });
    },

    calculatePosition: function () {
      var windowWidth = this._getWindowWidth(),
          width = Math.min(MAX_WIDTH, windowWidth),
          horizontalOffset = width === windowWidth ? 0 : ((windowWidth - width) / 2);

      return {
        left: horizontalOffset + 'px',
        top: PADDING + 'px',
        bottom: PADDING + 'px',
        width: width + 'px'
      }

    },

    isOpen: false,

    show: function () {
      this.setState({visible: true});
    },

    showStartingAt: function(position) {

      position.top -= 3;
      position.left -= 4;
      position.width += 8;
      position.bottom -=4;

      this.positionModal(position, false);
      this.setState({
        startingPosition: position,
        shouldShowUnderlay: true,
        animationDirection: ANIMATION_DIRECTION.IN
      });
      this.show();
      var self = this;
      setTimeout(function() {
        var position = self.calculatePosition.call(self);
        self.positionModal.call(self, position, true, function(){
          self.setState.call(self, {
            shouldShowUnderlay: true,
            animationDirection: ANIMATION_DIRECTION.NONE
          })
        });
      }, ANIMATION_DURATION / 5);
    },

    _hookAnimations: function() {
      this.setState({shouldAnimate: true});
    },

    hide: function (e) {
      var self = this;
      e && e.stopPropagation();

      if (this.state.startingPosition) {

        this.setState({
          shouldShowUnderlay: false,
          animationDirection: ANIMATION_DIRECTION.OUT
        }, function() {
          this.positionModal(this.state.startingPosition, true);
        });


        setTimeout(function() {
          self.setState.call(self, {visible: false, startingPosition: null});
          self.props.onHide && self.props.onHide();
        }, ANIMATION_DURATION + 100);

        return;
      }

      this.setState({visible: false});
      this.props.onHide && this.props.onHide();
    },

    toggle: function () {
      this[this.state.visible ? 'hide' : 'show']();
    },

    positionModal: function (position, shouldAnimate, doneCallback) {
      var pos = position,
          animate = shouldAnimate,
          animationDirection = this.state.animationDirection,
          OUT = ANIMATION_DIRECTION.OUT;

      if (!arguments.length) {
        pos = this.calculatePosition();
        animate = true;
      }

      $(this.refs.modalContainer.getDOMNode()).velocity({
          top: pos.top,
          left: pos.left,
          bottom: pos.bottom,
          width: pos.width
      }, {
        easing: 'easeOutSine',
        duration: animate ? ANIMATION_DURATION : 0,
        complete: doneCallback,
        progress: function(elements, completePercent) {
          if (animationDirection === OUT) {
            elements[0].style.zIndex = 10001 - (10001 * completePercent);
          }
        }
      });
    },

    resizeTimer: null,

    componentDidMount: function () {
      $(window).on('resize', this.windowDidResize);
    },

    componentWillUnmount: function(){
      $(window).off('resize', this.windowDidResize);
    },

    didClickOnBody: function (e) {
      e = this._fixEvent(e);
      var clickedInsideModal = this._contains(this.getDOMNode(), e.target);

      if (!clickedInsideModal) {
        this.hide();
      }
    },

    windowDidResize: function () {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }

      this.resizeTimer = setTimeout(this.positionModal, 150);
    },

    render: function () {

      var modalClassNames = this.props.classNames.concat("pc-modal-container").join(" "),

        modalStyle = {
          display: this.state.visible ? 'block' : 'none'
        },

        underlayStyle = {
          display: this.state.shouldShowUnderlay ? 'block' : 'none'
        };

      if (this.state.animationDirection) {
        modalClassNames = modalClassNames + ' pc-modal-is-animating'
      }

      return (
        <div>
          <div className="pc-modal-underlay" style={underlayStyle} onClick={this.hide}></div>
          <div className={modalClassNames}
               ref="modalContainer"
               style={modalStyle}>

            <div className="pc-modal-content">{this.props.modalContent}</div>
            <div className="shadow shadow-corner shadow-corner-tl"></div>
            <div className="shadow shadow-corner shadow-corner-tr"></div>
            <div className="shadow shadow-corner shadow-corner-bl"></div>
            <div className="shadow shadow-corner shadow-corner-br"></div>
            <div className="shadow shadow-edge shadow-edge-t"></div>
            <div className="shadow shadow-edge shadow-edge-r"></div>
            <div className="shadow shadow-edge shadow-edge-b"></div>
            <div className="shadow shadow-edge shadow-edge-l"></div>

          </div>
        </div>
        );

    }

  });

module.exports = Modal;