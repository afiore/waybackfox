(function (undefined) {
/**
 * Simple trait providing a set of helper methods for toggling DOM 
 * elements by mainipulating the style.display property
 *
 */
  this.Toggable = Trait({


   /*
    * Ensures that an element is visible by setting its style.display to an empty string
    * (I am sure this can be done in a better way, but will do for now)
    *
    * returns nothing
    */
    show: function () {
      if (this.element instanceof XULElement) {
        this.element.hidden = false;
      } else {
        this.element.style.display = '';
      }

    },

   /*
    * Ensures that an element is not visible by setting its style.display property to 'none'
    *
    * returns nothing
    */
    hide: function () {
      if (this.element instanceof XULElement) {
        this.element.hidden = true;
      } else {
        this.element.style.display = 'none';
      }

    },

    /*
    * Boolean test to verify whether or not an element is visible
    *
    * returns nothing
    *
    */
    isVisible: function () {
      if (this.element instanceof XULElement) {
        return !this.element.hidden;
      } else {
        return this.element.style.display !== 'none';
      }
    },

   /*
    * Toggles the element's visibility.
    *
    * returns nothing
    */

    toggle: function () {
      if (this.element instanceof XULElement) {
        this.element.hidden = !this.element.hidden;
      } else {

        if (this.element.display === 'none') {
          this.element.show();
        } else {
          this.element.hide();
        }
      }
    }
  });


}).call(WaybackFox.Traits);
