/***
 *
 * Module controlling the toggable Waybackfox status bar widget.
 * Uses the eventElement trait.
 *
 */
(function (window, undefined) {
   'use strict';

  /* private variable holding the icon's state */
    var iconState = 'IDLE';

   /**
    * A trait defining the Waybackfox icon widget behaviour.
    *
    */
    var iconTrait = Trait(
      WaybackFox.Traits.EventedObject,
      //WaybackFox.Traits.TabObserver,
      Trait({
        element: Trait.required,
        options: Trait.required,
        events: {
          'click' : 'clickHandler'
        },
        clickHandler: function (event) {
        },

       /*
        * Returns the icon's state
        *
        */
        getState: function () {
          return iconState;
        },

        // utility methods for changing the widget state
        // (they are all wrappers for this._setState)

        setIdle: function (silent) {
          this._setState('idle');
        },
        setActive: function (silent) {
          this._setState('active', silent);
        },
        setData: function (silent) {
          this._setState('data', silent);
        },
        setNoData: function (silent) {
          this._setState('no-data', silent);
        },

        /*
         * Internal method for setting the internal state of the widget.
         *
         * silent - does not emit an event if set to true
         *
         * returns nothing.
         */
        _setState: function (state, silent) {
          iconState = state;
          if (!silent) {
            //emit both generic and a specific state change events
            this.emit('state-changed', state);
            this.emit('state-' + state);
          }
        }
      }));

  /**
   * Pseudo constructor for instantiating the Icon widget.
   *
   * Element - an element instance or selector
   *
   */
  function Icon (element, options) {
    options = options || {};

    return iconTrait.create({
      element: $(element),
      options: options
    });
  }

  //export component
  this.Icon = Icon;
}).call(WaybackFox.Components, window);
