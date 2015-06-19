(function(root, malarkey){
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
})(this, this.malarkey);
