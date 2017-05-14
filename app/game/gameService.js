'use strict';

/*
 Maybe the code should be refactored into smaller parts:
 GameBoard - table and initTable()
 ComputerPlayer - the "smart" opponent
 */
angular.module('main')
    .factory('GameService', function gameServiceFactory() {

        var table = {
            rows: [[],[],[]],
            cols: [[],[],[]],
            diagonals: [[],[]],
            // lines are the 8 lines to check for wins/threats sharing the 9 cell objects
            lines: function() {
                return _.flatten([table.rows, table.cols, table.diagonals]);
            }
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
        }

        function userClicked(cell) {
            if (state.gameOver || !cellEmpty(cell)) {
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

        /*
        We could refactor code so that winner & gameOver are not properties set in state but evaluated instead
        such as state.winner() and state.gameOver()
        */
        function evaluateGameOver() {
            var allSameLine = _.find(table.lines(), isAllSet);
            if (allSameLine) {
                state.winner = allSameLine[0].val === 'X' ? 'User' : 'Computer';
            }
            state.gameOver = state.winner && true || !_.some(table.rows, hasEmpty);
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
            var cell = findCell(iCanWin,  cellEmpty)
                    || findCell(isThreat, cellEmpty)
                    || findCell(hasEmpty, cellEmpty);
            return cell;
        }

        // Find table cel   l from line- and cell predicates
        // FIXME: cellPred is always cellEmpty - refactor
        function findCell(linePred, cellPred) {
            return _.chain(table.lines()).filter(linePred).flatten().find(cellPred).value();
        }

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
        function someoneCanWin(line, cellPred) {
            return line.filter(cellPred).length === 2 && line.filter(cellEmpty).length === 1;
        }
        function hasEmpty(line) {
            return line.some(cellEmpty);
        }
        function isAllSet(line) {
            return line.every(isX) || line.every(isO);
        }

        function cellEmpty(cell) {
            return cell.val === ' ';
        }
        function isX(cell) {
            return cell.val === 'X';
        }
        function isO(cell) {
            return cell.val === 'O';
        }

        // Revealing module pattern
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