/*
 * Main application namespace
 *
 */
this.WaybackFox = {};

(function (window, undefined) {
  'use strict';

  // Namespace for add-on components
  this.Components = {};

  // Namespace for Traits,
  // These are normally more abstract and reusable than the components*/
  this.Traits = {};

  //utility methods

  /*
  * Gets the active tab's url
  *
  * returns the url string
  */
  this.tabUrl = function (url) {
    var tabUrl = gBrowser.selectedBrowser.contentWindow.location.href;
    if (!url) {
      return tabUrl;
    }
    else {
      gBrowser.selectedBrowser.loadURI(url);
    }
  };



 /*
  * Boolean test to verify whether the browser is currently browsing the Wayback machine's archive
  *
  *
  * returns true or false
  */
  this.browsingArchive = function browsingArchive () {
     return (/^http\:\/\/(replay\.)?web\.archive\.org\//).test(this.tabUrl());
  };

  //set underscore.js variable interpolation syntax
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

}).call(this.WaybackFox, this);
