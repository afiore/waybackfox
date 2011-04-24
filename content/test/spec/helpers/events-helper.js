/*
 * Helper methods for creating and dispatching DOM events
 *
 */

(function () {

  //module namespace
  this.Events = {};
 /*
  * A dictionary like object listing the type of events supported in Geko2 organised by event macro type.
  *
  */
  var eventFamilies = {
    //DOM Level2
    'MouseEvents': "click dblclick mousedown mouseup mouseover mousemove mouseout".split(/[^a-z]/i),
    'MutationEvents': "DOMSubtreeModified DOMNodeInserted DOMNodeRemoved DOMNodeRemovedFromDocument DOMNodeInsertedIntoDocument DOMAttrModified DOMCharacterDataModified".split(/[^a-z]/i),
    'HTMLEvents': "load unload abort error select change submit reset focus blur resize scroll".split(/[^a-z]/i)
  };

  /*
  * Identifies the event family from an event type string
  *
  * eventType - an event type.
  *
  * Examples
  *   var eventFamily = detectEventFamily('DOMCharacterDataModified');
  *   var event = document.createEvent(eventClass);
  *   event.initEvent(myElement, true, true);
  *
  * Returns a string identifying the event macro type
  */
  function detectEventFamily (eventType) {
    for (eventFamily in eventFamilies) {
      if (eventFamilies[eventFamily].indexOf(eventType) > -1) {
        return eventFamily;
      }
    }
  }



 /*
  * Wrapper for the 'event.initEvent' function
  *
  * eventType   - A string specifying the event type (e.g. click, mousenter, change, etc).
  * message     - An object to suitable pass data to custom event listeners (optional)
  * bubbles     - A boolean specifying whether the event will bubble up through the dom or not (optional)
  * cancellable - A boolean specifying whether the event can be cancelled or not (optional)
  *
  */
  function trigger(eventType, message, bubbles, cancellable) {
    var eventClass = detectEventFamily(eventType),
        event = document.createEvent(eventClass);

    bubbles = bubbles || true;
    cancellable = cancellable || true;
    event.initEvent(eventType, bubbles, cancellable);
    if (message) {
      event.message = message;
    }
    this.element.dispatchEvent(event);
  }

  this.Events.trigger = trigger;

}).call(WaybackFox.SpecHelpers);
