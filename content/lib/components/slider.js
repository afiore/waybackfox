(function (window, undefined) {


  var SliderTrait = Trait.compose(
    WaybackFox.Traits.Optionable,
    WaybackFox.Traits.EventedObject,
    WaybackFox.Traits.Toggable,
    Trait({

     /*
      * Sets the slider's value range.
      *
      * This is intended to be called without parameters; in this case
      * the maximum value will be implicitly set to the length of the data array
      *
      * max  - the maximum value in the range (optional).
      * min  - the miniumum value in the range (optional).
      * increment - the range increment incremented (optional).
      *
      *
      * returns nothing
      */
      _setValues: function (max, min, increment) {
        var slider = this.element,
            icon   = this.options.icon;

        max       = max || icon.data.length > 0 ? icon.data.length -1 : 0;
        min       = min || 0;
        increment = increment || 1;

        _.each({
          max:max, min:min, increment:increment, value: max
        }, function (value, attr) {
          slider.setAttribute(attr, value);
        });
      },

      /*
      *
      * Listen to the 'change' event emitted by the slider (scale) xul element
      * as the slider value changes
      *
      * event - a blur event
      *
      * returns nothing
      *
      */

      _onMouseUp: function (event) {
        var sliderValue    = parseInt(this.element.value,10),
            snapshot = this.options.icon.getSnapshot(sliderValue);

        WaybackFox.tabUrl(snapshot.url);
      },

      /*
      * Listens to the 'state-change' emitted by the icon widget.
      * Sets the slider range and data when the state:data event is fired;
      * otherwise hides the slider.
      *
      * event - a blur event
      *
      * returns nothing
      *
      */

      _onIconStateChange: function _onIconStateChange (event) {

        if (event.message.currentState === 'data') {
          this._setValues();
          this.show();
        } else {
          dump("hiding slider\n");
          this.hide();
        }
      }
    })
  );
 /*
  * Public:
  * Instantiate a slider element.
  *
  * element - the dom element for the slider
  * options - a set of key value pairs suitable for passing
  *           initialisation options to the slider widget:
  *
  *           icon: a reference to the icon widget
  *
  *
  */


  this.Slider = function Slider(element, options) {
    var instance = SliderTrait.create({
      element: element,
      events: {
        'mouseup':'_onMouseUp'
      },
      options: options
    });

    //initialise EventedObject trait
    instance.initEvents();

    // listen to the events emitted by the icon widget
    // so that the slider will update its value range when new
    // Web Archive data become available, while it will hide when
    // data is not available at all

    if (options.icon) {
      options.icon.on('state-change', _.bind(function (event) {
        this._onIconStateChange(event);
      }, instance));
    }
    return instance;
  };

}).call(WaybackFox.Components, window);
