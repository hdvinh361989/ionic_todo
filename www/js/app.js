// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic', 'LocalStorageModule'])

    .config(function (localStorageServiceProvider, $stateProvider) {
        localStorageServiceProvider
            .setPrefix('todo')
            .setNotify(true, true);
        $stateProvider
            .state('newTask', {
                views: {
                    'modal': {
                        templateUrl: 'new-task.tpl.html'
                    }
                }
            })
            .state('newProject', {
                views: {
                    'modal': {
                        templateUrl: 'new-project.tpl.html'
                    }
                }
            });
    })

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
