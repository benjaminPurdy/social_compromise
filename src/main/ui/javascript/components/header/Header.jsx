var React = require('react'),
    HeaderContent = require('./HeaderContent'),
    Logo = require('./Logo'),
    jQuery = require('jquery'),
    LayoutStore = require('../../stores/LayoutStore'),
    LayoutRenderingConstants = require('../../constants/LayoutRenderingConstants'),
    ScrollbarSizer = require('../../lib/scrollbarSizer');

module.exports = React.createClass({

    propTypes: {
      isScrolled: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            shouldAnimate: false,
            bodyLayoutMargin: LayoutRenderingConstants.PADDING_BETWEEN_TILES
        }
    },

    componentDidMount: function() {
      if (!this.state.shouldAnimate) {
          setTimeout(this._hookAnimations,
            LayoutRenderingConstants.LAYOUT_ANIMATION_TIMEOUT);
      }

      LayoutStore.addLayoutChangeListener(this._layoutDidChange);
    },

    componentWillUnmount: function() {
      LayoutStore.removeLayoutChangeListener(this._layoutDidChange);
    },

    _layoutDidChange: function() {
      var layout = LayoutStore.getLayout();

      this.setState({
        bodyLayoutMargin: layout.leftOfContainer,
        width: LayoutStore.getWidth()
      });
    },

    _hookAnimations: function() {
        this.setState({shouldAnimate: true});
    },

    //TODO: Header doesn't resize properly when screen is below a certain size
    render: function() {
      var layoutMargin = this.state.bodyLayoutMargin,
          className = 'ss-header ss-header-' +
        (this.props.isScrolled ? 'scrolled' : 'not-scrolled'),
          headerContentWidth = this.props.isScrolled ?
                                this.state.width - ScrollbarSizer() - (layoutMargin * 2)
                                    :
                                this.state.width - (layoutMargin * 2);

      return (
        <header className={className}>
          <HeaderContent leftAnchor={layoutMargin}
                         contentWidth={headerContentWidth}
                         isScrolled={this.props.isScrolled}
                         shouldAnimate={this.state.shouldAnimate}/>
        </header>
      );
    }

});