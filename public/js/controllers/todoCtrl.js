/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store,AuthenticationService,$location,HttpService,FlashService,) {
		'use strict';
        if(!AuthenticationService.checkLogin()) {
            $location.path('/login');
        }
        var user = AuthenticationService.getLoggedInUser();

     	$scope.newTodo = '';
		$scope.editedTodo = null;
		$scope.todos;
        var todos = $scope.todos=[];
		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

        window.messaging.requestPermission().then(function() {
            console.log('Notification permission granted.');
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // ...

            window.messaging.getToken().then(function(currentToken) {
				if (currentToken) {
				HttpService.updateToken({fcm_token:currentToken,platform:"web"});
				} else {
					// Show permission request.
					console.log('No Instance ID token available. Request permission to generate one.');
				}
			}).catch(function(err) {
				console.log('An error occurred while retrieving token. ', err);
			});
        }).catch(function(err) {
            console.log('Unable to get permission to notify.', err);
        });
        window.messaging.onMessage(function(payload) {
            FlashService.Success('Message received. ', payload);
            // ...
        });
        // Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';
			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : {};
		});

		$scope.addTodo = function () {
			var newTodo = {
				title: $scope.newTodo.trim(),
				completed: false,
				user_id:user._id,
                status:"new",
                isPublic:true
			};

			if (!newTodo.title) {
				return;
			}

			$scope.saving = true;
			HttpService.create(newTodo).then(function (response){
                FlashService.Success('Created New Task');
                $scope.newTodo = '';
                $scope.saving=  false;
				if (response.data.data) {
                    response.data.data.user_id = {_id:user._id,name:user.name}
                    console.log(response.data.data)
					todos.push(response.data.data)
				}

			},function(e){
                if (e && e.status===401){
                    $scope.logout();
                } else {
                    FlashService.Error(e.data.message)
                };

			})
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};


		$scope.getAllTask = function () {
			HttpService.getAllTask().then(function(response){
				if (response && response.data && response.data.data) {
                    todos = $scope.todos = response.data.data;
                }
			},function(e){
                if (e && e.status===401){
                    $scope.logout();
                } else {
                    FlashService.Error(e.data.message);
                };
			})
		};

        $scope.getAllTask();

		$scope.saveEdits = function (todo, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			if (todo.title === $scope.originalTodo.title) {
				$scope.editedTodo = null;
				return;
			}

			store[todo.title ? 'put' : 'delete'](todo)
				.then(function success() {}, function error() {
					todo.title = $scope.originalTodo.title;
				})
				.finally(function () {
					$scope.editedTodo = null;
				});
		};

		$scope.revertEdits = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (todo) {

			HttpService.remove(todo._id).then(function(){

				FlashService.Success('Removed')

                $scope.getAllTask();

			},function(e){
                if (e && e.status===401){
                    $scope.logout();
                } else {
                    FlashService.Error(e.data.message);
                };
			})
		};

		$scope.saveTodo = function (todo) {
			store.put(todo);
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			HttpService.update(todo._id,todo).then(function(){
                FlashService.Success('Updated');
			},function(e){
                todo.completed = !todo.completed;
                if (e && e.status===401){
                    $scope.logout();
                } else {

                	FlashService.Error(e.data.message)
                };
			})

		};

		$scope.clearCompletedTodos = function () {
			store.clearCompleted();
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				if (todo.completed !== completed) {
					$scope.toggleCompleted(todo, completed);
				}
			});
		};
		$scope.logout = function () {
         	AuthenticationService.logout();
            window.location.reload();

        }
	});
