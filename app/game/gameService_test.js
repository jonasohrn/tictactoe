'use strict';

describe('myApp game module', function() {


    beforeEach(module('main'));

    describe('game service', function(){

        it('gameService initial state after start', inject(function(GameService) {
            expect(GameService.state).toBeDefined();

            expect(GameService.state().gameOver).toEqual(true);
            GameService.start();
            expect(GameService.state().gameOver).toEqual(false);

            expect(GameService.state().winner).toBeUndefined();
            expect(GameService.state().rows).toBeDefined();
        }));

        it('gameService session User wins', inject(function(GameService) {

            GameService.start();

            var cell00 = GameService.state().rows[0][0];
            expect(cell00).toBeDefined();

            // Click on first cell 0,0
            GameService.userClicked(cell00);
            expect(GameService.state().gameOver).toEqual(false);
            expect(cell00.val).toEqual('X');

            expectValues(GameService,
                 ['X','O',' ',
                  ' ',' ',' '
                 ,' ',' ',' ']);

            GameService.userClicked(GameService.state().rows[1][0]);
            expectValues(GameService,
                 ['X','O',' ',
                  'X',' ',' '
                 ,'O',' ',' ']);

            GameService.userClicked(GameService.state().rows[1][1]);
            expectValues(GameService,
                 ['X','O',' ',
                  'X','X','O'     // <- computer selects first threat on 2nd row
                 ,'O',' ',' ']);

            GameService.userClicked(GameService.state().rows[2][2]);
            expectValues(GameService,
                 ['X','O',' ',
                  'X','X','O'
                 ,'O',' ','X']);

            expect(GameService.state().gameOver).toEqual(true);
            expect(GameService.state().winner).toEqual('User');
        }));

    });

    it('gameService session Computer wins despite threat', inject(function(GameService) {

        GameService.start();

        GameService.userClicked(GameService.state().rows[2][1]);
        expectValues(GameService,
            ['O',' ',' ',
             ' ',' ',' '
            ,' ','X',' ']);

        GameService.userClicked(GameService.state().rows[1][1]);
        expectValues(GameService,
            ['O','O',' ',
             ' ','X',' '
            ,' ','X',' ']);

        GameService.userClicked(GameService.state().rows[0][2]);
        expectValues(GameService,
            ['O','O','X',
             ' ','X',' '
            ,'O','X',' ']);

        GameService.userClicked(GameService.state().rows[2][2]);
        expectValues(GameService,
            ['O','O','X',
             'O','X',' '
            ,'O','X','X']);

        expect(GameService.state().gameOver).toEqual(true);
        expect(GameService.state().winner).toEqual('Computer');
    }));


    function expectValues(GameService, cellValues) {
        expect(_.chain(GameService.state().rows)
            .flatten(true)
            .pluck('val')
            .value()).toEqual(cellValues);
    }
});