(function() {

  var onEnterClosed = sinon.spy(),
      onExitOpened = sinon.spy(),
      onClose = sinon.spy();

  var getSpec = function () {
      return function() {
         this.addState('opened', undefined, onExitOpened);
         this.addState('closed', onEnterClosed);
         this.addTransition('close', {from:'opened', to: 'closed'}, onClose);
         this.addTransition('open',  {from:'closed', to: 'opened'});
      };},
      DoorTrait = Trait(
       WaybackFox.Traits.StateMachine,
       Trait({
         id: Trait.required
       })
      ),
     //Pseudo constructor
      Door = function (name) {
        Door.prototype.id = _.uniqueId(name);
        var instance = DoorTrait.create(Door.prototype);
        instance.stateMachine(getSpec());
        return cortex(instance);
      },
      door;

  describe('WaybackFox.Traits.StateMachine', function () {
      it("The initial state should be the one declared first", function () {
        var door = Door('a');
        expect(door.currentState()).toBe('opened');
      });
      it("Should change state when a transition is executed", function () {
        var door = Door('b');
        door.close();
        expect(door.currentState()).toBe('closed');
        door.open();
        expect(door.currentState()).toBe('opened');
      });
      it("Should allow to create multiple instances", function () {
        var door1 = Door('c'), door2 = Door('d');
        door1.close();
        expect(door1.currentState()).toBe('closed');
        expect(door2.currentState()).toBe('opened');
      });
      it("Should bind and call the onEnter and onExit state callbacks", function () {
        var door = Door();
        door.close();
        expect(onExitOpened).toHaveBeenCalled();
        expect(onExitOpened.thisValues[0].currentState).toBeDefined();
        expect(onEnterClosed).toHaveBeenCalled();
        expect(onEnterClosed.thisValues[0].currentState).toBeDefined();
        expect(onClose).toHaveBeenCalled();
        expect(onClose.thisValues[0].currentState).toBeDefined();
      });
      it("Should throw an error if, given the instance's current state, a transition is not possible", function () {
        var door = Door();
        door.close();
        expect(function () { door.close();}).toThrow(new Error(
          "Cannot execute transition 'close', current state is 'closed'"
        ));
      });
  });

}).call(window, WaybackFox);
