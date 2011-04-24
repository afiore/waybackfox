/***
 *
 * Module controlling the toggable Waybackfox status bar widget.
 * Uses the eventElement trait.
 *
 */
(function (window, undefined) {
   'use strict';

   /**
    * A trait defining the Waybackfox icon widget.
    *
    */

    var iconTrait = Trait(
      WaybackFox.Traits.EventedObject,
      //WaybackFox.Traits.TabObserver,
      Trait({
        element: Trait.required,
        events: {
          'click' : 'clickHandler'
        },
        clickHandler: function (event) {
          //TODO: check here if this is left or right click
          this.toggleActive();
        },
        toggleActive: function () {
        }
      }));

  /**
   * Pseudo constructor for instantiating the Icon component.
   *
   * Element - an element instance or selector
   *
   */
  function Icon (element) {
    return iconTrait.create({
      element: $(element)
    });
  }
  this.Icon = Icon;
}).call(WaybackFox.Components, window);
