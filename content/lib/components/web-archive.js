(function (window, undefined) {
  'use strict';
  var ARCHIVE_BASE_URL = 'http://classic-web.archive.org/web',
      dataStore = {};

  /*
   * Extracts snapshots
   *
   * textContent - The response content from http://web.archive.org/<url>
   * url - the input url (needed to compile a regular expression)
   *
   * Returns the list of archived snapshots for that page.
   * Each snapshot is structured in the following format:
   *
   *   date-time: A javascript data-time indicating the time of archival of the input url.
   *   snapshot-url: The url from which a page snapshot may be accessed from the web archive.
   *
   */
  function extractSnapshotData (textContent, url) {
   /* Escape a string in a format suitable to be passed to the RegExp function.
    *
    * string - the string to be escaped
    *
    * Returns the escaped string
    *
    */
    function escapeForRegexp (text) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        var s = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      return text.replace(s, '\\$1');
    }
    var snapshots = [],
        textLines = textContent.split("\n"),
        sanitisedUrl = url.replace(/^http\:\/\/(www\.)?/,''),
        regexpString = ARCHIVE_BASE_URL.replace(/\./,'\\.') + "/" +
           "([0-9]{14})" + "/http://(www\.)?" +
          escapeForRegexp(sanitisedUrl),
        snapshotUrlRegexp = new RegExp(regexpString);

    textLines.forEach( function (line, index) {
      var matches = snapshotUrlRegexp.exec(line);
      if (matches && matches.length) {
         snapshots.push({

           'date': new Date(
              parseInt(matches[1].substr(0,4), 10),
              parseInt(matches[1].substr(4,2), 10)-1,
              parseInt(matches[1].substr(6,2), 10)
           ),

           // replace class-web.archive.org with http://replay.web.archive.org
           // which is the host currently in use for serving archived snapshots
           url: matches[0].replace(
             /^http:\/\/classic-web\.archive\.org\/web\//,
              'http://replay.web.archive.org/'
           )
         });
      }
    });
    return snapshots;
  }
  /*
   * Toggle the www. fragment from a url (removes it if is there, adds it if  is not..)
   *
   * url - a URL string
   *
   * Returns a string with/without the .www fragment
   */
  function _toggleWww (url) {
    var replacement = /^https?\:\/\/www\./.test(url) ?
      "$1$3" : "$1www.$3";
    return url.replace(/^(https?:\/\/)(www\.)?(.*)/, replacement);
  }


   /*
   * Given a look up url, prepend the Wayback Machine base URL and strip the trailing slash.
   *
   * url - the URL of the resource to be looked up in the archive
   * examples:
   *
   *   var lookUpUrl = makeUrl('http://www.bbc.co.uk/');
   *
   *
   * returns the URL to the list of archived snapshots in the Wayback Machine
   */
  function makeUrl (url) {
    url = url.replace(/\/$/,'');
    return [ARCHIVE_BASE_URL, '*', url].join('/');
  }


  /*
   * Issues a get request to archive.org's Way back Machine and extracts a list of available snapshots dates and urls.
   *
   * url      - The absolute url string of the page to be looked up in the web archive.
   * callback - A block of code to be executed when the retrieval and the extractraction of snapshot data will be completed.
   *            the callback receives two mutually excluding arguments: data, and error. The first being the list of extracted records, 
   *             the second an error object suitable to be thrown.
   *
   * Returns nothing.
   */


  function fetchSnapshotData (tabUrl, callback) {
    var firstAttempt = true;
    /**
     * Closure wrapper for the http request call.
     * This allows to issue a second attempt if no records are retrieved at the first one.
     *
     * tabUrl - the url
     *
     */
    (function fetch () {
      var url = firstAttempt ? tabUrl : _toggleWww(tabUrl),
          request = new XMLHttpRequest(),
          outputData,
          error;


      request.open('GET', makeUrl(url), true);

      request.onreadystatechange = function (event) {
        if (request.readyState == 4 ) {

          if (request.status == '200') {

            //attempt successful, append live page url to snapshot list
            outputData = extractSnapshotData(request.responseText, url);
            outputData.push({
              date: 'LIVE',
              url: tabUrl
            });
            callback(outputData);

          } else {

            if (firstAttempt) {
              firstAttempt = false;
              fetch();

            } else {
              error = new Error(
                'Request failed for ' +  makeUrl(url) +
                 'with status code: ' + request.status
              );
              callback(outputData, error);
            }
          }
        }
      };

      request.send(null);
    })();
  }

  /**
   * Public: Retrieves webpage snapshots by URL.
   *
   * Checks if webpage snapshots for the given URL already exist in the local cache. If that is the case,
   * use cached data, otherwise issues a request to the Wayback Machine and caches the result.
   *
   * url - the URL to be looked up.
   *
   * Returns a list of snapshot objects.
   */

  function fetchSnapshots(url, callback) {
    var snapshots = dataStore[url];

    if (snapshots && snapshots.length) {
      callback(snapshots);
      return true;

    } else {
        fetchSnapshotData(url, callback);
    }
    //TODO: implement cache expiration mechanism
  }


  /*
   * Public: checks if a web page snapshot data have been already stored in the local cache
   *
   * url - The page URL.
   *
   * Returns a boolean value.
   */
  function inDataStore (url) {
    return !!dataStore[url];
  }


  //Module exports
  this.webArchive = {
    fetchSnapshots: fetchSnapshots
  };


}).call(WaybackFox.Components, window);
