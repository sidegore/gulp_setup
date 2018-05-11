# gulp command

npm init -y

npm install -D gulp gulp-pug gulp-sass gulp-plumber gulp-imagemin imagemin-mozjpeg imagemin-pngquant gulp-svgmin gulp-changed browser-sync gulp-notify node-notifier gulp-cached gulp-uglify



# sass pug 制作で便利なサイト
html → jade
[HTML2Jade](http://html2jade.org/)

css → sass/scss
[SassMeister](https://www.sassmeister.com/)



# コマンド
### 導入されたプラグインの確認
npm ls --depth=0



# 注意点
pugの_config.pug等、変数を定義する時は-(ハイフン)が必要。
使う時は#{変数名}という使い方になる