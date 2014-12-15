'use strict';
/* Directives */
angular.module('firepress.directives', [
    'LocalStorageModule',
    'firebase'
]).
value('firebase_root',"https://forlater.firebaseio.com").
directive('firepressLogin', ['$firebase', '$firebaseSimpleLogin', '$rootScope', 'localStorageService', 'firebase_root',
    function($firebase, $firebaseSimpleLogin, $rootScope, localStorageService, firebase_root) {
        return {
            restrict: 'AE',
            template: [
                '<form>',
                '<span class="form-group" ng-show="show">',
                '<label>Email<input class="form-control" ng-model="user.username" type="text" name="user.username"/></label>',
                '<label>Password<input class="form-control" ng-model="user.password" type="password" name="user.password"/></label>',
                '<button style="margin-left:2px" type="button" class="btn btn-primary" ng-click="LogintoFirepress()">Login</button>',
                '</span>',
                '<span ng-hide="show">{{user.email}} ',
                '<a href="#" style="margin-left:2px" class="btn btn-warning" ng-click="LogoutFirepress()">Logout</a>',
                '</span><br>',
                '<span class="form-group" ng-show="show">',
                '<label>Remember Me',
                '<input type="checkbox" class="form-control" ng-model="rembmerme" /></label></span>',
                '</form>'
            ].join(""),
            scope: true,
            controller: function($scope) {
                $scope.user = {};
                var dataRef = firebase_root;
                $scope.loginObj = $firebaseSimpleLogin(dataRef);
                $scope.show = true;
                $scope.LogintoFirepress = function() {
                    $scope.loginObj.$login('password', {
                        email: $scope.user.username,
                        password: $scope.user.password,
                        rememeberMe: $scope.rememberme
                    }).then(function(user) {
                        localStorageService.set('FirepressUser', user);
                        $scope.user = user;
                        $scope.show = false;
                        console.log('Logged in as: ', user);
                    }, function(error) {
                        console.error('Login failed: ', error);
                    });
                }
                $scope.LogoutFirepress = function() {
                    localStorageService.remove('FirepressUser');
                    $scope.loginObj.$logout();
                    $scope.user = null;
                    $scope.show = true;
                }
            }
        };
    }
]);