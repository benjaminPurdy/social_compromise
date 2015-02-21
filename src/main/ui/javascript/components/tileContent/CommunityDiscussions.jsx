var React = require('react'),
    moment = require('moment'),
    USER_PROFILE_PICTURE_URL = __USER_PROFILE_PICTURE_URL_ROOT__.replace(/\?uid=/, ''),
    Discussion;

Discussion = React.createClass({

  propTypes: {
    discussion: React.PropTypes.object.isRequired
  },

  getPublishedString: function() {
    var discussion = this.props.discussion,
        published = discussion.published,
        publishedString = discussion.publishedString;

    if (!published) {return; }

    if (publishedString) {return publishedString;}

    return discussion.publishedString = "- " +
            moment(published).format('MMM Do YYYY h:mm a');
  },

  getImageUrl: function() {
        var discussion = this.props.discussion;
    if (discussion.authorImageUrl) {return discussion.authorImageUrl;}

    return discussion.authorImageUrl =
            USER_PROFILE_PICTURE_URL + "?email=" +
            this.props.discussion.authorEmail;
  },

  getDiscussionContent: function() {
    var discussion = this.props.discussion;
    return discussion.content && discussion.content.replace(/<(?:.|\n)*?>/gm, '');
  },

  render: function() {
    var discussion = this.props.discussion;

    // TODO: Strip HTML from content
    return (
      <div className="ss-community-discussion">

          <div className="ss-community-discussion-profile-image-container">
            <img className="ss-community-discussion-profile-image" src={this.getImageUrl()} />
            <span className="ss-community-discussion-profile-mask"></span>
          </div>

          <div className="ss-community-discussion-content-container">

            <header>
              <h3 className="ss-community-discussion-title ss-card-no-mousedown"><a href={discussion.url} title={discussion.title} target="_blank">{discussion.title}</a></h3>
            </header>

            <div className="ss-community-discussion-content">{this.getDiscussionContent()}</div>

            <footer className='ss-community-discussion-meta'>
              <span className="ss-community-discussion-meta-user">{discussion.authorName}</span> <span className="ss-community-discussion-meta-publishdate">{this.getPublishedString()}</span>
            </footer>

          </div>

      </div>
    );
  }

});


module.exports = React.createClass({

  propTypes: {
    discussions: React.PropTypes.array.isRequired
  },

  render: function() {
    var discussions = this.props.discussions,
        discussionCount = discussions.length,
        discussion,
        discussionElements = [], i;

    for (i=0;i<discussionCount;i++) {
      discussion = discussions[i];
      discussionElements.push(<Discussion discussion={discussion} key={discussion.uri} />);
    }

    return (
      <div className="ss-community-discussions-container">
        <h2 className="ss-community-discussions-header">Recent Discussions</h2>
        <div>{discussionElements}</div>
      </div>
      );
  }

});