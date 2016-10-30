'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */
var _ = require('lodash');

describe('Tic tac toe', function() {

  var rowElements, anchors;

  it('should show table with empty cells and no Game over', function() {
    browser.get('/app/');

    rowElements = element(by.css('table')).all(by.tagName('tr'));
    //var rowElements = element.all(by.repeater('row in state.rows'));
    expect(rowElements.count()).toEqual(3);

    anchors = rowElements.all(by.tagName('a'));
    expect(anchors.count()).toEqual(9);

    anchors.each(function(element, index) {
      element.getText().then(function (text) {

          console.log(index, text);
          expect(text).toMatch(/\W+/);
      });
      // same result as expect(element.getText()).toMatch(/\W+/);
    });

    expect(element(by.id('game-state')).isPresent()).toBe(false);
    expect(element(by.binding('state.winner')).isPresent()).toBe(false);

  });


  describe('Game sessions', function() {

    beforeEach(function() {
        browser.get('/app');

        rowElements = element(by.css('table')).all(by.tagName('tr'));
        anchors = rowElements.all(by.tagName('a'));
    });


    it('should play game session correct when User wins', function() {

        _.forEach([[0,1], [3,6], [4,5]], function(e) {
            var userCell = e[0];
            var computerResponseCell = e[1];
            anchors.get(userCell).click();
            expect(anchors.get(userCell).getText()).toEqual(' X ');
            expect(anchors.get(computerResponseCell).getText()).toEqual(' O ');
            expect(element(by.id('game-state')).isPresent()).toBe(false);
        });

        // Last click - Verify user wins and Game over
        anchors.get(8).click();
        expect(anchors.get(8).getText()).toEqual(' X ');
        expect(anchors.get(7).getText()).toEqual('   '); // no response because user won

        expect(element(by.id('game-state')).getText()).toEqual('Game over');
        expect(element(by.binding('state.winner')).getText()).toMatch(/.*winner is User/);
    });

    it('should restart game session when clicking start button', function() {

      anchors.first().click();
      expect(anchors.get(1).getText()).toEqual(' O ');
      anchors.get(1).click(); // Try click on occupied cell
      expect(anchors.get(1).getText()).toEqual(' O ');

      var button = element(by.tagName('button'));
      expect(button.isPresent()).toBe(true);

      button.click();
      expect(anchors.first().getText()).toEqual('   ');
    });

  });
});
