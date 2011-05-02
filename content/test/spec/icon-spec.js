'use strict';
describe('WaybackFox.Components.Icon', function () {
  var iconElement = document.createElement('img'), //this is a XUL image element, but we are mocking it here :)
      Icon = WaybackFox.Components.Icon,
      iconInstance;

  beforeEach(function () {
    iconElement.setAttribute("src","foo.ico");
    document.body.appendChild(iconElement);
    iconInstance = Icon(iconElement);
  });

  afterEach(function () {
    document.body.removeChild(iconElement);
  });

  it("#element.src should reflect the icon state", function () {
    expect(iconInstance.element.getAttribute('src')).toMatch(/idle\.ico$/);
    iconInstance.activate();
    expect(iconInstance.element.getAttribute("src")).toMatch(/active\.ico$/);
  });

  it("should emit an event when a transaction takes place", function () {
    var onActivate = sinon.spy(),
        onData     = sinon.spy();

    iconInstance.on('state:active', onActivate);
    iconInstance.on('state:data', onData);
    iconInstance.activate();
    iconInstance.showData();
    expect(onActivate).toHaveBeenCalled();
    expect(onData).toHaveBeenCalled();
  });
});

