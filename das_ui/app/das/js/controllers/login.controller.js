'use strict';
dasApplication.controller('loginController', ['$scope', '$rootScope', 'loginService', '$http','$state',
		function($scope, $rootScope, loginService, $http,$state) {
			$rootScope.$state = $state;
			$scope.user = {"username":"Sreenath","password":"M5B6VX"};
			$scope.showLogin = true;
			$scope.login = function() {
				loginService.validate($scope.user).then(
						function(response) {
							console.log(response);
							$scope.showLogin = false;
							if(response.status === 200){
								
								$rootScope.loggedInUser =  JSON.stringify(response);
								$rootScope.username=response.data[0].username;
								localStorage.setItem( 'loggedInUser', JSON.stringify(response));
								localStorage.setItem("loggedInUserRole",response.data[0].role);
								if(response.data[0].role == "Admin" || response.data[0].role == "User"){
	 								$state.go("app.specialization");
								}

								if(response.data[0].role == "Doctor"){
	 								$state.go("app.doctor");
								}
								$rootScope.$emit("roleBasedNavList", {role:response.data[0].role});
                    			
                    		}else {   
                        		$state.go("app.login");
                    		}
						});
			};
/**
 * Event-Listner for Back-Button
 */
$scope.$on('$locationChangeStart', function(event, next, current){            
    // Here you can take the control and call your own functions:
    // Prevent the browser default action (Going back):
       event.preventDefault();            
});
			

}]);

