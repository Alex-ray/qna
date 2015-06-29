

var questions = [
  { }
]

var questions [{
  question: {
    snippets: 'section:nth-of-type(1) .question span',
    text: [
      {str: 'Hello, '},
      {str: 'What\'s your name?', pauseDelay: 50}
    ],
    form: 'section:nth-of-type(1) form'
  },
  answer: {
    snippets: 'section:nth-of-type(1) .answer span',
    responder: function (event, formEl) {
      var name = formEl.querySelector('input').value.trim();
      return [
        {str: 'It\'s great to meet you '+name+'!'}
      ];
    }
  }
}];


var app = new App(questions);
document.on('DOMContentLoaded', app.start);

function App( fQuestions) {
  var self;

  init();

  self.start = start;

  return self;

  function init() {
    self = {};

    if (fQuestions === undefined) { fQuestions = []; }
  }

  function start () {

  }

}
