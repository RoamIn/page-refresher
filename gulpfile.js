const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

// clear old files
gulp.task('clean', () => {
    del([
        'dist/*'
    ]);
});

// es6
gulp.task('es6', () =>
        gulp.src('src/*.js')
                .pipe(babel({
                    presets: ['env']
                }))
                .pipe(gulp.dest('dist'))
);

// uglify
gulp.task('uglify', function () {
    gulp.src('dist/*.js')
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['clean', 'es6', 'uglify']);
