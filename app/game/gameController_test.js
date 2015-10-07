'use strict';

describe('myApp game module', function() {

    var scope, mainCtrl;

    beforeEach(module('main'));

    beforeEach(inject(function($controller) {
        scope = {};
        mainCtrl = $controller('MainCtrl', {$scope:scope});
    }));

    describe('main controller', function(){

        it('should start the game and expose state', function() {

          expect(mainCtrl).toBeDefined();

          expect(scope.state).toBeDefined();
          expect(scope.state.gameOver).toEqual(false);
        });

        it('should propagate clicked to gameService', inject(function(gameService) {

            spyOn(gameService, 'userClicked');
            scope.click({});
            expect(gameService.userClicked).toHaveBeenCalled();
        }));

    });
});