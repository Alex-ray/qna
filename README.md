# qna.js [![Build Status](https://img.shields.io/travis/Alex-ray/qna.svg?branch=master&style=flat)](https://travis-ci.org/Alex-ray/qna) [![Coverage Status](https://img.shields.io/coveralls/Alex-ray/qna.svg?style=flat)](https://coveralls.io/r/Alex-ray/qna)

> Chat like questions and answers

## Usage

#### [Editable Example](http://jsfiddle.net/57xon9ov/8/)
```html
<body>
  <p class="question">
      <span class="snippet"></span>
      <span class="snippet"></span>
  </p>

	<form id="question-form" name="question">
			<input name="name" type="text" placeholder="Your Name">
	</form>

  <p class="answer">
      <span class="answer-snippet"></span>
      <span class="answer-snippet"></span>
  </p>

	<script src="dist/qna.min.js"></script>
	<script>

	document.addEventListener('DOMContentLoaded', function() {

		var questionText = [
	    {str: 'Hello, '},
      {str: 'What\'s your name?', pauseDelay: 50}
    ];

    var defaultAnswerText = [
    	{str: 'It\'s, great to meet you'}
    ];

	  var answerOpts   = { responder: answerResponder };
	  var questionOpts = { form: '#question-form' };

	  var answer   = new qna('.answer .snippet', defaultAnswerText, answerOpts);
		var question = new qna('.question .snippet', questionText, questionOpts);

		question.bindAnswer(answer) ;
		question.respond( );

		function answerResponder ( event, form ) {
			event.preventDefault();

			var input = form.querySelector('input');
			var name = input.value.trim();

			input.blur();

			return [
				{str: 'Hello, '+name},
				{str: 'It\'s, great to meet you'}
			];
		}
	});

	</script>
</body>
```


## Api

In the browser, `qna` is a global variable. In Node, do:

```js
var qna = require('qna');
```

#### var q = new qna(nodeSelection, snippets [, opts]);

This will initialize a qna instance on the documents `nodeSelection` and corresponding `snippets` with the given options.

- `nodeSelection`    &mdash; A DOM Node List or a query selector string (passed into `document.querySelectorAll()`).
- `snippets`         &mdash; An ordered Array of `snippetObjects`.
	- `snippetObject`   &mdash; An Object literal with the following properties
		- `str`          &mdash; A String (required)
		- `pauseDelay`   &mdash; A Number representing the delay before typing in milliseconds (optional, default 750)
		- `typeSpeed`    &mdash; A Number representing the typing speed in milliseconds (optional, default 50)
- `opts`             &mdash;

Key | Description | Value
:--|:--|:--
`responder` | A function for generating responses to form submissions | A function that returns a `snippetObject` Array
`form` | The form element to listen for a submit event. | A DOM Element or a selector String
`answer` | The answer to the question | An instance on qna

#### q.respond([callback, args])

Type the `snippets` to the corresponding `nodeSelection` list defined at initialization with an optional callback that will be called after all the snippets have been typed to the screen.

If a responder was specified at initialization the additional arguments will be passed through to the responder function. If the responder returns a `snippetObject` it will use those `snippetObjects` to type to the corresponding `nodeSelection`

#### q.bindAnswer(a, [callback])

`a` is a instance of qna.

`callback` is a function that will be called after the questions form has been submitted.

Assign an answer and optional callback to a question.

The answers `a.respond` method will be triggered when the questions form is submitted with that events parameters (formEvent, formEl).

## Installation

Install via [npm](https://npmjs.com):

```
$ npm i --save qna
```

Install via [bower](http://bower.io):

```
$ bower i --save alex-ray/qna
```

## License

[MIT](LICENSE)
