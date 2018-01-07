const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync')
const concat = require('gulp-concat')
const del = require('del')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const nunjucks = require('gulp-nunjucks')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const runSequence = require('run-sequence')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const surge = require('gulp-surge')
const uglify = require('gulp-uglify')

gulp.task('browser-sync', () =>
  browserSync.init({
    server: 'dest'
  })
)

gulp.task('build', callback =>
  runSequence('clean', ['images', 'scripts', 'stylesheets', 'templates'], callback)
)

gulp.task('clean', () =>
  del('dest')
)

gulp.task('default', ['build', 'watch'])

gulp.task('images', () =>
  gulp.src('src/images/*')
    .pipe(gulp.dest('dest/images'))
)

gulp.task('scripts', () =>
  gulp.src([
    'node_modules/when-in-viewport/dist/whenInViewport.js',
    'src/scripts/*.js'
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(concat('index.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dest/scripts'))
    .on('end', browserSync.reload)
)

gulp.task('stage', ['build'], () =>
  surge({
    project: 'dest',
    domain: 'australian-ethical-invest-for-a-better-world.surge.sh'
  })
)

gulp.task('stylesheets', () =>
  gulp.src('src/stylesheets/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed',
        precision: 10
      }))
      .pipe(autoprefixer())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dest/stylesheets'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }))
)

gulp.task('templates', () =>
  gulp.src('src/templates/*.njk')
    .pipe(plumber())
    .pipe(nunjucks.compile())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dest'))
    .on('end', browserSync.reload)
)

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch('src/images/*', ['images'])
  gulp.watch('src/scripts/**/*.js', ['scripts'])
  gulp.watch('src/stylesheets/**/*.scss', ['stylesheets'])
  gulp.watch('src/templates/**/*.njk', ['templates'])
})
