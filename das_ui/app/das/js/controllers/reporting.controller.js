/*(function() {*/
'use strict';
dasApplication.controller("reportingController", reportingController);

function reportingController($scope, reportingService, Excel, $state, $mdDialog,
		$mdToast, $timeout, $mdSidenav, $log,$rootScope) {
	var self = {
		init : init
	};
	function init() {
		$rootScope.currentController = 'Reporting';
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
				 
		

		$scope.loading = true;
		reportingService.getAllDoctors().then(function(response) {
            $scope.doctors = response.data;
        });

		reportingService.getAllReportings().then(function(response) {
			/*      $scope.reportingsData = $rootScope.reportingsData
			console.log(response.data);
			$scope.reportingsData = response.data;
			$scope.reportingsLength = response.data.length;
			$rootScope.currentTableLength = 'Total Records:'+response.data.length;
			// console.log($scope.tasksData);
			$scope.reportingsOptions = [ 200 , 300];
			$scope.reportingPage = {
				pageSelect : true
			};
			$scope.query = {
				order : 'name',
				limit : 100,
				page : 1
			};*/
			$scope.loading = false;
		}, function(error) {
	alert("failed");
					$scope.loading=false;
		});		
		var deregisterListener = $rootScope.$on("CallReportingMethod", function(){
			if ($rootScope.$$listeners["CallReportingMethod"].length > 1) {
				            $rootScope.$$listeners["CallReportingMethod"].pop();

        		}
           $scope.toggleRight();
           $scope.emptyForm();
        });       
 var deregisterListener = $rootScope.$on("CallReportingSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallReportingSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallReportingSearchMethod"].pop();
            }            
            $scope.filterByText = args.text;
        });
	}
	init();
	$scope.getCitiesByState = function(state){
		reportingService.getAllCities(state).then(function(response) {
            $scope.cities = response.data;
        });
	}



	$scope.saveRecord = function() {

$scope.fromDate = $scope.record.fromDate;
delete $scope.record.fromDate;
		$scope.convert= function(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
        var fromDate = [ date.getFullYear(), mnth, day ].join("-");
        $scope.fromDate= fromDate;
        $scope.record.fromDate=$scope.fromDate;   
    }
$scope.convert($scope.fromDate);
$scope.toDate = $scope.record.toDate;
delete $scope.record.toDate;
		$scope.convert= function(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
        var toDate = [ date.getFullYear(), mnth, day ].join("-");
        $scope.toDate= toDate;
        $scope.record.toDate=$scope.toDate;
}
$scope.convert($scope.toDate);
			$scope.record['fromDate'] = $scope.record.fromDate;
			$scope.record['toDate'] = $scope.record.toDate;	
				
			reportingService.create($scope.record).then(function(response) {
				  $scope.reportingsData = response.data;
				console.log("$scope.reportingsData",$scope.reportingsData);
			});					
			$scope.cancelRecord();	
			 //  window.location.reload();
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
			reportingService.update($scope.record).then(function(response) {
				//console.log("resp", response);
			});
			$scope.cancelRecord();
			   window.location.reload();
			$scope.currentPage = 'Create';
		}
		$scope.emptyForm = function() {
			$scope.updatePage = false;
			$scope.record = {
            "doctorId":"",
			"fromDate":"",
			"toDate":""	
		}
			
		};

		$scope.rowSelect = function(row) {
			$scope.selected.push(row);
		};
		$scope.headerCheckbox = false;
		$scope.selectAll = function() {
			if(!$scope.headerCheckbox){
			for ( var i in $scope.reportingsData) {
				$scope.reportingsData[i]["checkboxValue"] = 'on';
				$scope.selected.push($scope.reportingsData[i]);
			};
			$scope.headerCheckbox = ($scope.headerCheckbox == false)?true:false;
		}else if($scope.headerCheckbox){
			for ( var i in $scope.reportingsData) {
				$scope.reportingsData[i]["checkboxValue"] = 'off';
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
						reportingService.deleteRow(row.id).then(function(response) {
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

dasApplication.directive('createReporting', function($state) {
	return {
		restrict : 'E',
		replace : true,
		templateUrl : function() {
			var current = $state.current.name;
			return '../das/pages/' + current + '/' + current + '.record.html';
		}
	};
});
