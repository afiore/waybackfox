(function (window, undefined) {

  // as the panel xul element already provides a state attribute
  // here we are not mixing the StateMachine trait in..

  var PanelTrait = Trait.compose(
    WaybackFox.Traits.Optionable,
    WaybackFox.Traits.EventedObject,
    Trait({
      // We are not using WaybackFox.Traits.Toggable as the XUL panel
      // has its own methods. Perhaps these could be merged into WaybackFox.Traits.Toggable

      hide: function () {
        var panel = this.element;
        panel.hidePopup();
      },

      show: function () {
        var panel   = this.element,
            options = this.options;

        if (panel.hidden) {
          panel.hidden = false;
        }

        panel.openPopup.apply(panel, [
          options.icon.element,
          options.panelPosition || 'before_start',
          options.panelX        || 0,
          options.panelY        || 0
        ]);
      },

      isVisible: function () {
        return _.include([
          'open', 'showing'
        ], this.element.state);
      },


      /*
      * Sets the panel label displaying the snapshot count
      *
      * count - the number of snapshots
      *
      * returns nothing.
      */
      setSnapshotCount: function (count) {
        var plural = count > 1  ? 's ' : ' ';
        this.element.querySelector("#wb-snapshot-count").
          textContent = count + " snapshot" + plural + "found";
      },


      /*
      * Sets the panel label displaying the date of the selected snapshot
      *
      * date - a date object
      *
      * returns nothing
      */

      setDate: function (date) {
        var content = date && date.getTime ?
          _.template('{{day}}/{{month}}/{{year}}', {
            day: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear()
          }) :

          'Live web';

        this.element.querySelector('#wb-snapshot-date').
          textContent = content;
      },

      /*
      * Listens to state-change events emitted by the main icon widget.
      * Show panel when data is available.
      *
      * event - an event emitted by the WaybackFox.Components.Icon instance
      */

      _onIconStateChange: function (event) {
        var icon = this.options.icon;

        if (event.message.currentState === 'data') {
          this.show();
          this.setSnapshotCount(icon.data.length);
          this.setDate();


        } else {
          this.hide();
        }

      },


      /*
      * Listens to changes in the slider <scale> input.
      * Retrieves the snapshot data from the Icon instance using the slider value as index
      * and displays the data in the panel
      *
      * event - a dom blur
      *
      */
      _onSliderChange: function (event) {
        var icon     = this.options.icon,
            snapshot = icon.getSnapshot(event.target.value);

        this.setDate(snapshot.date);
      }


    })
  );



  /**
   * Pseduo-constructor for the panel displaying snapshot information
   * The panel will be bound to the main icon widget and displayed when
   * this is in the 'data' and the 'no-data' state.
   *
   * element - the dom element that will be used as a panel
   * options - a map of key values
   *           icon:   an instance of WaybackFox.Components.Icon
   *           slider: an instance of WaybackFox.Components.Slider
   *
   *
   */

  function Panel (element, options) {
    var icon     = options.icon,
        slider   = options.slider,
        instance = PanelTrait.create({
          events: {
            'click #wb-popup-close': 'hide'
          },
          element: element,
          options: options
        });

    instance.initEvents();

    //bind icon events so that the panel is shown/hidden when data is available
    icon.on('state-change', _.bind(function (event) {
      this._onIconStateChange(event);
    }, instance));

    //bind slider's change event so that the panel will display snapshot information
    slider.on('change', _.bind(function (event) {
      this._onSliderChange(event);
    }, instance));

    return instance;
  }

  this.Panel = Panel;
}).call(WaybackFox.Components, window);
