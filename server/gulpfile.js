var gulp = require('gulp');
var mocha = require('gulp-mocha');
var util = require('gulp-util');

gulp.task('test', function () {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'dot' }))
    .on('error', util.log);
});

gulp.task('watch-test', function () {
  gulp.watch(['**/**'], ['test']);
});

gulp.task('start', function () {
  nodemon({
    script: 'app.js',
    tasks: ['test'] })
  .on('restart', function () {
    console.log('restarted!');
  });
});
