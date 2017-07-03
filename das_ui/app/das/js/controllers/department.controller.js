/*(function() {*/
'use strict';
dasApplication.controller("departmentController", departmentController);

function departmentController($scope, departmentService, $mdDialog,$rootScope, $mdToast,
        $timeout, $state, $mdSidenav, $log) {

    var self = {
        init : init
    };
    function init() {
        // console.log($state.current.name);
         $rootScope.currentController = 'Department';
        var current = $state.current.name;
        $rootScope.currentDataEnable = true;
        $scope.currentState = current.split(/[\s.]+/);
        $scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
        $scope.customFullscreen = false;
        $scope.updatePage = false;
        $scope.departmentData = [];
        $scope.collection = [];
        $scope.selected = [];
        $scope.headerEnable = {};
        $scope.exportData = [];
       

        $scope.record = {

                        "departmentName": "",
                        "description": ""

        };
            $scope.loading=true;

            departmentService.getAllDepartments().then(function(response) {
            $scope.departmentData = response.data;
            $scope.departmentLength = response.data.length;
            $rootScope.currentTableLength = 'Records Count :'+response.data.length;
        //  console.log($scope.employeesData);
            $scope.departmentOptions = [ 200,300 ];
            $scope.departmentPage = {
                pageSelect : true
            };
            $scope.query = {
                order : 'name',
                limit : 100,
                page : 1
            };
            $scope.loading=false;
        }, function(error) {
            alert("failed");
                    $scope.loading=false;
        });


        
         
        var deregisterListener = $rootScope.$on("CallDepartmentMethod", function(){
            if ($rootScope.$$listeners["CallDepartmentMethod"].length > 1) {
                            $rootScope.$$listeners["CallDepartmentMethod"].pop();

                }
                $scope.currentPage = 'Create';
           $scope.toggleRight();
           $scope.emptyForm();
         
        });
 var deregisterListener = $rootScope.$on("CallDepartmentSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallDepartmentSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallDepartmentSearchMethod"].pop();
            }            
            $scope.filterByText = args.text;
        });
           
 $scope.saveRecord = function() {
    console.log($scope.record);
            departmentService.create($scope.record).then(function(response) {
             console.log(response);
            });
            $scope.cancelRecord();
              window.location.reload();
        }
         $scope.setRowData = function(row) {
                //console.log(row);
                $scope.updatePage = true;
                $scope.currentPage = 'Update';
                $scope.record = {
                            "departmentName":row.departmentName,
                             "description": row.description,
                             "id":row.id
                };
            };
            $scope.updateData = function() {
               departmentService.update($scope.record).then(function(response) {
                });
                $scope.cancelRecord();
                   window.location.reload();
                    $scope.currentPage = 'Create';
            }
             $scope.emptyForm = function() {
                    $scope.updatePage = false;
                    $scope.record = {
                                 "departmentName": "",
                                 "description": ""
                };
                };
               $scope.cancelRecord = function() {
                    $mdSidenav('right').close().then(function() {
                            $log.debug("close RIGHT is done");
                        });
                        
                    };
                    $scope.rowSelect = function(row) {
                    $scope.selected.push(row.id);
                };

        

         $scope.deleteRow = function(ev,row) {
            
                var confirm = $mdDialog
                        .confirm()
                        .title('Are you sure want to Delete Record?')
                        
                        .ariaLabel('Lucky day').targetEvent(ev).ok(
                                'Ok').cancel('Cancel');

                $mdDialog
                        .show(confirm)
                        .then(
                                function() {
                                    departmentService.deleteRow(row.id).then(function(response) {
                
            });
                                   window.location.reload();
                                },
                                function() {
                                    $scope.status = 'You decided to keep your Task.';
                                });
            
    
        };
        
       
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
    }
    init();
   
               return self;
};

dasApplication.directive('createDepartment', function($state) {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : function() {
            var current = $state.current.name;
            return '../das/pages/' + current + '/' + current + '.record.html';
        }
    };
});
dasApplication.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase()
                + input.substr(1).toLowerCase() : '';
    }
});

dasApplication
        .factory(
                'Excel',
                function($window) {
                    var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>', base64 = function(
                            s) {
                        return $window.btoa(unescape(encodeURIComponent(s)));
                    }, format = function(s, c) {
                        return s.replace(/{(\w+)}/g, function(m, p) {
                            return c[p];
                        })
                    };
                    return {
                        tableToExcel : function(tableId, worksheetName) {
                            var table = $(tableId), ctx = {
                                worksheet : worksheetName,
                                table : table.html()
                            }, href = uri + base64(format(template, ctx));
                            return href;
                        }
                    };
                });
