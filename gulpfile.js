var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css');

gulp.task('browser-sync', function() {
   browserSync({
      server: {
         baseDir: './'
      }
   });
});

gulp.task('bs-reload', function () {
   browserSync.reload();
});

gulp.task('less', function () {
   gulp.src('less/app.less')
      .pipe(less())
      .pipe(gulp.dest('./'))
      .pipe(minifyCSS())
      .pipe(rename('app.min.css'))
      .pipe(gulp.dest('./'));
});

gulp.task('watch', ['browser-sync'], function() {
   gulp.watch(['*.html', 'less/*.less'], ['bs-reload']);
});

gulp.task('default', ['browser-sync', 'less'], function () {
    gulp.watch(['*.html', 'less/*.less'], ['bs-reload']);
    gulp.watch('less/*.less', ['less']);
});
