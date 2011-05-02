/*
* main.js
*
* Bootstraps the application by instantiating components and
* binds the main browser events to state transitions in the widget
*
*/

window.addEventListener("load", function (event) {
  var webArchive = WaybackFox.Components.webArchive,
      icon = WaybackFox.Components.Icon(document.querySelector('#wb-icon'), {
        webArchive: webArchive
      }),
      slider = WaybackFox.Components.Slider(document.querySelector('#wb-slider'), {
        icon: icon
      }),
      progressListener = WaybackFox.Components.makeProgressListener(
        function onPageLoad (newUri) {
          dump("document loaded " + newUri + "\n");
          icon.activate();
        },
        function onLocationChange (newUri) {
          dump("location changed to " + newUri + "\n");
          icon.deactivate();
        }
      );

   gBrowser.addTabsProgressListener(progressListener);
}, false);
