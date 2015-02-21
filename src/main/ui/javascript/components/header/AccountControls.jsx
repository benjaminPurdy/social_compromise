var React = require('react'),
    jQuery = require('jquery'),
    Popover = require('../Popover');

module.exports = React.createClass({

    propTypes: {
        isScrolled: React.PropTypes.bool,
        showName: React.PropTypes.bool
    },

  mixins: [Popover.CONSUMER_MIXIN],

  getInitialState: function() {
    return {
      width: 0
    };
  },

  componentDidMount: function() {
      this.setState({
          width: jQuery(this.getDOMNode()).width()
      })
  },

  didClickOnTarget: function() {
    this._getPopover().toggle();
  },

  _getPopoverTargetComponent: function() {
    return this.refs && this.refs.popoverTarget;
  },

  _getPopoverContent: function() {
    var csrf_token = jQuery('meta[name="csrf-token"]').attr('content');
    return (
      <ul>
        <li>
          <span className="ss-user-profile">
            <a className="ss-user-profile-btn" href={__USER_PROFILE_URL__}>Profile</a>
          </span>
        </li>
        <li>
          <span className="ss-pc-tac">
            <a className="ss-pc-tac-btn" href={__PC_TAC_URL__}>Terms and Conditions</a>
          </span>
        </li>
        <li>
            <span className="ss-enhancement-request">
                <a className="ss-enhancement-request-btn" href={__ENHANCEMENT_REQUEST_URL__}>Enhancement Request</a>
            </span>
        </li>
        <div className="logout-separator"> </div>
        <li>
          <form className="ss-user-logout" method="POST" action="/logout">
            <input name="authenticity_token" type="hidden" value={csrf_token} />
            <input className="ss-user-logout-btn" type="submit" name="logout" value="Logout" />
          </form>
        </li>
      </ul>
      );
  },

  _getPopoverClassNames: function() {
    return ['profile-popover']
  },

  render: function() {
      var pngMaskClassName,
          userNameStyle;
      if (this.props.isScrolled) {
          pngMaskClassName = "headerScrolledMask";
      }
      else {
          pngMaskClassName = "headerMask";
      }

      userNameStyle = {
          display: this.props.showName ? 'none' : 'inline-block'
      };

      return (
          <nav className="ss-account-controls" onClick={this.didClickOnTarget}>
              <span className="imageWrap" >
                  <img src={__USER_PROFILE_PICTURE_URL__} width="30px" height="30px"/>
                  <span className={pngMaskClassName}></span>
              </span>
              <span className="ss-user-name-and-chevron">

                  <span className="ss-user-name" style={userNameStyle}>{__USER_DISPLAY_NAME__}</span>
                  <span ref="popoverTarget" className="ss-header-username-chevron-spacer">
                    <span ref="chevron" className="ss-header-username-chevron" ></span>
                  </span>
              </span>

          </nav>
      )
  }
});
