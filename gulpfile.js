const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('browser-sync', () =>
  browserSync.init({
    server: 'dest'
  })
);

gulp.task('default', ['stylesheets', 'templates', 'watch']);

gulp.task('stylesheets', () =>
  gulp.src('src/stylesheets/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dest/stylesheets'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }))
);

gulp.task('templates', () =>
  gulp.src('src/templates/*.njk')
    .pipe(plumber())
    .pipe(nunjucks.compile())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dest'))
    .on('end', browserSync.reload)
);

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch('src/stylesheets/**/*.scss', ['stylesheets']);
  gulp.watch('src/templates/**/*.njk', ['templates']);
});
