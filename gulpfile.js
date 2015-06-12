var del    = require('del');
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var moduleName = 'qna';

var paths = {
  dist: 'dist/',
  src: ['index.js']
};

var defaultTasks = ['lint'];

gulp.task('lint', function() {
  return gulp.src([].concat(__filename, paths.src))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function(cb) {
  del([paths.dist], cb);
});

gulp.task('dist', ['clean'], function() {
  return gulp.src(paths.src)
    .pipe(rename({ basename: moduleName }))
    .pipe(gulp.dest(paths.dist))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('default', defaultTasks);