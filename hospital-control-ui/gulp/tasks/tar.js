'use strict';

var gulp = require('gulp');
var tar = require('gulp-tar');
var config = require('../config');

gulp.task('tar', function () {

    return gulp.src(config.tar.src)
        .pipe(tar(config.tar.name))
        .pipe(gulp.dest(config.tar.dest));

});
