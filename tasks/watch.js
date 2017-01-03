var gulp = require('gulp');
var gutil = require('gulp-util');
var seq = require('gulp-sequence');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('less-reload', function () {
    seq('less')(reload);
});

gulp.task('js-reload', function () {
    reload();
});

gulp.task('view-reload', function () {
    seq('generate-views', 'inject-assets')(reload);
});

gulp.task('html-reload', function () {
    reload();
});

gulp.task('watch', function () {
    gulp.watch('./styles/*.less', ['less-reload']);
    gulp.watch('./scripts/*.js', ['js-reload']);
    gulp.watch('./views/*.html', ['view-reload']);
    gulp.watch('./*.html', ['html-reload']);

    // browser sync    
    browserSync.init({
        server: {
            baseDir: '.',
            index: 'main.html'
        },
        port: 4000,
        ui: {
            port: 4001
        }
    });
});