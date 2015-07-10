(function(root){
  'use strict';

  function qna(snippetNodes, snippets, options) {
    var self = { };

    // DOM Elements
    var fContainerNode;
    var fSnippetNodes;
    var fFormNode;

    var fSnippets;
    var fResponder;
    var fAnswer;
    var fAnswerCallback;

    // States
    var fIsTyping;

    init( );

    // Interface
    self.respond    = respond;
    self.bindAnswer = bindAnswer;

    return self;

    function init ( ) {
      fIsTyping = false;

      options = options || { };

      fContainerNode = options.container ? _getOrReturnNode(document, options.container) : document;
      fSnippetNodes  = _getOrReturnNodes(fContainerNode, snippetNodes);

      fSnippets  = snippets;

      fResponder = options.responder;
      fFormNode  = _getOrReturnNode(fContainerNode, options.form);
      fAnswer    = options.answer;

      if (fFormNode !== undefined && fFormNode !== null) {
        _captureFormEvent(fFormNode, _answerOrRespond);
      }

    }

    // Public Methods
    function respond (callback) {
      var args     = Array.prototype.slice.call(arguments, 1);
      var snippets = Array.prototype.slice.call(fSnippets);
      var nodes    = Array.prototype.slice.call(fSnippetNodes);

      if (fResponder !== undefined) {
        var response = fResponder.apply(this, args);

        if ( response !== undefined ) {
          snippets = Array.prototype.slice.call(response);
        }
      }

      _clearNodes(nodes);
      _type(nodes, snippets, callback);
    }

    function bindAnswer (answerInstance, answerCallback) {
      fAnswer = answerInstance;
      fAnswerCallback = answerCallback;
    }

    // Private Methods
    function _clearNodes (nodes) {
      for ( var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.innerHTML = "";
      }
    }

    function _type (nodes, snippets, callback) {

      if ( nodes.length === 0 || snippets.length === 0) {
        fIsTyping = false;
        if (callback !== undefined ) { callback(); }
        return;
      }

      fIsTyping = true;

      var node    = nodes.shift();
      var snippet = snippets.shift();

      var options = { };

      options.pauseDelay = snippet.pauseDelay || 750;
      options.typeSpeed  = snippet.typeSpeed  || 50;

      var typeWriter = malarkey(node, options);

      typeWriter.call(addIsTypingClass);
      typeWriter.type(snippet.str);
      typeWriter.pause();
      typeWriter.call(removeIsTypingClass);
      typeWriter.call(next);

      function next () {
        _type(nodes, snippets, callback);
      }

      function removeIsTypingClass (el) {
        el.classList.remove('is-typing');
        this();
      }

      function addIsTypingClass (el) {
        el.classList.add('is-typing');
        this();
      }
    }

    function _answerOrRespond (event) {
      if ( fAnswer !== undefined ) {
        fAnswer.respond(fAnswerCallback, event, fFormNode);
      } else if (fResponder !== undefined) {
        self.respond(undefined, event, fFormNode);
      }
    }

    function _captureFormEvent (formNode, callback) {
      if ( formNode.addEventListener !== undefined ) {
          formNode.addEventListener('submit', callback, false); //Modern browsers
      }
    }

    function _getOrReturnNodes (container, node) {
      if (typeof node === 'string') {
        return container.querySelectorAll(node);
      }

      return node;
    }

    function _getOrReturnNode (container, node) {
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
