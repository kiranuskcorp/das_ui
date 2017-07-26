/*(function() {*/
'use strict';
dasApplication.controller("doctorController", doctorController);

function doctorController($scope, doctorService, Excel, $state, $mdDialog,
		$mdToast, $timeout, $mdSidenav, $log,$rootScope) {
	var self = {
		init : init
	};
	function init() {
		$rootScope.currentController = 'Doctor';
		$scope.currentPage = 'Create';
		$rootScope.currentDataEnable = true;
		var current = $state.current.name;
		$scope.currentState = current.split(/[\s.]+/);
		$scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
		$scope.customFullscreen = false;
		$scope.updatePage = false;
		
		$scope.specializationSelected= false;
		$scope.currentDate = new Date();
		$scope.clientsData = [];
		$scope.collection = [];
		$scope.selected = [];
		$scope.headerEnable = {};
		$scope.exportData = [];

		
		$scope.loading = true;
		function getAllDoctors(){
        	doctorService.getAllDoctors().then(function(response) {
			$scope.doctorsData = response.data;
			$scope.doctorsLength = response.data.length;
			$rootScope.currentTableLength = 'Total Doctors:'+response.data.length;
			$scope.loading = false;
                });
				
        }
		getAllDoctors();

		$scope.record = {
			"name":"",
			"email":"",
			"phone":"",
            "alternatePhone":"",
            "dob": "",
            "gender":"",
			"rating":"",
			"experience":"",
			"masterSlot":"",
			"description":"",
			"hospitalId":"",
			"departmentId":"",
			"specializationId":""
			
		};

		$scope.genders = [{"id":"Male","value":"Male"},{"id":"Female","value":"Female"},{"id":"Others","value":"Others"}];

            
		$scope.getAllSpecializationsByDepartmentId = function(department){
            doctorService.getAllSpecializationsByDepartments(department).then(function(response) {
            $scope.specializations = response.data;
        });
		}
		
        doctorService.getAllDepartments().then(function(response) {
            $scope.departments = response.data;
        });
        doctorService.getAllStates().then(function(response) {
            $scope.states = response.data;
        });
        doctorService.getAllDepartments().then(function(response) {
            $scope.departments = response.data;
        });
        doctorService.getAllHospitals().then(function(response) {
			$scope.hospitals = response.data;
			
		});
       
        doctorService.getAllMasterSlots().then(function(response) {
			$scope.masterSlots = response.data;
		});
		

	
		doctorService.getAllDoctors().then(function(response) {
            $scope.doctorsData = response.data;
             $rootScope.currentTableLength = 'Records Count :'+response.data.length;
        });
	

		$scope.getCitiesByState = function(state){
			doctorService.getAllCities(state).then(function(response) {
            $scope.cities = response.data;
       	 	});
		}
		$scope.cancelRecord = function(){
			$mdSidenav('right').close().then(function() {
				$log.debug("close RIGHT is done");
			});
		}	
		$scope.saveRecord = function() {

			$scope.specializationIdToSave = JSON.stringify($scope.record.specializationId);
			//$scope.availableFacilitiesToSave = JSON.stringify($scope.record.availableFacilities);
			delete $scope.record.specializationId;
			$scope.record['specializationId'] = $scope.specializationIdToSave;
			doctorService.create($scope.record).then(function(response) {
			$scope.cancelRecord();	
			getAllDoctors();
			$scope.currentPage = 'Create';
			});
		}
		
		$scope.setRowData = function(row) {
			$scope.currentPage = 'Update';
			$scope.rowData = row;
			$scope.updatePage = true;

			var spec = $scope.rowData.specializationId;
			var listOfspecializations = spec.split(',');
			$scope.rowData.specializationId= listOfspecializations;
			$scope.record['specializationId']=$scope.rowData.specializationId;
			console.log($scope.rowData.specializationId);

			$scope.getAllSpecializationsByDepartmentId(row.departmentId);
			$scope.record = {
			"name":row.name,
			"email":row.email,
			"phone":row.phone,
			"alternatePhone":row.alternatePhone,
			"dob":new Date(row.dob),
			"gender":row.gender,
			"rating":row.rating,
			"experience":row.experience,
			"masterSlot":row.masterSlot,
			"description":row.description,
			"hospitalId":row.hospitalId,
			"departmentId":row.departmentId,
			"specializationId":row.specializationId,
			"id" : row.id			
			};

		};
		$scope.updateRecord = function() {

			$scope.specializationIdToSave = JSON.stringify($scope.record.specializationId);
			delete $scope.record.specializationId;
			$scope.record['specializationId'] = $scope.specializationIdToSave;
			console.log($scope.record);
			doctorService.update($scope.record).then(function(response) {
				getAllDoctors();
				$scope.cancelRecord();
			});
		}
		$scope.emptyForm = function() {
			$scope.updatePage = false;
			$scope.record = {
			"name":"",
			"email":"",
			"phone":"",
            "alternatePhone":"",
            "dob":"",
             "gender":"",
			"rating":"",
			"experience":"",
			"masterSlot":"",
			"description":"",
			"hospitalId":"",
			"departmentId":"",
			"specializationId":""
		};
			
		};

		

		$scope.rowSelect = function(row) {
			$scope.selected.push(row);
		};
		$scope.headerCheckbox = false;
		$scope.selectAll = function() {
			if(!$scope.headerCheckbox){
			for ( var i in $scope.doctorsData) {
				$scope.doctorsData[i]["checkboxValue"] = 'on';
				$scope.selected.push($scope.doctorsData[i]);
			};
			$scope.headerCheckbox = ($scope.headerCheckbox == false)?true:false;
		}else if($scope.headerCheckbox){
			for ( var i in $scope.doctorsData) {
				$scope.doctorsData[i]["checkboxValue"] = 'off';
				$scope.selected = [];
			};
			$scope.headerCheckbox = ($scope.headerCheckbox == true)?false:true;
		};
		//console.log($scope.selected);
		};

		
		$scope.deleteRow = function(ev,row) {
			// Appending dialog to document.body to cover sidenav in docs app
			
				var confirm = $mdDialog
						.confirm()
						.title('Are you sure want to Delete Record?')
						
						.ariaLabel('Lucky day').targetEvent(ev).ok(
								'Ok').cancel('Cancel');

				$mdDialog.show(confirm).then(function() {
						doctorService.deleteRow(row.id).then(function(response) {
							getAllDoctors();
			});
						   
				}, function() {
					$scope.status = 'You decided to keep your Task.';
				});
			

		};

		var deregisterListener = $rootScope.$on("CallDoctorMethod", function(){
			if ($rootScope.$$listeners["CallDoctorMethod"].length > 1) {
				            $rootScope.$$listeners["CallDoctorMethod"].pop();

        		}
        		$scope.currentPage = 'Create';
           $scope.toggleRight();
           $scope.emptyForm();
        });       
 		var deregisterListener = $rootScope.$on("CallDoctorSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallDoctorSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallDoctorSearchMethod"].pop();
            }            
             $rootScope.filterByText = args.text;
        });

		$scope.exportData = function(tableId) {
			// $scope.tasksOptions = [ $scope.tasksData.length ];
			var exportHref = Excel.tableToExcel(tableId, 'sheet name');
			$timeout(function() {
				location.href = exportHref;
			}, 100); // trigger download
		}

		/* Tooltip Starrts */

		$scope.demo = {
			showTooltip : false,
			tipDirection : ''
		};

		$scope.demo.delayTooltip = undefined;
		$scope.$watch('demo.delayTooltip', function(val) {
			$scope.demo.delayTooltip = parseInt(val, 10) || 0;
		});

		$scope.$watch('demo.tipDirection', function(val) {
			if (val && val.length) {
				$scope.demo.showTooltip = true;
			}
		});
		/* Tooltip Ends */

		/* Side nav starts */
		$scope.toggleLeft = buildDelayedToggler('left');
		$scope.toggleRight = buildToggler('right');
		$scope.isOpenRight = function() {
			return $mdSidenav('right').isOpen();
		};

		function debounce(func, wait, context) {
			var timer;

			return function debounced() {
				var context = $scope, args = Array.prototype.slice
						.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}

		function buildDelayedToggler(navID) {
			return debounce(function() {
				// Component lookup should always be available since we are not
				// using `ng-if`
				$mdSidenav(navID).toggle().then(function() {
					$log.debug("toggle " + navID + " is done");
				});
			}, 200);
		}

		function buildToggler(navID) {

			return function() {
				// Component lookup should always be available since we are not
				// using `ng-if`
				$mdSidenav(navID).toggle().then(function() {
					$log.debug("toggle " + navID + " is done");
				});
			}
		}
	}	/* Side nav ends */
init();
	return self;
};

dasApplication.directive('createDoctor', function($state) {
	return {
		restrict : 'E',
		replace : true,
		templateUrl : function() {
			var current = $state.current.name;
			return '../das/pages/' + current + '/' + current + '.record.html';
		}
	};
});
