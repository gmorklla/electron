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

        var ready = false;

        var socket = io();

        $scope.enviarMsg = function() {
            var txt = $('#msg').val();
            socket.emit('send', txt);
            $('#msg').val('');
        }

        socket.on('chat', function(user, msg) {
            $('#lista').append($('<li class="item">').html('<span>' + user + ' dice: </span>' + msg));
        });

        // Fn para abrir menú de Proyectos
        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.newUser = function() {
            // Popup para crear proyectos
            var myPopup = $ionicPopup.show({
                template: '<input type="text" id="username">',
                title: 'Nombre de usuario',
                subTitle: '¿Qué nombre o nick quieres usar?',
                scope: $scope,
                buttons: [
                    { text: 'Cancelar' }, {
                        text: '<b>Guardar</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            var dato = document.getElementById("username").value;
                            if (!dato) {
                                e.preventDefault();
                            } else {
                                socket.emit("join", dato);
                                ready = true;
                            }
                        }
                    }
                ]
            });
        };

        if ($scope.user == null) {
            $scope.newUser();
        }

        socket.on("update", function(msg) {
            if (ready) {
                $scope.avisos = msg;
                digiere();
                $timeout(function() {
                    $scope.avisos = '';
                }, 5000);
            }
        });

        socket.on("update-people", function(people){
            if(ready) {
                $("#users").empty();
                $.each(people, function(clientid, name) {
                    $('#users').append($('<ion-item class="item">').text(name));
                });
            }
        });

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if(!$scope.$$phase) {
                $scope.$digest();
            }                
        }            

}]);
