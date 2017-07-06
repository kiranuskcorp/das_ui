'use strict';
dasApplication.controller('loginController', ['$scope', '$rootScope', 'loginService', '$http','$state',
		function($scope, $rootScope, loginService, $http,$state) {

			$scope.user = {};
			$scope.user.username = "";
			$scope.user.password = "";
			$scope.showUserDetails = false;
			$scope.showLogin = true;
			/*$scope.userDetails = [];
*/
			$scope.login = function() {
				loginService.validate($scope.user).then(
						function(response) {

							console.log(response);
							$scope.showLogin = false;
							$scope.showUserDetails = true;
							/*$scope.getUserDetails();
							$state.go('department');*/
						});
			};
			
			/*$scope.getUserDetails = function() {
				loginService.getUserDetails().then(
						function(d) {
							$scope.userDetails = d;
						});
			}*/

		} ]);