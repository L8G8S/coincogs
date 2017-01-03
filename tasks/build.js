var gulp = require('gulp');
var gutil = require('gulp-util');
var seq = require('gulp-sequence');

var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

var fileinclude = require('gulp-file-include');
var inject = require('gulp-inject');
var rename = require('gulp-rename');

gulp.task('less', function() {
    gulp.src('./styles/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(function(f) { return f.base; }))
});

// https://www.npmjs.com/package/gulp-file-include
gulp.task('generate-views', function() {
    return gulp.src('./views/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        /*
        .pipe(rename(function (path) {
            path.basename = path.basename.replace("_template", "");
            path.extname = ".html";
        }))
        */
        .pipe(gulp.dest('./'));
});

// https://www.npmjs.com/package/gulp-inject
gulp.task('inject-assets', function() {
    return gulp.src('./*.html')
        .pipe(inject(
            gulp.src(['./scripts/*.js', './styles/*.css', './*.html'], {read: false}), {
                transform: function (filepath) {

                    //arguments[0] = arguments[0].replace('/html_mockup', '');

                    //if (filepath.slice(-5) === '.html') {
                    //    var fileName = filepath.substring(filepath.lastIndexOf('/') + 1);

                    //    if (fileName !== "index.html") {
                    //        fileName = fileName.replace("_", " ").replace(".html", "").replace(/\w\S*/g, function (txt) {
                    //            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    //        });

                    //        return '<li><a href="' + filepath + '">' + fileName + '</a></li>';
                    //    }
                    //    else {
                    //        return null;
                    //    }
                    //}

                    // Use the default transform as fallback
                    return inject.transform.apply(inject.transform, arguments);
                }
            }, { relative: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('build', function(callback) {
    seq('less', 'generate-views', 'inject-assets')(callback);
});