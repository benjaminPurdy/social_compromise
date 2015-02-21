var React = require('react'),
    isItMobile = require('../../lib/isItMobile'),
    moment = require('moment'),
    NO_MOUSEDOWN_CLASSNAME = 'ss-card-no-mousedown',
    CommunityDiscussions = require('../tileContent/CommunityDiscussions'),
  LayoutRenderingConstants = require('../../constants/LayoutRenderingConstants'),
  IS_MOBILE = isItMobile.any();

require('velocity-animate/velocity');

module.exports = React.createClass({

    propTypes: {
      shouldAnimate: React.PropTypes.bool,
      onTileToggle: React.PropTypes.func,
      onInfoClick: React.PropTypes.func,
      onMove: React.PropTypes.func,
      app: React.PropTypes.object,
      shouldDraw: React.PropTypes.bool,
        onDragStart: React.PropTypes.func,
        onDragEnd: React.PropTypes.func,
        shouldDrawImmediately: React.PropTypes.bool
    },

    getInitialState: function() {
      return {
        bigBlockData: null
      }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      var style = this.props.style,
        nextStyle = nextProps.style;

      if (nextProps.shouldDraw !== this.props.shouldDraw) {return true;}

      if (nextState.bigBlockData !== this.state.bigBlockData) {return true;}

//     Jump out if the style objects are the * same object *
      if (nextStyle === style) {return false;}

      if (!style) {return false;}

//     Jump out if the style objects if the have the same values
      if ( !nextStyle || (
        nextStyle.width === style.width &&
          nextStyle.height === style.height &&
          nextStyle.left === style.left &&
          nextStyle.top === style.top
        )) {return false;}

      return true;
    },

    componentDidUpdate: function(prevProps) {
//      Jump out if we are not in the DOM
      if (!this.isMounted()) {return; }

//      Jump out if this is a mobile browser
      if (IS_MOBILE) { return;}

      var style = this.props.style,
          previousStyle = prevProps.style,
          animationDuration = this.props.shouldAnimate ?
            LayoutRenderingConstants.LAYOUT_ANIMATION_DURATION : 0;

//     Jump out if the style objects are the * same object *
      if (previousStyle === style) {return;}

      if (!style) {return;}

//     Jump out if the style objects if the have the same values
      if ( !previousStyle || (
        previousStyle.width === style.width &&
        previousStyle.height === style.height &&
        previousStyle.left === style.left &&
        previousStyle.top === style.top
       )) {return;}

      // Clear any pending animations
      $(this.getDOMNode()).velocity("stop", true);
      $(this.getDOMNode()).velocity({
        width: style.width + 'px',
        height: style.height + 'px',
        left: style.left + 'px',
        top: style.top + 'px'
      }, {
        duration: animationDuration
      });


      setTimeout(this.afterMove, animationDuration + 1);
    },

    afterMove: function() {
      this.props.onMove &&
        this.props.onMove(this.props.app,
                          this.getDOMNode().getBoundingClientRect());
    },

    didClickInfo: function(e) {
      e.stopPropagation();
      e.preventDefault();

        if (this.props.onInfoClick) {
        this.props.onInfoClick(this.props.app, this.getDOMNode().getBoundingClientRect());
      }
    },

    toggleSize: function(e) {
        e.preventDefault();
        this.props.app.metadata.is_big = !this.props.app.metadata.is_big;
        this.props.onTileToggle && this.props.onTileToggle(this.props.app);
    },

    toggleSizeButton: function() {
        if(this.props.app.metadata.is_big) {
            return "fa fa-compress"
        }
        return "fa fa-expand"
    },

    getLastUpdatedForApp: function(app) {
      if (app.__formatted_date__) {return app.__formatted_date__;}

      if (!app.updated_at) {return null;}
      var formattedDate = moment(app.updated_at).format('MMM Do YYYY');

      if (formattedDate === 'Invalid date') {
        return null;
      }

      return app.__formatted_date__ = 'Last update: ' + formattedDate;
    },

  onSelectStart: function(e) {
    e.preventDefault();
  },

  mouseWentDown: function(e) {
    e.preventDefault();

    if (e.button !== 0) {return;}

    if (!jQuery(e.target).closest('.' + NO_MOUSEDOWN_CLASSNAME).length) {
      this.props.onMouseDown && this.props.onMouseDown(e, this.props.app, this.props.style);
    }
  },

  _getCommunityContent: function() {
    var app = this.props.app,
        self = this,
        communityId = app.url.replace(/^.+communityUuid=/, '');

    if (this.state.bigBlockData) {
      return (<CommunityDiscussions discussions={this.state.bigBlockData} />);
    }

    jQuery.get('/discussion_content?community_id=' + communityId,
                function(data) {
                  self._didReceiveDiscussionData.call(self, data, communityId);
                });
  },

  _didReceiveDiscussionData: function(data) {
    this.setState({
      bigBlockData: data
    });
  },

    render: function() {
        var app = this.props.app,
            isCommunity = app.type === 'Community',
            style = {},
            tileClassNames = ['ss-tile','ss-card', 'ss-card-sm'],
            bodyContent = app.blurb,
            type = app.type,
            bodyContentStyle = {
              display: 'none'
            },
            infoButtonStyle = {
              display: app.blurb ? 'block' : 'none'
            },
            sizeToggleStyle = {
              display: (isCommunity && !this.props.isSmallScreen) ? 'block' : 'none'
            },
            propStyle = this.props.style,
            parent = app.parent,
            parentStyle;

        if (app.metadata.is_big && isCommunity) {
          bodyContent = this._getCommunityContent();
          bodyContentStyle.display = 'block';
        }

        if (IS_MOBILE || this.props.shouldDrawImmediately) {
          style = {
            top: propStyle.top + 'px',
            left: propStyle.left + 'px',
            height: propStyle.height + 'px',
            width: propStyle.width + 'px'
          }
        }

        if(parent) {
          parentStyle = {
            color: '#8c9daa'
          };
          type = <span className="ss-card-subcommunity-parent">Subcommunity <span className="ss-card-subcommunity-parent-name" style={parentStyle}>&middot; {parent}</span></span>;
        }


            tileClassNames.push('ss-card-' + app.type);
        tileClassNames.push('ss-card-' + app.color);

        style.visibility = this.props.shouldDraw ? 'visible' : 'hidden';

        if (app.metadata.is_big) {
          tileClassNames.push('ss-tile-big');
        }

        return (
            <div className={tileClassNames.join(' ')}
              onSelectStart={this.onSelectStart}
              onMouseDown={this.mouseWentDown}
              href={app.url}
               style={style}>

                <div>

                     <div >
                       <header className="ss-card-header">
                           <div className="ss-card-type">{type}</div>
                           <div className="ss-card-name">{app.name}</div>
                       </header>

                       <div className="ss-card-body">
                         <div className="ss-card-content-last-update">{this.getLastUpdatedForApp(app)}</div>
                         <div className="ss-card-content" style={bodyContentStyle}>{bodyContent}</div>
                       </div>
                     </div>

                     <footer className="ss-card-footer">
                         <div className={"card-info-button " + NO_MOUSEDOWN_CLASSNAME}
                              style={infoButtonStyle}
                              onClick={this.didClickInfo}>
                            <span className="fa fa-info-circle"></span>
                         </div>
                         <div className={"card-toggle-size-button " + NO_MOUSEDOWN_CLASSNAME}
                              style={sizeToggleStyle}
                              onClick={this.toggleSize}>
                             <span className={this.toggleSizeButton()}></span>
                         </div>
                     </footer>
    
                     <div className="light-fade"></div>

                </div>
            </div>
        )
    }

});