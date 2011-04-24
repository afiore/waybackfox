//a dummy trait which is combined to evented object
var EventedTrait = Trait(
        WaybackFox.Traits.EventedObject,
        Trait({
          element: Trait.required,
          events: {
            'click a': 'handleClick',
            'click': 'handleOtherClick',
            'data-available': 'handleCustomEvent'
          },
          handleClick: function (event) {
            console.info('handling click');
          },
          handleOtherClick: function(event) {
            console.info('handling other click');
          },
          handleCustomEvent: function (event) {}
        })
    ),
    // pseudo constructor
    //
    // (as traits are meant to be mixed together,
    // they do not provide any initialisation mechianism)

    EventedObject = function (element) {
      var instance = EventedTrait.create({
        "element": element
      });

      //initialisation method
      instance._addEvents();
      return instance;
    },
    instance;



beforeEach(function () {
  var element = document.createElement('div');
  element.innerHTML='<a href="#" />';
  element.classList.add('evented-object');

  document.body.appendChild(element);
  instance = EventedObject(element);

  sinon.spy(instance,'handleClick');
  sinon.spy(instance,'handleOtherClick');
  sinon.spy(instance, 'handleCustomEvent');

});

afterEach(function () {
  var element = document.querySelector('div.evented-object');
  document.body.removeChild(element);
  instance = null;
});


describe('WaybackFox.Traits.eventedObject', function () {
    it("Should bind child elements", function () {
      instance.emitFromChild('a','click');
      expect(instance.handleClick).toHaveBeenCalled();
      expect(instance.handleClick.args[0][0].type).toBe('click');
      expect(instance.handleClick.args[0][0].target.tagName).toBe('A');
    });

    it("Should bind #element when not target is provided", function () {
      instance.emit('click');
      expect(instance.handleOtherClick).toHaveBeenCalled();
      expect(instance.handleOtherClick.args[0][0].type).toBe('click');
      expect(instance.handleOtherClick.args[0][0].target.tagName).toBe('DIV');
    });

    it("Should remove event bindings", function () {
      instance.unsubscribeChild('a','click','handleClick');
      instance.emitFromChild('a','click');
      expect(instance.handleClick).not.toHaveBeenCalled();
    });

    it("Should also bind custom events and pass a message to the handler function", function () {
      var message = {foo:'bar'};
      instance.emit('data-available', message);
      expect(instance.handleCustomEvent).toHaveBeenCalled();
      expect(instance.handleCustomEvent.args[0][0].message.foo).toBe('bar');
    });
});

