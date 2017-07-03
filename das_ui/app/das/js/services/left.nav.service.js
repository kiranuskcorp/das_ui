'use strict';
dasApplication.factory("leftNavService", leftNavService);
function leftNavService($http, $window, __env,storeObject) {
	var service = {
		getAllTabs : getAllTabs		
	};
	return service;	
	function getAllTabs() {
		return $http.get("./mock/tabs.json");
	}

}
