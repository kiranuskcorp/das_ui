describe('Session Management Service Spec', function () {
    var SessionManagementService,__env,httpPOST,httpGET,$window,$q;
    beforeEach(function () {
    $window = {location: { replace: jasmine.createSpy()} };
    module("DmtApplication", function($provide) {
            $provide.constant("__env", {baseUrl : 'http://policy2.admin.base.url.dev',context :'/policy2-admin',logoutPath : '/logout'});
            $provide.value('$window', $window);
        });
        inject(function ($http,_SessionManagementService_,___env_,_$window_,_$q_) {
            httpPOST = spyOn($http, 'post');
            httpGET = spyOn($http, 'get');
            SessionManagementService = _SessionManagementService_;
            __env = ___env_;
            $window = _$window_;
            $q = _$q_;

        });
    });
     
    it('to check session management service is hitting timeCheck url or not', function () {
        SessionManagementService.timeCheck();
        expect(httpGET).toHaveBeenCalled();
    });
    it('to check session management service is hitting keepALive url or not', function () {
        SessionManagementService.keepALive();
        expect(httpGET).toHaveBeenCalled();
    });
    it('to check session management service is hitting logout url or not', function () {
        
        SessionManagementService.logout();
        expect($window.location.replace).toHaveBeenCalledWith(__env.baseUrl+__env.context+__env.logoutPath);
    });
 
});