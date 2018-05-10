# gulp_setup
gulpの基本セットを作成

## ディレクトリ階層
public_html内のファイルは各種コンパイル後のファイルを格納するため、触ることは基本無し。  
作業時にはresourceディレクトリ内で行う。

    gulp_setup
    ├── node_modules
    ├── public_html
    ├── resource
    │	├──images
    │	├──js
    │	├──pug
    │	└──sass
    ├── gulpfile.js
    └── package.json
