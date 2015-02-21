var React = require('react');

require('velocity-animate/velocity');

module.exports = React.createClass({

    propTypes: {
        shouldAnimate: React.PropTypes.bool
    },

    render: function() {
        return (
            <div className="ss-logo">
                <a href="/"><img src="/images/logo-premier-connect.png" alt="PremierConnect" width="150" height="36" /></a>
            </div>
        )
    }

});