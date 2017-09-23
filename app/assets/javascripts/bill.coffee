# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$ ->
  $('.nav.nav-tabs > li > a').on 'click', (e) ->
    $('.nav.nav-tabs > li').removeClass('active');
    $(this).parent().addClass('active');
