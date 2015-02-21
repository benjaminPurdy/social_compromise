var React = require('react'),
    jQuery = require('jquery'),
    RouteHandler = require('react-router').RouteHandler,
    Body = require('./Body'),
    Header = require('./header/Header');

require('snowstorm.scss');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      bodyScrolled: false
    }
  },

  bodyDidScroll: function(y) {
    this.setState({
      bodyScrolled: !!y
    });
  },

//  layoutChanged: function(layout) {
//    this.setState({
//      bodyLayoutMargin: layout.leftOfContainer
//    });
//  },

  render: function() {

    return (
      <div className="ss-layout">
        <div className="ss-layout-background-top"></div>
        <div className="ss-layout-background-bottom"></div>
        <Header isScrolled={this.state.bodyScrolled} />
        <Body onScroll={this.bodyDidScroll} layoutChanged={this.layoutChanged} />
      </div>
    );

  }

});