'use strict';
describe('WaybackFox.Components.Panel', function () {
  var Icon = WaybackFox.Components.Icon,
      iconInstance,
      iconElement,
      Slider = WaybackFox.Components.Slider,
      sliderInstance,
      sliderElement,
      Panel = WaybackFox.Components.Panel,
      panelInstance,
      panelElement;

  beforeEach(function () {

    var hideButton = document.createElement('img');
    hideButton.setAttribute('id', 'wb-popup-close');

    //create dom elements and append them to the document
    iconElement = document.createElement('img');
    sliderElement = document.createElement('input');
    sliderElement.setAttribute('type','range');
    panelElement  = document.createElement('div');
    panelElement.appendChild(hideButton);
    _.each([iconElement, sliderElement, panelElement], function (element) {
      document.body.appendChild(element);
    });

    iconInstance = Icon(iconElement);

    sliderInstance = Slider(sliderElement, {
      icon: iconInstance
    });

    panelInstance = Panel(panelElement, {
      icon: iconInstance,
      slider: sliderInstance
    });

    sinon.stub(panelInstance,'show');
    sinon.stub(panelInstance,'setSnapshotCount');
    sinon.stub(panelInstance,'setDate');

  });

  afterEach(function () {
    _.each([iconElement, sliderElement, panelElement], function (element) {
      document.body.removeChild(element);
    });
  });

  it("Should call #show() and #setSnapshotCount() when WaybackFox.Components.Icon is in the 'data' state", function () {
    iconInstance.activate();
    iconInstance.showData();
    expect(panelInstance.show).toHaveBeenCalledOnce();
    expect(panelInstance.setSnapshotCount).toHaveBeenCalledOnce();
  });


  it("Should call #setDate when the slider value changes", function () {
    iconInstance.activate();
    iconInstance.data = [{date: undefined}, {date: undefined}];
    iconInstance.showData();
    _.times(2, function (n) {
      sliderInstance.element.value = n;
      sliderInstance.emit('change');
    });
    expect(panelInstance.setDate).toHaveBeenCalledThrice();
  });
});
