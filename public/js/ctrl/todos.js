'use strict';

/**
 * @ngdoc function
 * @name electronStarter.controller:ElectronCtrl
 * @description
 * # ElectronCtrl
 * Controller of the electronStarter
 */
angular.module('electronStarter')
    .controller('ElectronCtrl', ['$scope', '$timeout', '$ionicModal', '$ionicPopup', '$ionicSideMenuDelegate', function($scope, $timeout, $ionicModal, $ionicPopup, $ionicSideMenuDelegate) {

        console.log('ElectronCtrl');

        // Fn para abrir menú de Proyectos
        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };                

    }]);
