var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del');

gulp.task('styles', function() {
    return gulp.src('src/main/ui/stylesheets/*')
        .pipe(sass())
        .pipe(gulp.dest('src/main/rails/public')
        .pipe(rename({suffix: '.min'})));
});

gulp.task('default', function() {
    gulp.start('styles');
});