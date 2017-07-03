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
		$scope.clientsData = [];
		$scope.collection = [];
		$scope.selected = [];
		$scope.headerEnable = {};
		$scope.exportData = [];
		

		
		$scope.cancelRecord = function(){
			$mdSidenav('right').close().then(function() {
				$log.debug("close RIGHT is done");
			});
		}		
				 
		$scope.record = {
			"name":"",
			"email":"",
			"phone":"",
            "alternatePhone":"",
			"departmentName":"",
			"specializationName":"",
			"hospitalName":"",
			"rating":"",
			"experience":"",
			"masterSlot":"",
			"description":""
		};

		$scope.loading = true;
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
        doctorService.getAllSpecializations().then(function(response) {
			$scope.specializations = response.data;
			});
        doctorService.getAllMasterSlots().then(function(response) {
			$scope.masterSlots = response.data;
			});
		doctorService.getAllDoctors().then(function(response) {
			console.log(response.data)
			$scope.doctorsData = response.data;
			$scope.doctorsLength = response.data.length;
			$rootScope.currentTableLength = 'Total Records:'+response.data.length;
			// console.log($scope.tasksData);
			$scope.doctorsOptions = [ 200 , 300];
			$scope.doctorPage = {
				pageSelect : true
			};
			$scope.query = {
				order : 'name',
				limit : 100,
				page : 1
			};
			$scope.loading = false;
		}, function(error) {
	alert("failed");
					$scope.loading=false;
		});		
		var deregisterListener = $rootScope.$on("CallDoctorMethod", function(){
			if ($rootScope.$$listeners["CallDoctorMethod"].length > 1) {
				            $rootScope.$$listeners["CallDoctorMethod"].pop();

        		}
           $scope.toggleRight();
           $scope.emptyForm();
        });       
 var deregisterListener = $rootScope.$on("CallDoctorSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallDoctorSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallDoctorSearchMethod"].pop();
            }            
            $scope.filterByText = args.text;
        });
	}
	init();
	$scope.getCitiesByState = function(state){
		doctorService.getAllCities(state).then(function(response) {
            $scope.cities = response.data;
        });
	}



	$scope.saveRecord = function() {
			//console.log($scope.record);	
			doctorService.create($scope.record).then(function(response) {
				//console.log("resp", response);
			});					
			$scope.cancelRecord();	
			   window.location.reload();

		}
		
		$scope.setRowData = function(row) {
			$scope.currentPage = 'Update';
			$scope.rowData = row;
			$scope.updatePage = true;
			$scope.record = {
			"name":row.name,
			"email":row.email,
			"phone":row.phone,
			"alternatePhone":row.alternatePhone,
			"departmentName":row.departmentId,
			"specializationName":row.specializationId,
			"hospitalName":row.hospitalId,
			"rating":row.rating,
			"experience":row.experience,
			"masterSlot":row.masterSlot,
			"description":row.description,
			"id" : row.id			
		};

		};
		$scope.updateRecord = function() {
			console.log($scope.record);
			doctorService.update($scope.record).then(function(response) {
				//console.log("resp", response);
			});
			$scope.cancelRecord();
			   window.location.reload();
			$scope.currentPage = 'Create';
		}
		$scope.emptyForm = function() {
			$scope.updatePage = false;
			$scope.record = {
			"name":"",
			"email":"",
			"phone":"",
            "alternatePhone":"",
			"departmentName":"",
			"specializationName":"",
			"hospitalName":"",
			"rating":"",
			"experience":"",
			"masterSlot":"",
			"description":""
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
			});
						   window.location.reload();
				}, function() {
					$scope.status = 'You decided to keep your Task.';
				});
			

		};

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
		/* Side nav ends */

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
