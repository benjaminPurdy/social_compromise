// Our component...
var HelloMessage = React.createClass({
    render: function() {
        return (<div>Hello {this.props.name}</div>);
    }
});

// ...can be rendered to a string on the server...
React.renderComponaentToString(HelloMessage({name: "John"}));