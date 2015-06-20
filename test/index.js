'use strict';


// Load fixture
var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/';
jasmine.getFixtures().preload(fixture);


var qna = require('../index.js');

beforeEach(function (){
  loadFixtures(fixture);
  elem = $('.qna')[0];
  jasmine.clock().install();
  clock = jasmine.clock();
});

afterEach(function() {
  jasmine.clock().uninstall();
});
