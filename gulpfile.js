var gulp = require('gulp');
var gutil = require('gulp-util');
var seq = require('gulp-sequence');

require('require-dir')('./tasks');

gulp.task('default', function(callback) {
    seq('build', 'proxy', 'watch')(callback);
});

gulp.task('serve', function(callback) {
    seq('build', 'proxy', 'watch')(callback);
});