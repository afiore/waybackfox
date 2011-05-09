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
      panel = WaybackFox.Components.Panel(document.querySelector("#wb-popup"), {
        icon: icon,
        slider: slider
      }),
      progressListener = WaybackFox.Components.makeProgressListener(
        function onPageLoad (newUri) {
          if (!WaybackFox.browsingArchive()) {
            icon.activate();
          }
        },
        function onLocationChange (newUri) {
          if (icon.currentState() !== 'idle' & !WaybackFox.browsingArchive()) {
            icon.deactivate();
          }
        }
      );

   gBrowser.addTabsProgressListener(progressListener);
}, false);
