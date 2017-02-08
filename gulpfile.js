var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var glob = require("glob")

var paths = {
    html: {
        entry: './src/html/*.*',
        all: 'src/html/**/*.*'
    },
    sass: {
        entry: './src/css/*.scss',
        all: 'src/css/**/*.scss'
    },
    js: {
        entry: './src/js/*.js',
        all: 'src/js/**/*.js'
    },
    images: {
        all: 'src/images/**/*.js'
    },
    json: {
        all: 'src/json/**/*.json'
    }
}

//copy file to src folder
gulp.task('copy', ['lib', 'images', 'json']);
gulp.task('lib', function () {
    gulp.src('./src/lib/**/*')
        .pipe($.changed('./dist/lib'))
        .pipe(gulp.dest('./dist/lib'));

});
gulp.task('images', function () {
    gulp.src('./src/images/**/*')
        .pipe($.changed('./dist/images'))
        .pipe(gulp.dest('./dist/images/'));

});
gulp.task('json', function () {
    gulp.src('./src/json/**/*.json')
        .pipe($.changed('./dist/json'))
        .pipe(gulp.dest('./dist/json/'));

});

//compile swig file
gulp.task('html', function () {
    gulp.src(paths.html.entry)
        .pipe($.nunjucks.compile())
        .pipe(gulp.dest('./dist/html'))
});
//compile sass file
gulp.task('sass', function () {
    gulp.src(paths.sass.entry)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer('last 5 version', 'android 4'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({
            stream: true
        }));

});
gulp.task('sass-debug', function () {
    gulp.src(paths.sass.entry)
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer('last 5 version', 'android 4'))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({
            stream: true
        }));

});

// js concat
gulp.task('js-concat', function () {
    glob("src/js/*", {
        ignore: ['src/js/*.js']
    }, function (er, files) {

        for (let i = 0; i < files.length; i++) {
            let name = files[i].split('/')
            name = name[name.length - 1]
            gulp.src(files[i] + '/*.js')
                .pipe($.concat(`${name}.js`))
                .pipe(gulp.dest('src/js'));
        }

    })
})

//compile js file
gulp.task('js', function () {
    gulp.src(paths.js.entry)
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js-debug', function () {
    gulp.src(paths.js.entry)
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('compress',function(){
    gulp.src('dist/js/**/*')
    .pipe($.uglify())
    .pipe(gulp.dest('dist/js'))
})


//listen file modify
gulp.task('watch', function () {

    browserSync.init({
        //任何文件改变就刷新
        // files: "**", 

        notify: false,

        //指定文件改变刷新
        files: ["./dist/**/*.html", "./dist/**/*.js"],

        // 动态站点
        // proxy: "localhost:8080/xxx/index.action"

        // 静态站点
        server: {
            baseDir: "./dist/",
            directory: true, //在网页显示项目文件结构
            index: "html/index.html"
        }
    })

    gulp.watch(paths.json.all, ['json']);
    gulp.watch(paths.images.all, ['copy']);
    gulp.watch(paths.html.all, ['html']);
    gulp.watch(paths.sass.all, ['sass']);
    gulp.watch(paths.js.entry, ['js']);
    gulp.watch(['src/js/**/*.js','!src/js/*.js'], ['js-concat']);
})

var commTask = ['copy', 'html', 'sass', 'js'];
var debugTask = ['copy', 'html', 'sass-debug', 'js-debug'];

gulp.task('debug', debugTask.concat('watch'));
gulp.task('dev', commTask.concat('watch'));
gulp.task('build', commTask);
gulp.task('default', ['dev']);