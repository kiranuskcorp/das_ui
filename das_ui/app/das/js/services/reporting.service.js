'use strict';
dasApplication.factory("reportingService", reportingService);
function reportingService($http,$window, __env,$rootScope) {
	var service = {

		getAllReportings : getAllReportings,
		getAllDoctors:getAllDoctors,
		create:create,
		update:update,
		deleteRow:deleteRow,
	}, url = __env.baseUrl + __env.context
	return service;
	
	function getAllReportings() {
		return $http.get(url+"/reportings/readAll");
	}
	
	function getAllDoctors() {
		return $http.get(url+"/doctors/readAll");
	}
	
	

	function create(jsonData) {
		return $http({
			url : url + "/reportings/getReportingDetails"+"?id="+jsonData.doctorId+"&from="+jsonData.fromDate+"&to="+jsonData.toDate,
			method : "GET" ,
			data : jsonData
		}).then(function(response) {
                  
			console.log(response);
			// success
			return response;
		}, function(response) { // optional
			// failed
		});
	}
	function update(jsonData) {
		return $http({
			url : url + '/reportings/update',
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
			url : url + '/reportings/delete?id='+id,
			method : "POST"
		}).then(function(response) {
			// success
		}, function(response) { // optional
			// failed
		});
	}

}
