'use strict';
dasApplication.factory("appointmentService", appointmentService);
function appointmentService($http, $window, __env) {
	var service = {
		getAllAppointments:getAllAppointments,
		getAllTimes:getAllTimes, 
		getAllDoctors:getAllDoctors,
		getAllHospitals:getAllHospitals,
		getAllDoctorsByHospital:getAllDoctorsByHospital,
		getAllHospitalsByDoctor:getAllHospitalsByDoctor,		
		getAllStates:getAllStates,
		getAllCities:getAllCities,
		/*getAllDiseases:getAllDiseases,*/
		create:create,
		update:update,
		deleteRow:deleteRow

	}, url = __env.baseUrl + __env.context
	return service;
	function getAllAppointments() {
		return $http.get(url + "/appointments/readAll");
	}
	function getAllTimes() {
		return $http.get("./mock/timeConstants.json");
	}
	 
	/*function getAllDiseases() {
		return $http.get(url + "/diseases/readAll");
	}*/
	function getAllDoctors() {
		return $http.get(url + "/doctors/readAll");
	}
	function getAllHospitals() {
		return $http.get(url + "/hospitals/readAll");
	}
	function getAllDoctorsByHospital(hospital) {
		return $http.get(url + "/doctors/readAllById?id="+hospital);
	}
	function getAllHospitalsByDoctor(doctor) {
		return $http.get(url + "/hospitals/readAllById?id="+doctor);
	}
	function getAllStates() {
		return $http.get("./mock/states.json");
	}
	function getAllCities() {
		return $http.get("./mock/cities.json");
	}

	 function create(appointmentCreateData) {
			return $http({
				url : url + '/appointments/create',
				method : "POST",
				data : appointmentCreateData
			}).then(function(response) {
				// success
			}, function(response) { // optional
				// failed
			});
		}

	function update(appointmentUpdateData) {
			return $http({
				url : url + '/appointments/update',
				method : "POST",
				data : appointmentUpdateData
			}).then(function(response) {
				// success
			}, function(response) { // optional
				// failed
			});
		}	
	function deleteRow(id) {
    			return $http({
    				url : url + '/appointments/delete?id='+id,
    				method : "POST"
    			}).then(function(response) {
    				// success
    			}, function(response) { // optional
    				// failed
    			});
    		}	

}
