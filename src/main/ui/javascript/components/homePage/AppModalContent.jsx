var React = require('react');

module.exports = React.createClass({

  propTypes: {
    app: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func
  },

  didClickClose: function() {
    this.props.onClose && this.props.onClose();
  },

  getCardLastUpdate: function() {
//    return (<div>
//              <div className="ss-card-content-last-update">{this.props.app.last_update}</div>
//              <div className="ss-card-content-last-update">Last update: 08/25/2014</div>
//            </div>);
  },

  getCardBodyContent: function() {
    return (<div>
              <div className="ss-card-content">{this.props.app.blurb}</div>
            </div>);
  },

  getCardSideContent: function() {
    return (<div></div>);
  },

  render: function() {
    var app = this.props.app || {};
    var className = "ss-card ss-card-xl ss-card-" + app.type;
    return (
      <div className={className}>

        <header className="ss-card-header">
            <div className="pc-modal-toolbar">
              <div className="ss-card-type">{app.type}</div>
              <div className="pc-modal-exit" onClick={this.didClickClose}>
                <a href="javascript:"><span className="fa fa-times"></span></a>
              </div>
            </div>
        </header>

        <div className="pc-modal-body">
          <div className="ss-card-body">
            <div className="ss-card-name">{app.name}</div>
            {this.getCardLastUpdate()}
            {this.getCardBodyContent()}
          </div>

          <div className="ss-card-side">
            <a className="ss-card-xl-app-link" href={app.url} target="_blank">Launch <i className="fa fa-chevron-right"></i></a>
            {this.getCardSideContent()}
          </div>

        </div>

      </div>
    );
  }

});