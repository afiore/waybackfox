//a dummy trait which is combined to evented object
'use strict';

describe('WaybackFox.Traits.eventedObject', function () {

// unfortunatelly Traits.js and cortex do not seem to play nicely with sinon.js (or the other way around)
// so I cannot use spies, and have to do that manually...
var methodCalls = {
      handleClickCalled:undefined,
      handleClickEventType:undefined,
      handleOtherClickCalled: undefined,
      handleOtherClickEventType: undefined,
      handleOtherClickTarget: undefined,
      handleCustomEventCalled: undefined,
      handleCustomEventEventType: undefined,
      handleCustomEventMessage: undefined
    },
    EventedTrait = Trait.compose(
        WaybackFox.Traits.EventedObject,
        Trait({
          handleClick: function (event) {
            methodCalls.handleClickCalled = true;
            methodCalls.handleClickEventType = event.type;
          },
          handleOtherClick: function (event) {
            methodCalls.handleOtherClickCalled = true;
            methodCalls.handleOtherClickEventType = event.type;
            methodCalls.handleOtherClickTarget = event.target;
          },
          handleCustomEvent: function (event) {
            methodCalls.handleCustomEventCalled = true;
            methodCalls.handleCustomEventMessage = event.message;
          }
        })
    ),
    // pseudo constructor
    //
    // (as traits are meant to be mixed together,
    // they do not provide any initialisation mechianism)

    EventedObject = function (element) {
      EventedObject.prototype.element = element;
      var instance = cortex(EventedTrait.create(EventedObject.prototype));
      //initialisation method
      instance.initEvents();
      return instance;
    },
    instance;

    EventedObject.prototype.events = {
      'click a': 'handleClick',
      'click': 'handleOtherClick',
      'data-available': 'handleCustomEvent'
    };







  beforeEach(function () {
    var element = document.createElement('div');
    element.innerHTML='<a href="#" />';
    element.classList.add('evented-object');
    document.body.appendChild(element);
    instance = EventedObject(element);

  });
  afterEach(function () {
    var element = document.querySelector('div.evented-object');
    document.body.removeChild(element);
    instance = null;

    //cleanUp method calls results
    _.each(methodCalls, function(value, attr) {
      methodCalls[attr] = undefined;
    });
  });



    it("Should bind child elements", function () {
      instance.emitFromChild('a','click');
      expect(methodCalls.handleClickCalled);
      expect(methodCalls.handleOtherClickEventType).toBe('click');
      expect(methodCalls.handleOtherClickTarget.tagName).toBe('A');
    });

    it("Should bind #element when not target is provided", function () {
      instance.emit('click');
      expect(methodCalls.handleOtherClickCalled);
      expect(methodCalls.handleOtherClickEventType).toBe('click');
      expect(methodCalls.handleOtherClickTarget.tagName).toBe('DIV');
    });

    it("Should remove event bindings", function () {
      instance.unsubscribeChild('a','click','handleClick');
      instance.emitFromChild('a','click');
      expect(methodCalls.handleClickCalled).toBe(undefined);
    });
    it("Should also bind custom events and pass a message to the handler function", function () {
      var message = {foo:'bar'};
      instance.emit('data-available', message);
      expect(methodCalls.handleCustomEventCalled);
      expect(methodCalls.handleCustomEventMessage.foo).toBe('bar');
    });
});

