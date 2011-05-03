'use strict';
describe('WaybackFox.Components.Slider', function () {
  var Components = WaybackFox.Components,
      sliderElement = document.createElement("input"),
      slider,
      icon;

  sliderElement.setAttribute('type',"range");

  beforeEach(function () {
    document.body.appendChild(sliderElement);
    icon   = Components.Icon(document.createElement('img'));
    slider = Components.Slider(sliderElement, {icon: icon});
    slider.hide();
  });

  afterEach(function () {
    document.body.removeChild(sliderElement);
  });

  it("Should be hidden when icon is loading, has no data, or is idle", function () {
    icon.activate();
    sinon.spy(slider,'hide');
    icon.deactivate();
    expect(slider.hide).toHaveBeenCalled();
    expect(slider.isVisible()).toBeFalsy();
  });

  it("Should be visible when icon has data", function () {
    // note: a first state-change event should be fired on initialisation..
    // unfortunately it is not possible to bind to it as bindings are defined
    // in the Slider() pseudo constructor, after the object is instantiated.
    sinon.spy(slider,'show');
    sinon.spy(slider,'hide');
    icon.activate();
    icon.showData();
    expect(slider.show).toHaveBeenCalledOnce();
    expect(slider.isVisible()).toBeTruthy();
  });

});
