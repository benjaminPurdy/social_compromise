var React = require('react'),
    Logo = require('./Logo'),
    LayoutRenderingConstants = require('../../constants/LayoutRenderingConstants'),
    AccountControls = require('./AccountControls');

module.exports = React.createClass({

    propTypes: {
        leftAnchor: React.PropTypes.number,
        contentWidth: React.PropTypes.number,
        isScrolled: React.PropTypes.bool,
        shouldAnimate: React.PropTypes.bool
    },

    componentDidUpdate: function(prevProps) {
        var currentLeft,
            animationDuration,
            currentWidth,
            previousWidth,
            previousLeft;

        if(!this.isMounted()) { return; }

        currentLeft = this.props.leftAnchor;
        currentWidth = this.props.contentWidth;
        previousWidth = prevProps.contentWidth;
        previousLeft = prevProps.leftAnchor;
        animationDuration = this.props.shouldAnimate ?
          LayoutRenderingConstants.LAYOUT_ANIMATION_DURATION : 0;

        if(previousWidth === currentWidth &&
           previousLeft === currentLeft) { return; }

        $(this.getDOMNode()).velocity("stop", true);

        $(this.getDOMNode()).velocity({
            width: currentWidth + 'px',
            left: currentLeft + ' px'
        }, {
            duration: animationDuration
        });
    },

    render: function() {
        var shouldShowName = this.props.contentWidth <
            LayoutRenderingConstants.MIN_WIDTH_WHERE_NAME_VISIBLE;

        return (
          <div className='ss-header ss-header-content'>
              <Logo margin={this.props.leftAnchor} />
              <AccountControls
                isScrolled={this.props.isScrolled}
                showName={shouldShowName}
              />
              <div className="ss-header-shadow" ></div>
          </div>
        );
    }

});