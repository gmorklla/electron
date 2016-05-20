'use strict';

/**
 * @ngdoc function
 * @name electronStarter.controller:ElectronCtrl
 * @description
 * # ElectronCtrl
 * Controller of the electronStarter
 */
angular.module('electronStarter')
    .controller('ElectronCtrl', ['$scope', '$compile', '$timeout', '$ionicActionSheet', '$ionicModal', '$ionicPopup', '$ionicSideMenuDelegate', function($scope, $compile, $timeout, $ionicActionSheet, $ionicModal, $ionicPopup, $ionicSideMenuDelegate) {

        var ready = false;

        var socket = io();

        $scope.enviarMsg = function() {
            var txt = $('#msg').val();
            socket.emit('send', txt);
            $('#msg').val('');
        }

        socket.on('chat', function(user, msg) {
            $('#lista').append($('<li class="item">').html('<span>' + user.nombre + ' dice: </span>' + msg));
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
                    $scope.name = name;
                    var template = '<ion-item class="item" ng-click="getRoom($event)">';
                    var temp = $compile(template)($scope); 
                    $('#users').append($(temp).text(name.nombre));
                });
            }
        });

        socket.on("privateM", function(quien, msg) {
            // Popup para crear proyectos
            var myPopup = $ionicPopup.show({
                template: '<input type="text" id="msgP">',
                title: 'Mensaje privado de ' + quien.nombre + ':',
                subTitle: msg,
                scope: $scope,
                buttons: [
                    { text: 'Cancelar' }, {
                        text: '<b>Responder</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            var dato = document.getElementById("msgP").value;
                            if (!dato) {
                                e.preventDefault();
                            } else {
                                socket.emit('say to someone', quien.nombre, dato);
                            }
                        }
                    }
                ]
            });            
            console.log('Pm de ' + quien.nombre +' : ' +  msg);
        });        

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if(!$scope.$$phase) {
                $scope.$digest();
            }                
        }

        // Fn para mandar mensaje privado a nombre
        $scope.getRoom = function(evt){
            var id = evt.target.innerHTML;

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                 buttons: [
                   { text: 'Mensaje privado' },
                   { text: 'Ver perfil'}
                 ],
                 titleText: 'Opciones',
                 cancelText: 'Cancelar',
                 cancel: function() {
                      // add cancel code..
                    },
                 buttonClicked: function(index) {
                    switch(index){  
                        case 0:
                            mandarMensajePrivado();
                            return true;
                        break;
                        case 1:
                            console.log('Ver perfil');
                        break;
                        default:
                            return true;
                        break;
                    }
                 }
            });            

            // Popup para mandar mensajes privados
            function mandarMensajePrivado() {
                var myPopup = $ionicPopup.show({
                    template: '<input type="text" id="msgP">',
                    title: 'Mensaje privado',
                    subTitle: '¿Qué le quieres decir a ' + id + '?',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancelar' }, {
                            text: '<b>Mandar</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                var dato = document.getElementById("msgP").value;
                                if (!dato) {
                                    e.preventDefault();
                                } else {
                                    socket.emit('say to someone', id, dato);
                                }
                            }
                        }
                    ]
                });                
            }
            
        }

}]);
