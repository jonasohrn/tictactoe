'use strict';

angular.module('main').controller('MainCtrl', function ($scope, GameService) {

    $scope.state = GameService.state();

    $scope.click = function(cell) {
        GameService.userClicked(cell);
    };

    $scope.start = function() {
        GameService.start();
    };

    $scope.start();
});