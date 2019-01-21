/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource','toastr'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'TodoCtrl',
			templateUrl: 'todomvc-index.html',
			resolve: {
				store: function (todoStorage) {
					// Get the correct module (API or localStorage).
					return todoStorage.then(function (module) {
						module.get(); // Fetch the todo records in the background.
						return module;
					});
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when("/login",{
            controller: 'LoginController',
            templateUrl: '/js/template/login.html',
            controllerAs: 'vm'
        	})
			.when("/reset-password",{
            controller: 'ResetPasswordController',
            templateUrl: '/js/template/ResetPassword.html',
            controllerAs: 'vm'
        	})
        	.when("/register",{
            controller: 'RegisterController',
            templateUrl: '/js/template/register.html',
            controllerAs: 'vm'
        	})
            .when('/:status', routeConfig)
			.otherwise({
            redirectTo: '/login'
        });
	});
