'use strict';

describe('myApp game module', function() {


    beforeEach(module('main'));

    describe('game service', function(){

        it('gameService initial state after start', inject(function(gameService) {
            expect(gameService.state).toBeDefined();

            expect(gameService.state().gameOver).toEqual(true);
            gameService.start();
            expect(gameService.state().gameOver).toEqual(false);

            expect(gameService.state().winner).toBeUndefined();
            expect(gameService.state().rows).toBeDefined();
        }));

        it('gameService session User wins', inject(function(gameService) {

            gameService.start();

            var cell00 = gameService.state().rows[0][0];
            expect(cell00).toBeDefined();

            // Click on first cell 0,0
            gameService.userClicked(cell00);
            expect(gameService.state().gameOver).toEqual(false);
            expect(cell00.val).toEqual('X');

            expect(_.pluck(gameService.state().rows[0], 'val')).toEqual(['X','O',' ']);
            expectValues(gameService,
                 ['X','O',' ',
                  ' ',' ',' '
                 ,' ',' ',' ']);

            gameService.userClicked(gameService.state().rows[1][0]);
            expectValues(gameService,
                 ['X','O',' ',
                  'X',' ',' '
                 ,'O',' ',' ']);

            gameService.userClicked(gameService.state().rows[1][1]);
            expectValues(gameService,
                 ['X','O',' ',
                  'X','X','O'     // <- computer selects first threat on 2nd row
                 ,'O',' ',' ']);

            gameService.userClicked(gameService.state().rows[2][2]);
            expectValues(gameService,
                 ['X','O',' ',
                  'X','X','O'
                 ,'O',' ','X']);

            expect(gameService.state().gameOver).toEqual(true);
            expect(gameService.state().winner).toEqual('User');
        }));

    });

    it('gameService session Computer wins despite threat', inject(function(gameService) {

        gameService.start();

        gameService.userClicked(gameService.state().rows[2][1]);
        expectValues(gameService,
            ['O',' ',' ',
             ' ',' ',' '
            ,' ','X',' ']);

        gameService.userClicked(gameService.state().rows[1][1]);
        expectValues(gameService,
            ['O','O',' ',
             ' ','X',' '
            ,' ','X',' ']);

        gameService.userClicked(gameService.state().rows[0][2]);
        expectValues(gameService,
            ['O','O','X',
             ' ','X',' '
            ,'O','X',' ']);

        gameService.userClicked(gameService.state().rows[2][2]);
        expectValues(gameService,
            ['O','O','X',
             'O','X',' '
            ,'O','X','X']);

        expect(gameService.state().gameOver).toEqual(true);
        expect(gameService.state().winner).toEqual('Computer');
    }));


    function expectValues(gameService, cellValues) {
        expect(_.chain(gameService.state().rows)
            .flatten(true)
            .pluck('val')
            .value()).toEqual(cellValues);
    }
});