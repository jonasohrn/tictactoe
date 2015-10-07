'use strict';

angular.module('main').controller('MainCtrl', function ($scope, gameService) {

    $scope.state = gameService.state();

    $scope.click = function(cell) {
        gameService.userClicked(cell);
    }

    $scope.start = function() {
        gameService.start();
    }

    $scope.start();
});