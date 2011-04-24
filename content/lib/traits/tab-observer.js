(function (window) {

  // a reference to the currently selected tab
  var activeTab,
    /*
     * List of objects representing the tabs currently open in the active browser window.
     * Each tab object presents the following attributes:
     *
     *   tabUrl: the tab's content url.
     *   widgetState: the state in which the widget will be if the tab will be selected
     *
     */
    openTabs = [],

    /*
    * Observes the window tabs through a set of event listeners
    * and changes the state of the widget as the tabs
    *
    */
    TabObserver = Trait({
      //event handlers
      onTabOpen: function () {
      },
      onTabClose: function () {
      },
      onTabSelected: function () {
      },
      onTabContentReady: function () {
      },
      onTabContentLoading: function () {
      },
      //
      getActiveTab: function () {
      },
      _setWidgetState: function (tab) {
      }
    });

    //export trait
    this.TabObserver = TabObserver;

}).call(WaybackFox.Traits, window);
