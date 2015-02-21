var jQuery = require('jquery'),
    React = require('react'),
    Router = require('react-router'),
    Routes = require('./Routes'),
    isItMobile = require('./lib/isItMobile');



jQuery(document).ready(function() {

  if (isItMobile.any()) {
    jQuery(document.body).addClass('ss-is-mobile');
  }

  Router.run(Routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });

});
