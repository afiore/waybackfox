(function () {
  const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;
  const STATE_STOP             = nsIWebProgressListener.STATE_STOP;
  const STATE_IS_DOCUMENT      = nsIWebProgressListener.STATE_IS_DOCUMENT;
  const STATE_IS_WINDOW        = nsIWebProgressListener.STATE_IS_WINDOW;
  const NOTIFY_STATE_WINDOW    = nsIWebProgressListener.NOTIFY_STATE_WINDOW;

  var makeProgressListener = function (onPageLoad, onLocationChange) {
    return {
      QueryInterface: function (aIID) {
       if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
           aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
           aIID.equals(Components.interfaces.nsISupports))
         return this;
       throw Components.results.NS_NOINTERFACE;
      },

      onStateChange: function (browser, webProgress, request, flag, state) {
        var tabUrl = gBrowser.selectedBrowser.contentWindow.location.href;
        if (flag & STATE_STOP & flag && STATE_IS_WINDOW ) {
          if (request && tabUrl === request.name) {
            onPageLoad(tabUrl)
          }
        }
      },
      onLocationChange: function (browser, progress, request, uri) {
        var tabUrl = gBrowser.selectedBrowser.contentWindow.location.href;
        onLocationChange(tabUrl);
      },
    };
  };

  //export module
  this.makeProgressListener = makeProgressListener;

}).call(WaybackFox.Components);
