'use strict';
describe('LogoutService', function () {
    var LogoutService,__env,$window;
    beforeEach(function () {
    $window = {location: { replace: jasmine.createSpy()} };
    module("DmtApplication", function($provide) {
            $provide.constant("__env", {baseUrl : 'http://policy2.admin.base.url.dev',context :'/policy2-admin',logoutPath : '/logout'});
            $provide.value('$window', $window);
    });
    inject(function (_LogoutService_,_$window_,___env_) {
                LogoutService = _LogoutService_;
                $window = _$window_;
                __env = ___env_;
        });
    });
     
    it('to check logout service is hitting logout url or not', function () {
        LogoutService.logout();
        expect($window.location.replace).toHaveBeenCalledWith(__env.baseUrl+__env.context+__env.logoutPath);
    });
 
});