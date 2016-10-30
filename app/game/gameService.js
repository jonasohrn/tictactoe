'use strict';

angular.module('main')
    .factory('gameService', function gameServiceFactory() {

        var table = {
            rows: [[],[],[]],
            cols: [[],[],[]],
            diagonals: [[],[]]
        };

        var state = {
            gameOver : true,
            winner : undefined,
            rows : table.rows
        };

        function initTable() {

            for (var row=0; row<3; row++) {
                for (var col=0; col<3; col++) {
                    var cell = { val : ' ', id : ''+row+'-'+col };
                    table.rows[row][col] = cell;
                    table.cols[col][row] = cell;
                }
            }
            for (row=0; row<3; row++) {
                table.diagonals[0][row] = table.rows[row][row];
                table.diagonals[1][row] = table.rows[row][2-row];
            }
            // lines are the 8 lines to check for wins/threats sharing the 9 cell instances
            table.lines = function() {
                var lines = _.flatten([table.rows, table.cols, table.diagonals]);
                return lines;
            }
        }

        function userClicked(cell) {
            if (state.gameOver || !isEmpty(cell)) {
                return;
            }
            userSet(cell);
            evaluateGameOver() || nextMove(computerMove());
        }

        function start() {
            state.gameOver = false;
            state.winner = undefined;
            initTable();
        }

        function evaluateGameOver() {
            var allSameLine = _.find(table.lines(), isAllSame);
            if (allSameLine) {
                state.winner = allSameLine[0].val === 'X' ? 'User' : 'Computer';
            }
            state.gameOver = state.winner && true || !_.some(table.lines(), hasEmpty)
            return state.gameOver;
        }

        function nextMove(cell) {
            if (!cell || !cell.val) {
                console.log("illegal cell "+cell);
                return;
            }
            computerSet(cell);
            evaluateGameOver();
        }

        function computerMove() {
            var cell = findCell(iCanWin,  isEmpty)
                    || findCell(isThreat, isEmpty)
                    || findCell(hasEmpty, isEmpty);
            return cell;
        }

        // Find table cell from line- and cell predicates
        function findCell(linePred, cellPred) {
            return _.chain(table.lines()).filter(linePred).flatten().find(cellPred).value();
        };

        function userSet(cell) {
            cell.val = 'X';
        }
        function computerSet(cell) {
            cell.val = 'O';
        }

        function iCanWin(line) {
            return someoneCanWin(line, isO);
        }
        function isThreat(line) {
            return someoneCanWin(line, isX);
        }
        function someoneCanWin(line, isSomeone) {
            return _.filter(line, isSomeone).length === 2 && _.filter(line, isEmpty).length === 1;
        }
        function hasEmpty(line) {
            return _.some(line, isEmpty);
        }
        function isAllSame(line) {
            return _.all(line, isX) || _.all(line, isO);
        }

        function isEmpty(cell) {
            return cell.val === ' ';
        }
        function isX(cell) {
            return cell.val === 'X';
        }
        function isO(cell) {
            return cell.val === 'O';
        }


        var gameService = {
            initTable : initTable,
            start : start,
            userClicked : userClicked,
            state : function () {
                return Object.seal(state);
            }
        };
        return gameService;
    });