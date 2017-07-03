describe('Events Controller', function() {
    var mockService,deferred,defer;
    var $scope,$window, $rootScope, $q,confirm, controller, $controller, service, env, Idle, $mdDialog, httpPOST, httpGET, CreateTarget;
    beforeEach(function() {
        module('ngMaterial');
        module('ui.router');
        module('ngIdle');
        module('DmtApplication');
        $window = {location: { replace: jasmine.createSpy()} };
        module(function($provide) {
            $provide.constant("__env", {
                baseUrl: 'http://policy2.admin.base.url.dev',
                context: '/policy2-admin',
                logoutPath: '/logout',
                sessionTimedOut:'/sessionTimedOut',
                sessionWarnBefore: 60000
        });
        $provide.value('$window', $window);
       /* $provide.factory('SessionManagementService', function($q,$window,__env,$http){
                    function timeCheck(){
                        deferred = $q.defer();
                        deferred.resolve({"timeToLive":70});
                        return deferred.promise;
                    }
                    function keepALive(){
                        deferred = $q.defer();
                        deferred.resolve({"timeToLive":80});
                        return deferred.promise;
                    }
                    
                    function logout() {
                        $window.location.replace(__env.baseUrl+__env.context+__env.logoutPath);
                    }
                    function timedOut() {
                        $window.location.replace(__env.baseUrl+__env.context+__env.sessionTimedOut);
                    }
                    
                    return{timeCheck: timeCheck,keepALive:keepALive,timedOut:timedOut,logout:logout};
        });*/

        });
        inject(function(_$controller_, _SessionManagementService_, ___env_, _Idle_, _$mdDialog_, _$rootScope_, $http,_$q_) {
                $rootScope = _$rootScope_;
                $scope = _$rootScope_.$new();
                $controller = _$controller_;
                mockService = _SessionManagementService_;
                env = ___env_;
                Idle = _Idle_;
                $mdDialog = _$mdDialog_;
                $q = _$q_;
                defer = _$q_.defer();
                spyOn(Idle, 'setIdle');
                spyOn(Idle, 'setTimeout');
                //spyOn(Idle, 'unwatch');
                httpPOST = spyOn($http, 'post');
                httpGET = spyOn($http, 'get');
                /*spyOn(mockService, 'timeCheck').and.callThrough();
                spyOn(mockService, 'timedOut').and.callThrough();*/
                spyOn(mockService, 'timeCheck').and.returnValue(defer.promise);
                spyOn(mockService, 'timedOut').and.returnValue($window.location.replace(__env.baseUrl+__env.context+__env.logoutPath));
                spyOn(mockService, 'logout').and.returnValue($window.location.replace(__env.baseUrl+__env.context+__env.sessionTimedOut));
                spyOn(mockService, 'keepALive').and.returnValue(defer.promise);
                //spyOn(mockService, 'logout').and.callThrough();
                confirm = $mdDialog.confirm()
                    .title('Session Timeout')
                    .textContent('Your session is about to expire due to inactivity.')
                    .ariaLabel('')
                    .targetEvent(this)
                    .ok('Stay logged in')
                    .cancel('Logout now');
                
            });

        CreateTarget = function() {
                return $controller('EventsController', {
                    $scope: $scope,
                    Idle: Idle,
                    SessionManagementService: mockService,
                    __env: env,
                    $mdDialog: $mdDialog
                });
        };
        controller = CreateTarget();



    });

it('Is Dialog shown on IdleStart', function() {
            spyOn($mdDialog, 'show').and.callThrough();
            $mdDialog.show(confirm);
            $scope.$broadcast('IdleStart');
            $scope.$digest();
            expect($mdDialog.show).toHaveBeenCalledWith(confirm);
});
it('Is Dialog shown on IdleStart and on clicking Stay logged in then api call to callKeepALive and based on condition timed out', function() {
                var deferred = $q.defer(); 
                $mdDialog.show = function (options) {
                // Return the dummy promise
                return deferred.promise;
                };
                spyOn(controller, 'callKeepALive').and.callThrough();
                $scope.$broadcast('IdleStart');
                defer.resolve({"timeToLive":40});
                controller.sessionWarnBefore = env.sessionWarnBefore/1000;                
                deferred.resolve(true);
                $scope.$digest();
                expect(controller.timeToLive < controller.sessionWarnBefore).toBe(true);
                mockService.keepALive();
                mockService.timedOut();
               
                expect(controller.callKeepALive).toHaveBeenCalled();
                expect($window.location.replace).toHaveBeenCalledWith(__env.baseUrl+__env.context+__env.sessionTimedOut);
});

it('Is Dialog shown on IdleStart and on clicking Stay logged in then api call to callKeepALive ', function() {
                var deferred = $q.defer(); 
                $mdDialog.show = function (options) {
                // Return the dummy promise
                return deferred.promise;
                };
                spyOn(controller, 'callKeepALive').and.callThrough();
                $scope.$broadcast('IdleStart');
                deferred.resolve(true);
                defer.resolve({"timeToLive":70});
                deferred.resolve(true);
                controller.sessionWarnBefore = env.sessionWarnBefore/1000;                
                mockService.keepALive();
                $scope.$digest();
                expect(controller.timeToLive < controller.sessionWarnBefore).toBe(false);
                expect(controller.callKeepALive).toHaveBeenCalled();
                
              
});



it('Is Dialog shown on IdleStart and on clicking Logout now then api call to logout', function() {
                var deferred = $q.defer(); 
                $mdDialog.show = function (options) {
                // Return the dummy promise
                return deferred.promise;
                };
                $scope.$broadcast('IdleStart');
                controller.sessionWarnBefore = env.sessionWarnBefore;                
                deferred.resolve("Some Text");
                mockService.logout();
                $scope.$digest();
                expect($window.location.replace).toHaveBeenCalledWith(__env.baseUrl+__env.context+__env.logoutPath);
});


it('Is Dialog shown on IdleTimeout call to callTimeCheck and based on condition timed out', function() {
            var deferred = $q.defer(); 
            $scope.$broadcast('IdleTimeout');
            controller.callTimeCheck();
            deferred.resolve({"timeToLive":70});
            mockService.timedOut();
            $scope.$digest();
            expect($window.location.replace).toHaveBeenCalledWith(__env.baseUrl+__env.context+__env.sessionTimedOut);
});

it('Is Error Dialog is show when keepalive api returns an error', function() {
            spyOn($mdDialog, 'show').and.callThrough();
            controller.callKeepALive();
            defer.reject("Error");
            mockService.keepALive();
            $scope.$digest();
            expect($mdDialog.show).toHaveBeenCalled();
});


it('Is Error Dialog is show when keepalive api returns an error and on clicking OK then api call to logout', function() {
            spyOn($mdDialog, 'show').and.callThrough();
            controller.callKeepALive();
            defer.reject("Error");
            mockService.keepALive();
            $scope.$digest();
            $scope.closeDialog();
            mockService.logout();
            expect($window.location.replace).toHaveBeenCalledWith(__env.baseUrl+__env.context+__env.logoutPath);
});


it('Is Error Dialog is show when timeCheck api returns an error', function() {
            spyOn($mdDialog, 'show').and.callThrough();
            controller.callTimeCheck();
            defer.reject("Error");
            mockService.timeCheck();
            $scope.$digest();
            expect($mdDialog.show).toHaveBeenCalled();
});


it('Is Error Dialog is show when timeCheck api returns an error and on clicking OK then api call to logout', function() {
            spyOn($mdDialog, 'show').and.callThrough();
            controller.callTimeCheck();
            defer.reject("Error");
            mockService.timeCheck();
            $scope.$digest();
            $scope.closeDialog();
            mockService.logout();
            expect($window.location.replace).toHaveBeenCalledWith(__env.baseUrl+__env.context+__env.logoutPath);
});




   
    
    
});