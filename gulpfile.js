var gulp = require("gulp");
var sass = require("gulp-sass");
var sassGlob = require("gulp-sass-glob"); //パーシャルファイルを一括で読み込む
var sourcemaps = require("gulp-sourcemaps"); //ソースマップでコンパイル前のソースの場所を知る
var plumber = require('gulp-plumber'); //エラー時にWatchを停止させずに自動コンパイルを継続させる
var notify = require('gulp-notify'); //エラーに気付きやすくするために通知を出す

 //PostCSSを読み込み
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer'); //ベンダープレフィックスを自動付与する
var assets = require('postcss-assets'); //画像名だけで画像のパスやサイズを取得する
var cssdeclsort = require('css-declaration-sorter'); //CSSプロパティの記述順を自動でソートする
var mqpacker = require('css-mqpacker'); //バラバラになったメディアクエリをまとめてコード量を削減してスッキリさせる

gulp.task("sass", function () {
  return gulp
    .src("./sass/**/*.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    ) //②plumberの引数にエラーメッセージを設定
    .pipe(sourcemaps.init()) //「gulp.src」の直後に指定:ソースマップでコンパイル前のソースの場所を知る
    .pipe(sassGlob()) //「sass」の前に指定:パーシャルファイルを一括で読み込む
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss([mqpacker()])) //②「sass」の後に指定:バラバラになったメディアクエリをまとめてコード量を削減してスッキリさせる
    .pipe(postcss([cssdeclsort({ order: "smacss" })])) //②「sass」の後に指定:CSSプロパティの記述順を自動でソートする
    .pipe(
      postcss([
        assets({
          //②「sass」の後に指定
          loadPaths: ["./images"], //③「loadPaths」に画像ディレクトリを指定（本書ではimages）
        }),
      ])
    )
    .pipe(postcss([autoprefixer()])) //②「sass」の後に指定:ベンダープレフィックスを自動付与する
    .pipe(sourcemaps.write("./css")) //「gulp.dest」の直前に指定:ソースマップでコンパイル前のソースの場所を知る
    .pipe(gulp.dest("./css"));
});

gulp.task("sass:watch", function () {
  gulp.watch("./sass/**/*.scss", gulp.task("sass"));
});
