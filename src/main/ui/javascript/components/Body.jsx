var React = require('react'),
    jQuery = require('jquery'),
    HomePageTileLayout = require('./homePage/HomePageTileLayout');

module.exports = React.createClass({

  propTypes: {
      onScroll: React.PropTypes.func
  },

  componentDidMount: function() {
      jQuery(this.getDOMNode()).on('scroll', this.didScroll);
  },

  componentWillUnmount: function() {
      jQuery(this.getDOMNode()).off('scroll', this.didScroll);
  },

  didScroll: function(e) {
    this.props.onScroll && this.props.onScroll(e.target.scrollTop);
  },

  render: function() {
      return (
          <div className="ss-body">
              <HomePageTileLayout />
          </div>
      )
  }

});