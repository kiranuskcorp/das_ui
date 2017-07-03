// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var karma = require('karma').Server; 
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var yuidoc = require("gulp-yuidoc");
var replace = require('gulp-replace-task');
var args = require('yargs').argv;
var fs = require('file-system');

// tasks

gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/das/**/*.css', '!./app/das/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/dmt/'))
});
gulp.task('minify-js', function() {
  gulp.src(['./app/das/**/*.js', '!./app/das/bower_components/**'])
   .pipe(uglify({
      compress:true,
      mangle: {
        except: ['use strict','$scope','$mdThemingProvider','$controller','vm','$http','$log','__env','$location','LogoutService','LogoutController','$rootScope', '$timeout', '$document','window','IdleProvider','KeepaliveProvider','angular','$locationProvider','$stateProvider','$urlRouterProvider','Idle', 'SessionManagementService', '$mdDialog','callTimeCheck','callKeepALive','errorDialog','error','logout','$window','timeCheck','keepALive','timedOut']
      }
    }))
    .pipe(gulp.dest('./dist/das/'))
});
gulp.task('copy-bower-components', function () {
  gulp.src('./app/das/bower_components/**')
    .pipe(gulp.dest('./dist/das/bower_components/'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/dmt/**/*.html')
    .pipe(gulp.dest('./dist/dmt/'));
});
gulp.task('copy-images', function () {
  gulp.src('./app/das/**/*.png')
    .pipe(gulp.dest('./dist/das/'))
});
gulp.task('copy-mock', function () {
  gulp.src('./app/das/**/*.json')
    .pipe(gulp.dest('./dist/das/'))
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});
gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    });     
});
gulp.task('doc', function(){
    gulp.src('./app/js/*.js')
    .pipe(yuidoc.parser())
    .pipe(yuidoc.reporter())
    .pipe(yuidoc.generator())
    .pipe(gulp.dest('./documentation-output'))
});
gulp.task('replace', function() {
    // Get the environment from the command line
    var env = args.env || 'default';
    // Read the settings from the respective json file
    var filename = env + '.json';
    var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));
    // Replace each placeholder with the correct value for the variable.  
    gulp.src('./config/env.js')
        .pipe(replace({
            patterns: [{
                match: 'baseUrl',
                replacement: settings.baseUrl
            }, {
                match: 'sessionWarnBefore',
                replacement: settings.sessionWarnBefore
            }]
        })).pipe(gulp.dest('./app/das/js/'));
});
// default task
gulp.task('default',
  ['lint', 'connect']
);
gulp.task('build', function() {
  runSequence(
    ['clean'],
    [ 'minify-css', 'minify-js', 'copy-html-files', 'copy-images','copy-mock', 'copy-bower-components', 'connectDist']
  );
});