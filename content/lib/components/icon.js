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
       * Callback function set to run when entering all defined states.
       * Updates the icon image to reflect the current state
       *
       *
       * returns nothing.
       *
       */
       onStateChange: function () {
         var baseUrl = "chrome://waybackfox/content/images/";
         this.element.setAttribute("src", baseUrl + this.currentState() + ".ico");
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
      events: {},
      element: element,
      options: options
    });
    instance.stateMachine(function () {
      var onStateChange = instance.onStateChange;

      this.addState('idle', onStateChange);
      this.addState('active', onStateChange);
      this.addState('data', onStateChange );
      this.addState('no-data', onStateChange );

      this.addTransition('activate', {from:'idle', to:'active'});
      this.addTransition('deactivate', {from:['active','data','no-data'], to:'idle'});
      this.addTransition('showData', {from:'active', to:'data'});
      this.addTransition('showNoData', {from:'active', to:'no-data'});
    });

    return instance;
  }

  //export component
  this.Icon = Icon;
}).call(WaybackFox.Components, window);
