'use strict';


// Load fixture
var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/';
jasmine.getFixtures().preload(fixture);


var qna = require('./index.js');


describe("qna(elem, nodeList, Array, [, opts] )", function () {
  var elem;

  var qElem;
  var aElem;
  var qElemList;
  var aElemList;

  var snippets;
  var clock;

  beforeEach(function (){
    loadFixtures(fixture);
    elem = $('.qna')[0];

    qElem = elem.querySelector('.q');
    aElem = elem.querySelector('.a');

    qElemList = qElem.querySelectorAll('span');
    aElemList = aElem.querySelectorAll('span');

    snippets = [
      {str: 'foo'},
      {str: 'bar'}
    ];

    jasmine.clock().install();
    clock = jasmine.clock();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });


  describe('ask([, cb])', function () {
    it('asks question at default speed', function () {
      qna(qElem, 'span', snippets );
      qna.ask();

      for ( var i = 0; i < snippets.length; i++ ) {
        expectContents(qElemList[i], snippets[i]);
      }
    });
  });

  function expectContents(el, str){
    expect(el.innerHTML).toBe(str);
  }


});
