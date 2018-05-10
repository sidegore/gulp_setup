// gulpプラグインの読み込み
const gulp = require('gulp');
// ブラウザ同期
const browserSync = require('browser-sync').create();
// Sassをコンパイルするプラグインの読み込み
const sass = require('gulp-sass');
// 画像圧縮のプラグインを読み込み
const imagemin = require('gulp-imagemin');
const imageminJpg = require('imagemin-mozjpeg');
const imageminPng = require('imagemin-pngquant');
const imageminGif = require('imagemin-gifsicle');
const svgmin = require('gulp-svgmin');
// pugプラグインの読み込み
const pug = require('gulp-pug');
// jsの圧縮に使うプラグインの読み込み
const uglify = require('gulp-uglify');
// リネームに使うプラグインの読み込み
const rename = require('gulp-rename');
// エラー通知用プラグインの読み込み
const notify = require('gulp-notify');
const notifier = require('node-notifier');
// コンパイル時のエラーが出た場合に強制終了を防止するプラグイン
const plumber = require('gulp-plumber');
// 変更したものだけコンパイルするようにキャッシュさせるプラグインの読み込み
const changed = require('gulp-changed');
const cache = require('gulp-cached');


// 元となるディレクトリと出力先ディレクトリを定義
// 元
// const srcDir = 'resource/';
// 出力先
// const dstDir = 'public_html/';



// pugっぽいエラー通知
const errorHandler = function(error) {
	notifier.notify({
		message: 'しっぱいしたワン',
		title: 'パグ',
		appIcon: __dirname + './pug.png',
	}, function () {
		console.log(error.message);
	});
};
// sassエラー通知
const errorHandler_s = function(error) {
	notifier.notify({
		message: 'しっぱいしたサス',
		title: 'SASS',
		appIcon: __dirname + './sass.png',
	}, function () {
		console.log(error.message);
	});
};



// pugのコンパイル設定
gulp.task('pug', () => {
	// インクルード用のpugファイルは除外！
	return gulp.src(['resource/pug/**/*.pug', '!resource/pug/**/_*.pug'])
		// Pugのコンパイルエラーを表示（これがないとウォッチタスクが自動的に止まってしまう）
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('public_html'));
});



// sassのコンパイル設定
gulp.task('sass', () => {
	// scssファイルからcssファイルを書き出し
	return gulp.src('resource/sass/**/*.sass')
		// Sassのコンパイルエラーを表示
		.pipe(plumber({errorHandler: errorHandler_s}))
		.pipe(sass({
			// アウトプットスタイルを設定
			// ▼ いつもの
			// outputStyle: 'expanded'
			// ▼ 圧縮
			outputStyle: 'compressed'
		})
		// ウォッチタスクが自動的に止まるのを防止
		.on('error', sass.logError))
		.pipe(gulp.dest('public_html/css'));
});



// jsの圧縮設定
gulp.task('js', () => {
	return gulp.src(['resource/js/**/*.js'])
	// ▼ .minなjsは除外！
	// return gulp.src(['resource/js/**/*.js', '!resource/js/**/*.min.js'])
		.pipe(plumber())
		.pipe(uglify({
			output:{
				comments: /^!/
			}
		}))
		.pipe(gulp.dest('public_html/js'));
});



// 画像の圧縮前と圧縮後ディレクトリを定義
const paths = {
	// ▼ 圧縮前
	imgSrcDir : 'resource/images',
	// ▼ 圧縮後
	imgDstDir : 'public_html/images'
}
// jpg,png,gif画像の圧縮タスク
gulp.task('imagemin', function(){
	const srcGlob = paths.imgSrcDir + '/**/*.+(jpg|jpeg|png|gif)';
	const dstGlob = paths.imgDstDir;
	gulp.src( srcGlob )
	.pipe(changed( dstGlob ))
	.pipe(imagemin([
		// png画像の圧縮設定
		imageminPng({
			quality: '65-80',
			speed: 1,
			floyd: 0
		}),
		// jpg画像の圧縮設定
		imageminJpg({
			quality: 85,
			progressive: true
		}),
		// gif画像の圧縮設定
		imageminGif({
			interlaced: false,
			optimizationLevel: 3,
			colors: 180
		})
	]
	))
	.pipe(gulp.dest( dstGlob ));
});
// svg画像の圧縮タスク
gulp.task('svgmin', function(){
	const srcGlob = paths.imgSrcDir + '/**/*.+(svg)';
	const dstGlob = paths.imgDstDir;
	gulp.src( srcGlob )
	.pipe(changed( dstGlob ))
	.pipe(svgmin())
	.pipe(gulp.dest( dstGlob ));
});



// ブラウザ同期させるディレクトリ
gulp.task('serve', () => {
	browserSync.init({
		server: {
			baseDir: 'public_html'       //対象ディレクトリ
		}
	});
});



// 監視タスク
gulp.task('watch', () => {
	// pugファイルが変更されたらpugタスクを実行
	gulp.watch('resource/**/*.pug', ['pug']);
	// sassファイルが変更されたらsassタスクを実行
	gulp.watch('resource/sass/**/*.sass', ['sass']);
	// jsファイルが変更されたらjsタスクを実行
	gulp.watch('resource/**/*.js', ['js']);
	// 画像の変更を監視
	gulp.watch(paths.imgSrcDir + '/**/*', ['imagemin', 'svgmin']);
	// htmlファイルとcss・jsファイルが変更されたら、ブラウザをリロード
	gulp.watch(['public_html/*.html', 'public_html/css/*.css', 'public_html/js/*.js']).on('change', browserSync.reload);
});

// 実行タスク
gulp.task('default', ['serve', 'watch', 'imagemin', 'svgmin', 'sass', 'pug']);