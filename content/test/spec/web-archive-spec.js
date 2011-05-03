'use strict';
describe('WaybackFox.Components.WebArchive', function () {
  describe("#fetchSnapshots", function () {
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

    it("Should pass some 1400 extracted records to the callback", function () {
      var onData = sinon.spy();
      webArchive.fetchSnapshots('http://www.un.org', onData);
      this.requests[0].respond(200, {'ContentType': 'text/html'}, webArchiveResponse);
      expect(onData).toHaveBeenCalled();
      expect(onData.args[0][0].length).toBeGreaterThan(1400);
      expect(onData.args[0][1]).toBeUndefined();
    });
    it("Should pass an error to the callback when web.archive.org's response status is not 200", function () {
      var onData = sinon.spy(), requests = this.requests;
      webArchive.fetchSnapshots('http://not-archived.net/dsdsds', onData);
      _.times(2, function(index) {
        requests[index].respond(500, {'ContentType': 'text/html'}, "some error text");
      });

      expect(onData).toHaveBeenCalled();
      expect(onData.args[0][1] instanceof Error).toBeTruthy();
    });

    it("Should make a second attempt at retrieving records by toggling the .www prefix", function () {
      var requests = this.requests;
      webArchive.fetchSnapshots('http://mypage.net', function () {});
      _.times(2, function(index) {
        requests[index].respond(500, {'ContentType': 'text/html'}, "");
      });

      expect(requests[1].url).toMatch(/http:\/\/www\.mypage.net$/);
    });
  });
});

