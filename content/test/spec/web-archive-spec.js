'use strict';
describe('WaybackFox.Components.WebArchive', function () {
  var webArchive = WaybackFox.Components.webArchive,
      getFixture = function () {
        return document.querySelector('#fixture-web-archive');
      },
      webArchiveResponse;


  beforeEach(function () {
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];
    this.xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };


    waitsFor(function () {
      var fixture = getFixture();
      if (fixture && fixture.textContent) {
        return true;
      } else {
        return false;
      }
    }, "retrieve fixture", 5000);

    webArchiveResponse = getFixture().innerHTML;
  });

  afterEach(function () {
    this.xhr.restore();
  });

  it(".fetchSnapshots() should pass some 1400 extracted records to the callback", function () {
    var onData = sinon.spy();
    webArchive.fetchSnapshots('http://www.un.org', onData);
    this.requests[0].respond(200, {'ContentType': 'text/html'}, webArchiveResponse);
    expect(onData).toHaveBeenCalled();
    expect(onData.args[0][0].length).toBeGreaterThan(1400);
  });

});

