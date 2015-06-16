(function(root){
  'use strict';

  function qna(container, snippetNodes, snippets, options ) {
    var self = { };

    // DOM Elements
    var fContainerNode;
    var fSnippetNodes;
    var fFormNode;

    var fSnippets;
    var fResponder;
    var fAnswer;
    var fAnswerCallback;

    init( );

    // Interface
    self.ask     = ask;
    self.respond = respond;
    self.answer  = answer;

    return self;

    function init ( ) {

      options = options || { };

      fContainerNode = getNode(document, container);
      fSnippetNodes  = getNodes(fContainerNode, snippetNodes);

      fSnippets  = snippets;

      fResponder = options.responder;
      fFormNode  = getNode(fContainerNode, options.form);
      fAnswer    = options.answer;

      if (fFormNode !== undefined && fFormNode !== null) {
        captureFormEvent(fFormNode, answerOrRespond);
      }

    }

    // Public Methods

    function ask ( callback ) {

      var nodes    = Array.prototype.slice.call(fSnippetNodes);
      var snippets = Array.prototype.slice.call(fSnippets);

      clearNodes();

      type(nodes, snippets, callback);
    }

    function respond (callback) {
      var args     = Array.prototype.slice.call(arguments, 1);

      if (fResponder !== undefined) {
        fSnippets = fResponder.apply(this, args);
      }

      fSnippets = response;
      self.ask(callback);
    }

    function answer (answerInstance, answerCallback) {
      fAnswer = answerInstance;
      fAnswerCallback = answerCallback;
    }

    // Private Methods    
    function clearNodes ( ) {
      for ( var i = 0; i < fSnippetNodes.length; i++) {
        var node = fSnippetNodes[i];
        var m = malarkey(node);
        m.clear();
      }
    }

    function type (nodes, snippets, callback) {

      if ( nodes.length === 0 || snippets.length === 0 ) { 
        if (callback !== undefined ) { callback(); }
        return; 
      } 

      var node    = nodes.shift();
      var snippet = snippets.shift();

      var options = { };

      options.pauseDelay = snippet.pauseDelay || 750;
      options.typeSpeed  = snippet.typeSpeed  || 50;

      var next = function () {
        type(nodes, snippets, callback);
      };

      var addIsTypingClass = function (el) {
        el.classList.add('is-typing');
          this();
      };

      var removeIsTypingClass = function (el) {
        el.classList.remove('is-typing');
          this();
      };

      var typeWriter = malarkey(node, options);

      typeWriter.call(addIsTypingClass);
      typeWriter.type(snippet.str);
      typeWriter.pause();
      typeWriter.call(removeIsTypingClass);
      typeWriter.call(next);
    }

    function answerOrRespond (event) {
      if ( fAnswer !== undefined ) {
        fAnswer.respond(fAnswerCallback, event, fFormNode);
      } else if (fResponder !== undefined) {
        respond(undefined, event, fFormNode);
      }
    }

    function captureFormEvent (formNode, callback) {

      if ( formNode.addEventListener !== undefined ) {
          formNode.addEventListener("submit", callback, false); //Modern browsers
      } else if ( formNode.attachEvent !== undefined ){
        formNode.attachEvent('onsubmit', callback); //Old IE
      } 
    }

    function getNodes (container, node) {
      if (typeof node === 'string') {
        return container.querySelectorAll(node);
      } 

      return node;
    }

    function getNode (container, node) {
      if (typeof node === 'string') {
        return container.querySelector(node);
      } 

      return node;
    }

  }

  if (typeof module == 'object') {
    module.exports = qna;
  } else {
    root.qna = qna;
  }
})(this);

