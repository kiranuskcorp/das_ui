
'use strict';
dasApplication.controller("leftNavController", leftNavController);

function leftNavController($scope, leftNavService, Excel, $state, $mdDialog,
    $mdToast, $timeout, $mdSidenav, $log, $rootScope, $document,$window,logoutService) {
    var self = {
        init: init,
        buildToggler: buildToggler
    };

    $scope.toggleStart = false;
    $rootScope.currentDataEnable = false;
    $scope.hoverIn = function() {
        $scope.toggleStart = true;
    };
    $scope.logout = function() {
        logoutService.logout();
    };
   //logoutService.logout();

    $scope.hoverOut = function() {
        $scope.toggleStart = false;
    };
    $scope.toggle = function(itemPos) {
        if ($scope.menuIsOpen === itemPos) {
            $scope.menuIsOpen = 0;
        } else {
            $scope.menuIsOpen = itemPos;
        }
    }
    $scope.$on('$locationChangeStart', function(event) {
          $scope.filterTable = ""; 
    });

     
    $scope.filter = $rootScope.filterTable;
    $rootScope.currentTableLength;
    $scope.searchRecord = function(text) {
         $rootScope.filterTable = $scope.text;
        switch ($rootScope.currentController) {
            
            case 'Specialization':
                $rootScope.$emit("CallSpecializationSearchMethod", {
                    text: text
                });
                break;
           
            case 'Department':
                $rootScope.$emit("CallDepartmentSearchMethod", {
                    text: text
                });
                break;
                case 'User':
                $rootScope.$emit("CallUserSearchMethod", {
                    text: text
                });
                break;
              case 'Appointment':
                $rootScope.$emit("CallAppointmentSearchMethod", {
                    text: text
                });
                break;
            
            case 'Hospital':
                $rootScope.$emit("CallHospitalSearchMethod", {
                    text: text
                });
                break;

                case 'Doctor':
                $rootScope.$emit("CallDoctorSearchMethod", {
                    text: text
                });
                break;  

                case 'Diseases':
                $rootScope.$emit("CallDiseasesSearchMethod", {
                    text: text
                });
                break;   
             
                case 'Role':
                $rootScope.$emit("CallRoleSearchMethod", {
                    text: text
                });
                break;  

        }
    }
    $scope.addRecord = function() {
        
    switch($rootScope.currentController){
            case 'Specialization':
            $rootScope.$emit("CallSpecializationMethod", {});
            break;
            case 'Department':
            $rootScope.$emit("CallDepartmentMethod", {});
            break;
            case 'User':
            $rootScope.$emit("CallUserMethod", {});
            break;
            case 'Appointment':
            $rootScope.$emit("CallAppointmentMethod", {});
            break;
             case 'Hospital':
            $rootScope.$emit("CallHospitalMethod", {});
            break;
             case 'Doctor':
            $rootScope.$emit("CallDoctorMethod", {});
            break;
             case 'Role':
            $rootScope.$emit("CallRoleMethod", {});
            break;
            case 'Diseases':
            $rootScope.$emit("CallDiseasesMethod", {});

             case 'Reporting':
            $rootScope.$emit("CallReportingMethod", {});

            break;
            }
    };


    $scope.exportData = function() {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
    };

    function init(role) {
        leftNavService.getAllTabs(role).then(function(response) {
             $scope.leftTabs = response.data;
        });
        /*leftNavService.getAllTabThrees().then(function(response) {
            $scope.leftTabThrees = response.data;
        });
        leftNavService.getAllTabTwos().then(function(response) {
            $scope.leftTabTwos = response.data;
        });*/

    }


     $rootScope.$on("roleBasedNavList", function(event, args) {
           init(args.role);
     });

    function buildToggler(componentId) {
        return function() {
           // console.log(localStorage.getItem( 'loggedInUser'));
            var role = JSON.parse(localStorage.getItem('loggedInUser')).data[0].role;
            init(role);
            $mdSidenav(componentId).toggle();
        }
    }
    $scope.init = self.init;
    $scope.toggleNavigationLeft = buildToggler('left');
    init("Admin");

    return self;
};
