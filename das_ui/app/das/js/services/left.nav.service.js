'use strict';
dasApplication.factory("leftNavService", leftNavService);
function leftNavService($http, $window, __env,storeObject) {
	var service = {
		getAllTabs : getAllTabs	
	};
	return service;	
	function getAllTabs(role) {
		//return $http.get("./mock/admin_tabs.json");	
		if(role == "Admin"){
			return $http.get("./mock/admin_tabs.json");			
		}
		if(role == "Doctor"){
			return $http.get("./mock/doctor_tabs.json");			
		}
		if(role == "User"){
			return $http.get("./mock/user_tabs.json");			
		}

	}
	

}
