/*(function() {*/
'use strict';
dasApplication.controller("appointmentController", appointmentController);

function appointmentController($scope, appointmentService, Excel, $state, $mdDialog,
    $mdToast, $timeout, $mdSidenav, $log, $rootScope) {
    var self = {
        init: init
    };

    function init() {
        $rootScope.currentController = 'Appointment';
        var current = $state.current.name;
        $rootScope.currentDataEnable = true;
        $scope.currentState = current.split(/[\s.]+/);
        $scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
        $scope.customFullscreen = false;
        $scope.updatePage = false;
        $scope.currentPage = 'Create';
        $scope.doctorSelected = false;
        $scope.currentDate = new Date();
        $scope.record = {};


            $scope.loading=true;
             function getAllAppointments(){
                 appointmentService.getAllAppointments().then(function(response) {
                 $scope.appointments = response.data;
             $rootScope.currentTableLength = 'Total Appointments :'+response.data.length;
             $scope.loading=false;
         });
             }
             getAllAppointments();

           

      /*  $scope.cancelRecord = function() {
            $mdSidenav('right').close().then(function() {
                $log.debug("close RIGHT is done");
            });
        }*/

         var deregisterListener = $rootScope.$on("CallAppointmentMethod", function() {
           $scope.updatePage = false;
            if ($rootScope.$$listeners["CallAppointmentMethod"].length > 1) {
                $rootScope.$$listeners["CallAppointmentMethod"].pop();

            }

            
            $scope.currentPage = 'Create';
            $scope.emptyForm();
            $scope.toggleRight();

        });

        var deregisterListener = $rootScope.$on("CallAppointmentSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallAppointmentSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallAppointmentSearchMethod"].pop();
            }
            $rootScope.filterByText = args.text;
        });


        appointmentService.getAllAppointments().then(function(response) {
            $scope.appointments = response.data;
            console.log($scope.appointments);
             $rootScope.currentTableLength = 'Records Count :'+response.data.length;
        });

        appointmentService.getAllTimes().then(function(response) {
            $scope.times = response.data;
        });
        appointmentService.getAllHospitals().then(function(response) {
            $scope.hospitals = response.data;
        });
        appointmentService.getAllStates().then(function(response) {
            $scope.states = response.data;
        });
        appointmentService.getAllCities().then(function(response) {
            $scope.cities = response.data;
        });
        
        appointmentService.getAllDiseases().then(function(response) {
            $scope.diseases = response.data;
            console.log("diseases",$scope.diseases);
        });
        /*appointmentService.getCountry().then(function(response) {
            $scope.countries = response.data;
            console.log($scope.countries);
        });*/

        


   /* $scope.getCountryStates = function(){
        $scope.sates=appointmentService.getCountryState($scope.record.Country);//states
        console.log($scope.sates);
        $scope.cities =[];
    };

    $scope.getStateCities = function(){
         $scope.cities=appointmentService.getStateCity($scope.record.State);
         console.log($scope.cities);
    };*/
    

        $scope.saveRecord = function() {
            appointmentService.create($scope.record).then(function(response) {
                $scope.cancelRecord();
                getAllAppointments();
            });
        }

        $scope.setRowData = function(appointment) {
            
             $scope.updatePage = true;
             $scope.currentPage = 'Update';
            $scope.getAllDoctorsByHospitalId(appointment.hospitalId);
            $scope.record = {
                "id": appointment.id,
                "patientName": appointment.patientName,
                "diseasesId": appointment.diseasesId,
                "appointmentDate": new Date(appointment.appointmentDate),
                "doctorId": appointment.doctorId,
                "hospitalId": appointment.hospitalId,
                "phoneNumber": appointment.phoneNumber,
                "registrationId": appointment.registrationId,
                "dob": new Date(appointment.dob),
                "time": appointment.time,
                "email": appointment.email,
                "area": appointment.area,
                "city": appointment.city,
                "state": appointment.state,
                "pincode": appointment.pincode,
                "description": appointment.description
            };
        };


        $scope.updateRecord = function() {
            appointmentService.update($scope.record).then(function(response) {
                $scope.cancelRecord();
                getAllAppointments();
                $scope.currentPage = 'Create';
            });
        }

        $scope.deleteRow = function(ev, id) {


            var confirm = $mdDialog
                .confirm()
                .title('Are you sure want to Delete Record?')

                .ariaLabel('Lucky day').targetEvent(ev).ok(
                    'Ok').cancel('Cancel');

            $mdDialog
                .show(confirm)
                .then(
                    function() {
                        appointmentService.deleteRow(id).then(function(response) {

                        });
                        window.location.reload();
                    },
                    function() {
                        $scope.status = 'You decided to keep your Task.';
                    });
        };

            $scope.cancelRecord = function() {
                    $mdSidenav('right').close().then(function() {
                            $log.debug("close RIGHT is done");
                        });
                        
                    };
                    

        $scope.getAllDoctorsByHospitalId = function(hospital) {
            appointmentService.getAllDoctorsByHospital(hospital).then(function(response) {
            	$scope.doctors = response.data;
                console.log(response.data);
            });
        };
        $scope.getAllHospitalsByDoctorId = function(doctor) {
            /*appointmentService.getAllHospitalsByDoctor(doctor).then(function(response) {

                $scope.hospitals = response.data;
            });*/

            $scope.doctorSelected= true;
                 };

        $scope.setTime = function(event, timeSlot) {

        };

        $scope.emptyForm = function() {
            $scope.updatePage = false;
            $scope.record = {
                "patientName": "",
                "diseases": "",
                "appointmentDate": "",
                "doctorId": "",
                "hospitalId": "",
                "phoneNumber": "",
                "registrationId": "",
                "dob": "",
                "time": "",
                "email": "",
                "area": "",
                "city": "",
                "state": "",
                "pincode": "",
                "description": ""

            };
        };
        /*Header icon functionality*/
       

        /* Side nav starts */
        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function() {
            return $mdSidenav('right').isOpen();
        };

        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice
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