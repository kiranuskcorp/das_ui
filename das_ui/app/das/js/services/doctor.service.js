'use strict';
dasApplication.factory("doctorService", doctorService);
function doctorService($http, $window, __env) {
	var service = {
		getAllDoctors : getAllDoctors,
		getAllStates:getAllStates,
		getAllCities:getAllCities,
		getAllDepartments:getAllDepartments,
		getAllSpecializationsByDepartments: getAllSpecializationsByDepartments,
		getAllHospitals:getAllHospitals,
		getAllMasterSlots:getAllMasterSlots,
		create:create,
		update:update,
		deleteRow:deleteRow,
	}, url = __env.baseUrl + __env.context
	return service;
	
	function getAllDoctors() {
		return $http.get(url+"/doctors/readAll");
	}
		
	function getAllDepartments() {
		return $http.get(url+"/departments/readAll");
	}
	function getAllSpecializationsByDepartments(department) {
		return $http.get(url + "/specializations/readAllById?id="+department);
	}
	function getAllHospitals() {
		return $http.get(url+"/hospitals/readAll");
	}
	function getAllStates() {
		return $http.get("./mock/states.json");
	}
	function getAllCities(state) {
		return $http.get("./mock/cities.json");
	}
	function getAllMasterSlots(state) {
		return $http.get("./mock/timeSlot.json");
	}
	

	function create(jsonData) {
		return $http({
			url : url + '/doctors/create',
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
			url : url + '/doctors/update',
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
			url : url + '/doctors/delete?id='+id,
			method : "POST"
		}).then(function(response) {
			// success
		}, function(response) { // optional
			// failed
		});
	}

}
