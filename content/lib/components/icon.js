/***
 *
 * Module controlling the toggable Waybackfox status bar widget.
 * Uses the eventElement trait.
 *
 */
(function (window, undefined) {
   'use strict';

   var IconTrait = Trait(
     WaybackFox.Traits.Optionable,
     WaybackFox.Traits.EventedObject,
     WaybackFox.Traits.StateMachine,
     Trait({
      /*
       * an array where the web archive snapshots are temporary stored
       *
       */
       data: Trait.required,

       /*
       * Gets a snapshot from the internal data array.
       *
       *
       * sliderValue - the slider value (the data array index + 1).
       *
       * returns a snapshot object.
       */

       getSnapshot: function (index) {

         if (this.data[index]) {
             return this.data[index];
         }
       },


       /*
       * Shortcut for getting the current tab's url
       *
       * returns a url string.
       */
       currentUrl: function () {
         return gBrowser.selectedBrowser.contentWindow.location.href;
       },

      /*
       * Looks up a url into the web archive
       *
       * url - a url string
       *
       * returns nothing
       */

       fetchFromWebArchive: function (url) {
         this.showLoading();
         this.options.webArchive.fetchSnapshots(url, _.bind(function (data, error) {
             if (error) {

               this.showNoData();

             } else {

               this.data = data;
               this.showData();

             }
           }, this));
       },

       /*
       * Listens to the click events and tries fetching a page snapshots from
       * web archive if the widget is not disabled
       *
       * event - an event
       *
       * returns nothing
       *
       */
       onClick: function (event) {
         var url = this.currentUrl();
         if (this.currentState() !== 'idle') {
           this.fetchFromWebArchive(url);
         }
       },

      /*
       * Callback function set to run when entering all defined states.
       * Updates the icon image to reflect the current state
       *
       *
       * returns nothing.
       *
       */
       onStateChange: function (event) {
         var baseUrl = "chrome://waybackfox/content/images/widget-";
         this.element.setAttribute("src", baseUrl + this.currentState() + ".ico");
         this.element.setAttribute('tooltiptext',"state:"+this.currentState());
       }
     })
   );


  /**
   * Pseudo constructor for instantiating the Icon widget.
   *
   * Element - an element instance or selector
   *
   */
  function Icon (element, options) {
    options = options || {};

    var instance = IconTrait.create({
      events: {
        'click'       : "onClick",
        'state-change': 'onStateChange'
      },
      data: [],
      element: element,
      options: options
    });

    instance.initEvents();
    instance.stateMachine(function () {
      var onStateChange = instance.onStateChange;

      this.addState('idle');
      this.addState('active');
      this.addState('loading');
      this.addState('data');
      this.addState('no-data');

      this.addTransition('activate', {from:'idle', to:'active'});
      this.addTransition('deactivate', {from:['active','data','no-data'], to:'idle'});
      this.addTransition('showLoading', {from: ['active','data','no-data'], to: 'loading'});
      this.addTransition('showData', {from:['active','loading'], to:'data'},
        /**
         * As the transition callback return value is passed with the state event, this allows to broadcast
         * the data with the 'state:data' and the 'state-change' event
         *
         */
        function emitData () {
          return this.data;
      });
      this.addTransition('showNoData', {from:['active','loading'], to:'no-data'});
    });

    return instance;
  }

  //export component
  this.Icon = Icon;
}).call(WaybackFox.Components, window);
