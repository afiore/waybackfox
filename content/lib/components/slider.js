(function (window, undefined) {


  var SliderTrait = Trait.compose(
    WaybackFox.Traits.Optionable,
    WaybackFox.Traits.EventedObject,
    WaybackFox.Traits.Toggable,
    Trait({
      data: Trait.required,

     /*
      * Sets the slider's value range.
      * This is generally intended to be called without parameters; in this case the maximum value
      * will be the length of the data array
      *
      * max  - the maximum value in the range (optional).
      * min  - the miniumum value in the range (optional).
      * increment - the range increment incremented (optional).
      *
      *
      * returns nothing
      */
      _setValues: function (max, min, increment) {
        max       = max || this.data.length;
        min       = min || 0;
        increment = increment || 1;
        this.element.setAttribute('max',max);
        this.element.setAttribute('min',min);
        this.element.setAttribute('increment',increment);
        this.element.setAttribute('value',max);
      },

      /*
      * Public:
      * Updates the internal data array.
      *
      * returns nothing
      *
      */
      setData: function (data) {
        this.data = data;
        this._setValues();
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
        var value    = parseInt(this.element.value,10),
            snapshot = this.data[ value-1 ];

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
        var data = event.message.data;
        dump("state-changed! " + event.message.currentState + "\n");

        if (event.message.currentState === 'data') {
          this.show();
          this.setData(data);
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
      options: options,
      data: []
    });

    //initialise EventedObject trait
    instance.initEvents();

    // listen to the events emitted by the icon widget
    // so that the slider will update its value range when new
    // Web Archive data become available, while it will hide when
    // Web Archive data is not available at all

    if (options.icon) {
      options.icon.on('state-change', _.bind(function (event) {
        this._onIconStateChange(event);
      }, instance));
    }
    return instance;
  };

}).call(WaybackFox.Components, window);
