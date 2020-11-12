var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var fileinclude = require('gulp-file-include');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
//var sourcemaps = require('gulp-sourcemaps');
var gulpPngquant = require('gulp-pngquant');
var svgmin = require('gulp-svgmin');
var del = require('del');
var runSequence = require('run-sequence');
var notify = require('gulp-notify');
var fs = require('fs');
var stripCssComments = require('gulp-strip-css-comments');
var pump = require('pump');
var browserSync = require('browser-sync').create();

// Cargo la primera vez el archivo de configuracion
var config = require('./config.json');

// Errores centralizados de todas las tasks
var onError = notify.onError(function(error) {
  return 'Error: ' + error.message;
});

function reload(done) {
  browserSync.reload();
  done();
}

// Develop server
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: config.dest,
    },
  });
});

// Load config json
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************
gulp.task('loadConfig', function(callback) {
  config = JSON.parse(fs.readFileSync('./config.json'));
  callback();
});

// Include files
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************
gulp.task('fileinclude', function() {
  return gulp
    .src([config.src + '*.{html,php}'], { base: config.src })
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: false,
      }).on('error', onError)
    )
    .pipe(gulp.dest(config.dest));
});

// Sass
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************

gulp.task('sass', function() {
  return gulp
    .src(config.src + 'css/*.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules/susy/sass']
    }).on('error', onError))
    .pipe(gulp.dest(config.dest + 'css'))
    //.pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(config.dest + 'css'));
});
gulp.task('sass_min', function() {
  return (
    gulp
      .src(config.src + 'css/*.scss')
      //.pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', onError))
      .pipe(stripCssComments({ preserve: false }))
      //.pipe(sourcemaps.write('/'))
      .pipe(gulp.dest(config.dest + 'css'))
  );
});

// JS
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************
// Concatenate JS
gulp.task('concat_js', function() {
  return gulp
    .src(config.scriptsFiles)
    //.pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    //.pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(config.dest + 'js'));
});
// Concatenate & Minify JS
gulp.task('concat_js_min', function(cb) {
  pump(
    [
      gulp.src(config.scriptsFiles),
      //sourcemaps.init(),
      concat('scripts.js'),
      uglify(),
      //sourcemaps.write('/'),
      gulp.dest(config.dest + 'js'),
    ],
    cb
  );
});
// Concatenate scripts folder files
gulp.task('scripts_files', function() {
  return gulp
    .src([config.src + 'js/**/*.js'], { base: config.src })
    .pipe(gulp.dest(config.dest));
});
gulp.task('scripts_files_min', function() {
  return gulp
    .src([config.src + 'js/**/*.js'], { base: config.src })
    .pipe(uglify())
    .pipe(gulp.dest(config.dest));
});
// Unifica los js y copia la carpeta scripts
gulp.task('scripts', function(callback) {
  runSequence('concat_js', 'scripts_files', callback);
});
// Unifica y minimiza los js y copia la carpeta scripts y minimiza cara archivo
gulp.task('scripts_min', function(callback) {
  runSequence('concat_js_min', 'scripts_files_min', callback);
});


// Move all images (no compress any image)
gulp.task('images', function() {
  return gulp
    .src([
      config.src + 'img/**/*',
      config.src + 'img/**/*.png',
      config.src + 'img/**/*.jpg',
      config.src + 'img/**/*.svg'
    ], { base: config.src })
    .pipe(gulp.dest(config.dest));
});

// Move Files
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************
// Copia TODOS los archivos que existan en src MENOS las imagenes, los js, los sass, y los includes
// En la carpeta JS NO copia los archivos de las subcarpetas Vendor y Modules, pero los JSs sueltos si
gulp.task('move_files', function() {
  return gulp
    .src(
      [
        config.src + '**/*',

        '!' + config.src + 'img/**/*',

        '!' + config.src + 'css/*.{css,scss,sass}',
        '!' + config.src + 'css/partials/*',
        '!' + config.src + 'css/modules/*',
        '!' + config.src + 'css/vendor/*',

        '!' + config.src + 'includes/**/*',
        '!' + config.src + '**/*.{html,php}',

        '!' + config.src + 'js/vendor/*',
        '!' + config.src + 'js/modules/*',
      ],
      { base: config.src, nodir: true, dot: true }
    )
    .pipe(gulp.dest(config.dest));
});

// Copio carpeta vendor con librerias
gulp.task('copy:vendor', function() {
  return gulp
    .src(config.src + 'js/vendor/**/*', { base: config.src })
    .pipe(gulp.dest(config.dest));
});

// Copio carpeta fonts
gulp.task('copy:fonts', function() {
  return gulp
    .src(config.src + 'fonts/**/*', { base: config.src })
    .pipe(gulp.dest(config.dest));
});

// Clean
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************
// Borra TODA la carpeta de deploy
gulp.task('clean', function() {
  return del([config.dest], { force: true });
});

// Watch Files For Changes
gulp.task('watch', ['browserSync'], function() {
  gulp.watch(config.src + 'js/**/*.js', ['scripts', browserSync.reload]);
  gulp.watch(config.src + 'css/**/*.{css,scss}', ['sass', browserSync.reload]);
  gulp.watch(config.src + 'img/**/*.{jpg,png,svg}', ['images', browserSync.reload]);
  gulp.watch(config.src + '**/*.{html,php}', ['fileinclude']);
  gulp.watch(config.src + 'fonts/**/*', ['fonts', browserSync.reload]);
  // gulp.watch(config.src+'**/*', ['move_files']);

  // Cuando cambia el config, lo recargo y vuelvo a ejecutar las tareas
  gulp.watch('config.json', function() {
    runSequence('loadConfig', 'scripts', 'sass', 'images', 'copy:fonts', 'copy:vendor');
  });
});

gulp.task('dev', function() {
  runSequence(
    'clean',
    'sass',
    'scripts',
    'images',
    'fileinclude',
    'move_files'
  );
});
gulp.task('prod', function() {
  runSequence(
    'clean',
    'sass_min',
    'scripts_min',
    'images',
    'fileinclude',
    'move_files'
  );
});

// gulp.task('default', function(){
// 	runSequence('sass', 'scripts', 'fileinclude', 'move_files', 'images','copy:vendor', 'watch', function(){console.log('watching... ^__^')});
// });

gulp.task('default', function() {
  runSequence(
    'sass',
    'scripts',
    'images',
    'fileinclude',
    'copy:fonts',
    'copy:vendor',
    ['browserSync', 'watch']
  );
});