// Malarkey Dependecy
// v1.3.0
// https://github.com/yuanqing/malarkey
(function(root) {

  'use strict';

  var STOPPED  = 0;
  var STOPPING = 1;
  var RUNNING  = 2;

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function noop() {}

  function Malarkey(elem, opts) {

    // allow `Malarkey` to be called without the `new` keyword
    var self = this;
    if (!(self instanceof Malarkey)) {
      return new Malarkey(elem, opts);
    }

    // default `opts`
    opts = opts || {};
    var loop = opts.loop;
    var typeSpeed = opts.speed || opts.typeSpeed || 50;
    var deleteSpeed = opts.speed || opts.deleteSpeed || 50;
    var pauseDelay = opts.delay || opts.pauseDelay || 2000;
    var postfix = opts.postfix || '';
    var getter = opts.getter || function(elem) {
      return elem.innerHTML;
    };
    var setter = opts.setter || function(elem, val) {
      elem.innerHTML = val;
    };

    // the function queue
    var fnQueue = [];
    var argsQueue = [];
    var i = -1;
    var state = STOPPED;
    var pauseCb = noop;
    function enqueue(fn, args) {
      fnQueue.push(fn);
      argsQueue.push(args);
      if (state != RUNNING) {
        state = RUNNING;
        // wait for the remaining functions to be enqueued
        setTimeout(function() {
          next();
        }, 0);
      }
      return self;
    }
    function next() {
      if (state != RUNNING) {
        state = STOPPED;
        pauseCb(elem);
        pauseCb = noop;
        return;
      }
      if (++i == fnQueue.length) {
        if (!loop) {
          state = STOPPED;
          return;
        }
        i = 0;
      }
      fnQueue[i].apply(null, [].concat(next, argsQueue[i]));
    }

    // internal functions that are `enqueued` via the respective public methods
    function _type(cb, str, speed) {
      var len = str.length;
      if (!len) {
        return cb();
      }
      (function t(i) {
        setTimeout(function() {
          setter(elem, getter(elem) + str[i]);
          i += 1;
          if (i < len) {
            t(i);
          } else {
            cb();
          }
        }, speed);
      })(0);
    }
    function _delete(cb, x, speed) {
      var curr = getter(elem);
      var count = curr.length; // default to deleting entire contents of `elem`
      if (x != null) {
        if (typeof x == 'string') {
          // delete the string `x` if and only if `elem` ends with `x`
          if (endsWith(curr, x + postfix)) {
            count = x.length + postfix.length;
          } else {
            count = 0;
          }
        } else {
          // delete the last `x` characters from `elem`
          if (x > -1) {
            count = Math.min(x, count);
          }
        }
      }
      if (!count) {
        return cb();
      }
      (function d(count) {
        setTimeout(function() {
          var curr = getter(elem);
          if (count) {
            // drop last char
            setter(elem, curr.substring(0, curr.length-1));
            d(count - 1);
          } else {
            cb();
          }
        }, speed);
      })(count);
    }
    function _clear(cb) {
      setter(elem, '');
      cb();
    }
    function _call(cb, fn) {
      fn.call(cb, elem);
    }

    // expose the public methods
    self.type = function(str, speed) {
      return enqueue(_type, [str + postfix, speed || typeSpeed]);
    };
    self.delete = function(x, speed) {
      return enqueue(_delete, [x, speed || deleteSpeed]);
    };
    self.clear = function() {
      return enqueue(_clear);
    };
    self.pause = function(delay) {
      return enqueue(setTimeout, [delay || pauseDelay]);
    };
    self.call = function(fn) {
      return enqueue(_call, [fn]);
    };
    self.triggerPause = function(cb) {
      state = STOPPING;
      pauseCb = cb || noop;
      return self;
    };
    self.triggerResume = function() {
      if (state != RUNNING) { // ie. `STOPPED` or `STOPPING`
        var prevState = state;
        state = RUNNING;
        if (prevState == STOPPED) {
          next();
        }
      }
      return self;
    };
    self.isRunning = function() {
      return state != STOPPED; // ie. `RUNNING` or `STOPPING`
    };

  }

  /* istanbul ignore else */
  if (typeof module == 'object') {
    module.exports = Malarkey;
  } else {
    root.malarkey = Malarkey;
  }
})(this);