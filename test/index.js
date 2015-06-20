'use strict';

// Load fixture
var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/';
jasmine.getFixtures().preload(fixture);

var qna = require('../source/qna.js');

describe("qna(elem, nodeList, Array, [, opts] )", function () {
  var elem;

  var qElem;
  var aElem;
  var qElemList;
  var aElemList;

  var snippets;
  var clock;

  var defaultOpts;

  beforeEach(function (){
    loadFixtures(fixture);
    elem = $('.qna')[0];

    qElem = elem.querySelector('.q');
    aElem = elem.querySelector('.a');

    qElemList = qElem.querySelectorAll('span');
    aElemList = aElem.querySelectorAll('span');

    for ( var i = 0 ; i < qElemList.length ; i++){
      qElemList[i].innerHTML = "";
      aElemList[i].innerHTML = "";
    }

    snippets = [
      {str: 'foo'},
      {str: 'bar'}
    ];

    defaultOpts = {
      pauseDelay: 750,
      typeSpeed: 50
    };

    jasmine.clock().install();
    clock = jasmine.clock();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });


  describe('ask([, cb])', function () {
    it('asks question at default speed', function () {
      var question = new qna('.q', 'span', snippets );
      question.ask();

      for ( var i = 0; i < snippets.length; i++ ) {
        expectContents(qElemList[i], '');
      }

      for ( var i = 0; i < snippets.length; i++ ) {
        expectTyping(qElemList[i], snippets[i].str, defaultOpts.typeSpeed);
        clock.tick(defaultOpts.pauseDelay);
      }

    });

    it('asks question at given speed', function () {
      var speedSnippets = snippets;

      for ( var i = 0; i < speedSnippets.length; i++)  {
        speedSnippets[i].typeSpeed = 100;
      }

      var question = new qna('.q', 'span', speedSnippets );
      question.ask();

      for ( var i = 0; i < speedSnippets.length; i++ ) {
        expectTyping(qElemList[i], snippets[i].str, snippets[i].typeSpeed);
        clock.tick(defaultOpts.pauseDelay);
      }
    });

    it('delays snippet at default pause length', function () {
      var question = new qna('.q', 'span', snippets );
      question.ask();
      for ( var i = 0; i < snippets.length; i++ ) {
        expectTyping(qElemList[i], snippets[i].str, defaultOpts.typeSpeed);
        clock.tick(defaultOpts.pauseDelay);
      }
    });

    it('delays snippet at given default length', function () {
      var delayedSnippets = snippets;

      for (var i = 0; i < delayedSnippets.length; i++) {
        delayedSnippets[i].pauseDelay = 400;
      }

      var question = new qna('.q', 'span', delayedSnippets );
      question.ask();

      for ( var i = 0; i < delayedSnippets.length; i++ ) {
        expectTyping(qElemList[i], delayedSnippets[i].str, defaultOpts.typeSpeed);
        clock.tick(delayedSnippets[i].pauseDelay);
      }
    });

  });

  function expectContents(el, str){
    expect(el.innerHTML).toBe(str);
  }


  function expectTyping (el, str, speed, delay) {
    var i = -1;
    var len = str.length;
    while (++i < len ) {
      var curr = el.innerHTML;
      clock.tick(speed);
      expectContents(el, curr+str[i])
    }
  }
});
