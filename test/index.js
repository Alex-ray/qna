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
  var formElem;
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

    formElem = elem.querySelector('form');

    qElemList = qElem.querySelectorAll('span');
    aElemList = aElem.querySelectorAll('span');

    for ( var i = 0 ; i < qElemList.length ; i++){
      qElemList[i].innerHTML = "";
      aElemList[i].innerHTML = "";
    }

    this.snippets = [
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


  describe('ask([cb])', function () {
    it('asks question at default type speed and pause delay', function () {
      var question = new qna('.q span', this.snippets);
      question.respond();
      expectAsk(qElemList, this.snippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
    });

    it('asks question at given type speed and pause delay', function (done) {
      var speed = 100;
      var delay = 400;

      for ( var i = 0; i < this.snippets.length; i++)  {
        this.snippets[i].typeSpeed = speed;
        this.snippets[i].pauseDelay = delay;
      }

      var question = new qna('.q span', this.snippets);
      question.respond(done);
      expectAsk(qElemList, this.snippets, speed, delay);
    });

    it('calls callback after question has been asked', function (done) {
          var question = new qna('.q span', this.snippets);
          question.respond(done);
          expectAsk(qElemList, this.snippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
    });

    it('should not answer if no answer is given', function (done) {

      var responderSnippets = [
        {str: 'responder foo'},
        {str: 'responder bar'}
      ];
      var qOpts = {
        form: formElem,
        responder: function (event){
          if (event !== undefined) {
            event.stopPropagation();
            return responderSnippets;
          }
        }
      };

      var question = new qna(qElemList, this.snippets, qOpts);

      question.respond(function (){
        submitForm(formElem);
        expectAsk(qElemList, responderSnippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
        done();
      });

      expectAsk(qElemList, this.snippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
    });


    it('should not select nodes if node elements are passed in', function (done){
      var spanElList = qElem.querySelectorAll('span');
      var opts = {container: qElem};
      var question = new qna(spanElList, snippets, opts);
      question.respond(done);
      expectAsk(qElemList, this.snippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
    });

  });

  describe('answer(a,[cb])', function () {
    it('answer question when form is submitted', function (done) {

      var _this = this;

      var qOpts = {form: formElem};
      var aOpts = {
        responder: function(event) {
          event.preventDefault();
          return _this.snippets;
        }
      };

      var answer   = new qna(aElemList, this.snippets, aOpts);
      var question = new qna(qElemList, this.snippets, qOpts);

      question.bindAnswer(answer, done);

      question.respond(function(){
        submitForm(formElem);
        expectAsk(aElemList, _this.snippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
      });

      expectAsk(qElemList, this.snippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
    });

    it('answers question with given responder', function (done) {
      var answerSnippets = [
        {str: 'answer foo'},
        {str: 'answer bar'}
      ];

      var qOpts = { form: formElem };

      var aOpts = {
        responder: function (event) {
            event.preventDefault();
            return answerSnippets;
        }
      };

      var answer   = new qna('.a span', snippets, aOpts);
      var question = new qna('.q span', snippets, qOpts);

      question.bindAnswer(answer, done);

      question.respond(function (){
        submitForm(formElem)
        expectAsk(aElemList, answerSnippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
      });
      expectAsk(qElemList, this.snippets, defaultOpts.typeSpeed, defaultOpts.pauseDelay);
    });
  });


  function submitForm(el){
    var button = el.ownerDocument.createElement('input');
    button.type = 'submit';
    el.appendChild(button).click();
    el.removeChild(button);
  }

  function expectAsk(elList, snippets, speed, delay) {
    for ( var i = 0; i < snippets.length; i++ ) {
      expectTyping(elList[i], snippets[i].str, speed);
      clock.tick(delay);
    }
  }

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
