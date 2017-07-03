'use strict';
dasApplication.factory("hospitalService", hospitalService);
function hospitalService($http, $window, __env) {
	var service = {
		getAllHospitals : getAllHospitals,
		getAllDepartments:getAllDepartments,
		getAllFacilities:getAllFacilities,
		getAllStates:getAllStates,
		getAllCities:getAllCities,
		getAllTimes:getAllTimes,
		create : create,
		update : update,
		deleteRow:deleteRow

	}, url = __env.baseUrl + __env.context
	return service;
	
	function getAllHospitals() {
		return $http.get(url+"/hospitals/readAll");
	}
	function getAllDepartments() {
		return $http.get(url+"/departments/readAll");
	}
	function getAllFacilities() {
		return $http.get("./mock/facility.json");
	}
	function getAllStates() {
		return $http.get("./mock/states.json");
	}
	function getAllCities(state) {
		return $http.get("./mock/cities.json");
	}
	function getAllTimes(state) {
		return $http.get("./mock/timeConstants.json");
	}
	

	function create(jsonData) {
		return $http({
			url : url + '/hospitals/create',
			method : "POST",
			data : jsonData
		}).then(function(response) {
			// success
		}, function(response) { // optional
			// failed
		});
	}

	function update(jsonData) {
		return $http({
			url : url + '/hospitals/update',
			method : "POST",
			data : jsonData
		}).then(function(response) {
			// success
		}, function(response) { // optional
			// failed
		});
	}
	function deleteRow(id) {
		return $http({
			url : url + '/hospitals/delete?id='+id,
			method : "POST"
		}).then(function(response) {
			// success
		}, function(response) { // optional
			// failed
		});
	}

}
