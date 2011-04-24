(function (window, undefined) {
 'use strict';

 /*
  * A dictionary like object listing the type of events supported 
  * in Geko2 and organised by event family.
  *
  */
  var eventFamilies = {
    //DOM Level2
    'MouseEvents': "click dblclick mousedown mouseup mouseover mousemove mouseout".split(/[^a-z]/i),
    'MutationEvents': "DOMSubtreeModified DOMNodeInserted DOMNodeRemoved DOMNodeRemovedFromDocument DOMNodeInsertedIntoDocument DOMAttrModified DOMCharacterDataModified".split(/[^a-z]/i),
    'HTMLEvents': "load unload abort error select change submit reset focus blur resize scroll".split(/[^a-z]/i)
    //todo: complete this
    },

   /*
    * An object mapping event handler closures to method names
    *   methodName: Function(){}
    */
    activeHandlers = {},

   /*
    * Utility method allowing to retrieve event handlers by method name.
    *
    * Examples
    *   var handler = getHandler('clickHandler');
    *   element.removeEventListener(handler, true);
    *
    * method - the name of an active event handler (mast have been registred through the subscribe/subscribeChild instance methods).
    *
    * Returns an event handler function
    */
    getHandler = function (method) {
      if (method in activeHandlers) {
        return activeHandlers[method];
      }
    },
   /* jQuery like $ utility function which allows to accept arguments either as dom elements or as selectors
    *
    * element - a dom element or a string selector
    * context - context element within which the selector should be evaluated.
    *
    * Returns a DOM element or undefined;
    */
    el = function (element, context) {
      context = context || document;
      if (element && element.tagName) {
        return el;
      } else {
        return context.querySelector(element);
      }
    };


 /**
  * A trait providing methods for binding, broadcasting and subscribing both already defined and custom events.
  *
  * Adapted from OKNF's Annotator project's Delegator class
  * https://github.com/okfn/annotator/blob/master/src/class.coffee
  *
  */

var EventedObject = Trait({
  /*
   * The main DOM element associated to the class/entity using this trait.
   *
   */
  element: Trait.required,
  /**
   * An object consisting of 'event + element-selector' as keys
   * and their respective method name as values.
   *
   * Note: element selectors are evaluated against the element context
   *
   * example:
   *   "click button.submit-email": '_submitEmail',
   *   "mousenter div.activeArea": '_highlightArea'
   *
   */
  events: Trait.required,

  /*
   * Binds all the dom events defined in the #events map keys to the methods assigned as map values.
   *
   * Note:
   * As this function also acts as an initialisation method, the _setAliases method is called here.
   *
   *
   * Returns nothing
   */
   _addEvents: function () {
     var self = this;
     _.each(this.events, function (methodName, eventSelector) {

       var eventSelectorChunks = eventSelector.split(' '),
           event = eventSelectorChunks.shift(),
           elementSelector = eventSelectorChunks.join(' '),
           //if element selector is empty, use this.element as target
           element = _.isEmpty(elementSelector) ?
             self.element :
           //otherwise the selector must be a child of the main element
             el(elementSelector, self.element);

       //todo: consider throwing an error here if no element can be found
       self._addEvent(element, event, methodName);
     });

     this._aliasMethods();
   },

   /*
    * Binds a DOM element's event to a callback function defined within the instance object.
    * For each method bound, a reference is kept in the 'activeHandlers' variable (see above).
    *
    * target - the event target element
    * event  - The event to listen for
    * method - The name of the method to be bound to the element event
    *
    */

  _addEvent: function (target, event, method) {

    var closure = _.bind(function () {
        this[method].apply(this, arguments);
      }, this);

    if (this._isCustomEvent(event)) {
      this.subscribe(event, closure);

    } else {
      console.info('adding the "'+method+'" listener to '+target.tagName);
      target.addEventListener(event, closure, true);
    }

    // preserve a reference to the closure in the 'activeHandlers' map
    activeHandlers[method] = closure;
  },

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
   _detectEventFamily: function (eventType) {
     var eventFamily;
     for (eventFamily in eventFamilies) {
       if (eventFamilies[eventFamily].indexOf(eventType) > -1) {
         return eventFamily;
       }
     }
   },


 /* Public
  *
  * Dispatches an event to the object's element.
  *
  * This is meant to be used for custom events that are not targeted to child elements of the current object.
  *
  * eventType   - A string specifying the event type (e.g. click, mousenter, change, etc).
  * message     - An object to suitable pass data to custom event listeners (optional)
  * bubbles     - A boolean specifying whether the event will bubble up through the dom or not (optional)
  * cancellable - A boolean specifying whether the event can be cancelled or not (optional)
  *
  * Returns nothing.
  */
  publish: function (eventType, message, bubbles, cancellable) {
    var event;

    bubbles = bubbles || true;
    cancellable = cancellable || true;
    event= this._createEvent(eventType, message, bubbles, cancellable);
    this.element.dispatchEvent(event);
  },

  /**
   * Dispatches an event to a child node element
   *
   * element - a DOM element or a selector.
   * event   - the event
   * bubbles     - A boolean specifying whether the event will bubble up through the dom or not (optional)
   * cancellable - A boolean specifying whether the event can be cancelled or not (optional)
   *
   */
    publishFromChild: function (element, eventType, bubbles, cancellable) {
      var event = this._createEvent(eventType, null, bubbles, cancellable),
          child = el(element, this.element);

      if (!child || !child.tagName) {
        throw new Error('Empty or invalid child child '+child);
      }
      bubbles = bubbles || true;
      cancellable = cancellable || true;
      child.dispatchEvent(event);
    },

  /**
   *
   *
   * Utility method for creating events, being this either already defined DOM/UI events or custom ones.
   *
   *
   * eventType - a string identifying the type of event.
   * message - a map of key values to be added as attribute to the event object (optional).
   * bubbles     - A boolean specifying whether the event will bubble up through the dom or not (optional)
   * cancellable - A boolean specifying whether the event can be cancelled or not (optional)
   *
   * Returns the event object.
   *
   */

    _createEvent: function (eventType, message, bubbles, cancellable) {
      var eventClass = this._detectEventFamily(eventType) || 'Events',
          event = document.createEvent(eventClass);

      bubbles = bubbles || true;
      cancellable = cancellable || true;
      event.initEvent(eventType, bubbles, cancellable);
      if (message) {
        event.message = message;
      }
      return event;
    },


   /* Public
    *
    * Subscribes to an event emitted by an object.
    * (Wrapper around addEventListener)
    *
    * event      - The event name
    * useCapture - ...
    * isTrusted  - A boolean specifying whether the event emitted can be untrusted (optional)
    *
    * Returns nothing.
    */
    subscribe: function (event, callback, useCapture, isTrusted) {
      useCapture = useCapture || true;
      isTrusted = isTrusted || false;
      this.element.addEventListener(event, callback, useCapture, isTrusted);
    },

    /**
     * Unregister an event listener
     *
     * event      - the event name
     * method - the name of the method to be unregistered
     * child      - used internally by unsubscribeChild (optional)
     *
     * returns nothing
     */
     unsubscribe: function (event, method, useCapture, child) {
       var activeHandler = getHandler(method),
           element = child || document;

       useCapture = useCapture || true;
       element.removeEventListener(event, activeHandler, useCapture);

       // remove entry from activeHandlers
       if (method in activeHandlers) {
         delete activeHandlers[method];
       }
     },

    /**
     * Unregister an event listener in a child of the main instance element.
     *
     * selector   - the child element selector
     * event      - the event name
     * methodName - the name of the method to be unregistered
     *
     * returns nothing
     */
     unsubscribeChild: function (selector, event, methodName, useCapture) {
      var child = el(selector, this.element);
      useCapture = useCapture || false;

      if (!child || !child.tagName) {
        throw new Error('Empty or invalid child element '+child);
      }

       this.unsubscribe(event, methodName, useCapture, child);
     },

    /*
     * Aliases publish/subscribe methods to emit/on
     *
     * Returns nothing
     */
    _aliasMethods: function () {
      this.emit = this.publish;
      this.emitFromChild = this.publishFromChild;
      this.on = this.subscribe;
    },

    /*
     * Check whether this event is user-defined or is instead a DOM/XUL event.
     *
     * event - an event name
     *
     * Returns a boolean value.
     */
    _isCustomEvent: function (event) {
      return _.isUndefined(this._detectEventFamily(event));
    }

  });
  //export the trait
  this.EventedObject = EventedObject;

}).call(WaybackFox.Traits, window);
