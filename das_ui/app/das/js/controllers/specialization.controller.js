/*(function() {*/
'use strict';
dasApplication.controller("specializationController", specializationController);

function specializationController($scope, specializationService, $mdDialog,$rootScope, $mdToast,
        $timeout, $state, $mdSidenav, $log) {


    var self = {
        init : init
    };
    /*if(localStorage.getItem( 'loggedInUser') == undefined){
        $state.go("app.login");
    }*/

/**
 * Event-Listner for Back-Button
 */
$scope.$on('$locationChangeStart', function(event, next, current){            
    // Here you can take the control and call your own functions:
    // Prevent the browser default action (Going back):
    var path = next.split('/');
    var result = path[path.length - 1];
    if(result != "specialization" && result != "login"){
    event.preventDefault();            
    }
});



    function init() {
        // console.log($state.current.name);
         $rootScope.currentController = 'Specialization';
        var current = $state.current.name;
        $rootScope.currentDataEnable = true;
        $scope.currentState = current.split(/[\s.]+/);
        $scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
        $scope.customFullscreen = false;
        $scope.updatePage = false;
        $scope.specializationData = [];
        $scope.collection = [];
        $scope.selected = [];
        $scope.headerEnable = {};
        $scope.currentPage = 'Create';

        $scope.exportData = [];


        $scope.record = {
            
                        "specializationName": "",
                        "departmentId":"",
                         "description": ""
        };
        $scope.loading=true;
          
        specializationService.getAllDepartment().then(function(response) {
            $scope.departments = response.data;
            console.log($scope.departments);
        });

        function getAllSpecialization(){
            specializationService.getAllSpecialization().then(function(response) {
            $scope.specializationData = response.data;
            $scope.specializationLength = response.data.length;
            $rootScope.currentTableLength = 'Total Specializations :'+response.data.length;
            $scope.specializationOptions = [ 200,300 ];
            $scope.specializationPage = {
                pageSelect : true
            };
            $scope.query = {
                order : 'name',
                limit : 100,
                page : 1
            };
            $scope.loading=false;
            }, function(error) {
            $scope.loading=false;
            });
        }


        getAllSpecialization();
        var deregisterListener = $rootScope.$on("CallSpecializationMethod", function(){
            $scope.currentPage = "Create";
            $scope.updatePage = false;
            if ($rootScope.$$listeners["CallSpecializationMethod"].length > 1) {
                            $rootScope.$$listeners["CallSpecializationMethod"].pop();

                }
            $scope.emptyForm();
            $scope.openSpecialization();    
           
        });

        $scope.openSpecialization = function(){
          
           $timeout(function () {
                clearForm();
            }, 300);

        };

    

        var deregisterListener = $rootScope.$on("CallSpecializationSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallSpecializationSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallSpecializationSearchMethod"].pop();
            }            
            $rootScope.filterByText = args.text;
        });
           

        $scope.saveRecord = function() {
            specializationService.create($scope.record).then(function(response) {
                $scope.cancelRecord();
                /*GET update*/
                getAllSpecialization();

            });
        }



            $scope.setRowData = function(row) {
                  $scope.currentPage = "Update";
                $scope.updatePage = true;
                $scope.record = {
                            "specializationName": row.specializationName,
                            "departmentId":row.departmentId,
                             "description": row.description,
                             "id":row.id
                };
            };
            $scope.updateData = function() {
                specializationService.update($scope.record).then(function(response) {
                    $scope.cancelRecord();
                     /*GET update*/
                     $scope.emptyForm();
                    getAllSpecialization();
                    $scope.currentPage = 'Create';
                });
            }
             $scope.emptyForm = function() {
                 $scope.record["specializationName"] =  "";
                };
               $scope.cancelRecord = function() {
                    $mdSidenav('right').close().then(function() {
                            $log.debug("close RIGHT is done");
                        });
                        
                    };
                    $scope.rowSelect = function(row) {
                    $scope.selected.push(row.id);
                };

          $scope.headerCheckbox = false;
        $scope.selectAll = function() {
            if(!$scope.headerCheckbox){
            for ( var i in $scope.specializationData) {
                $scope.specializationData[i]["checkboxValue"] = 'on';
                $scope.selected.push($scope.specializationData[i]);
            };
            $scope.headerCheckbox = ($scope.headerCheckbox == false)?true:false;
        }else if($scope.headerCheckbox){
            for ( var i in $scope.specializationData) {
                $scope.specializationData[i]["checkboxValue"] = 'off';
                $scope.selected = [];
            };
            $scope.headerCheckbox = ($scope.headerCheckbox == true)?false:true;
        };
        //console.log($scope.selected);
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
                                    specializationService.deleteRow(row.id).then(function(response) {
                
            
                                     getAllSpecialization();
              });                     //window.location.reload();
                                },
                                function() {
                                    $scope.status = 'You decided to keep your Task.';
                                });
            
    
        };



       


        
        /* Side nav ends */
    }
    init();
   
               return self;
};

dasApplication.directive('createSpecialization', function($state) {
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
