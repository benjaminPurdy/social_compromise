var React = require('react'),
    Router = require('react-router'),
    Route = Router.Route,
    Layout = require('./components/Layout');

module.exports = (
  <Route handler={Layout} path="/">
  </Route>
);