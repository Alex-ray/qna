// Javascript support
(function(H){H.className=H.className.replace(/\bno-js\b/,'js')})(document.documentElement);
// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
      method = methods[length];

      // Only stub undefined methods.
      if (!console[method]) {
          console[method] = noop;
      }
  }
})();

document.addEventListener('DOMContentLoaded', start);

var sectionList = [];
var questions   = [];
var callbacks   = [];

function start () {
  sectionList = document.querySelectorAll('#questions section');

  var questionsText = [[
    {str: 'Hello, '},
    {str: 'What\'s your name?', pauseDelay: 50}
  ]];

  var responders = [
    function (event, formEl) {
      event.preventDefault();

      var inputEl = formEl.querySelector('input');
      var name    = inputEl.value.trim();

      inputEl.blur();
      inputEl.classList.remove('is-waiting');

      return [
        {str: 'Hello, '+name+'.'},
        {str: 'It\'s great to meet you!', pauseDelay: 900},
        {str: 'QnA.js is a simple library for Chat like question and answers.', pauseDelay: 900},
        {str: 'Check out the editable example', pauseDelay: 0},
        {str: 'here.', pauseDelay: 0},
        {str: 'or you can visit the project at', pauseDelay: 0},
        {str: 'http://github.com/alex-ray/qna.', pauseDelay: 0},
        {str: 'See you there!'},
        {str: '- Alex'}
      ];
    }
  ];


  for ( var i = 0; i < sectionList.length; i++ ) {

    var sectionEl = sectionList[i];
    var formEl    =  sectionEl.querySelector('form');

    var qList = sectionEl.querySelectorAll('.question .snippet');
    var aList = sectionEl.querySelectorAll('.answer .snippet');

    var next = createNextCallback(i);

    var qOpts = {form: formEl};
    var aOpts = {responder: responders[i]};

    var q = new qna(qList, questionsText[i], qOpts);
    var a = new qna(aList, [], aOpts);

    q.bindAnswer(a, next);
    questions.push(q);

    callbacks[i] = createAskCallback(formEl);
  }

  questions[0].respond(callbacks[0]);
}

function createAskCallback (formInputEl) {
  var inputEl = formInputEl.querySelector('input');
  return function () {
    inputEl.focus();
    inputEl.classList.add('is-waiting');
  };
}

function createNextCallback(index) {
  var nextIndex = index++;

  return function () {
    var nextSectionEl = sectionList[nextIndex];
    var prevSectionEl = sectionList[index];

    var nextQuestion = questions[nextIndex];

    prevSectionEl.classList.remove('active');
    nextSectionEl.classList.add('active');

    nextQuestion.respond(callbacks[nextIndex]);
  };
}
