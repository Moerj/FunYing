# 微信影视

http://wechat.94joy.com/html/index.html
  
  
## 运行依赖
无

## 开发依赖
node
gulp

## gulp命令
gulp 启动项目，并执行一次编译、开启监听
gulp debug 同上，但以debug模式开启，js和sass文件会有map文件生成
gulp build 编译一次
gulp compress 压缩dist下面的js，发布前使用

  
  
## 安装
克隆项目后，进入项目根目录运行
```javascript
npm i
```
  
## 工程目录
用于存放开发时的代码,修改代码请在此目录！
```javascript
./src/
    js/     //支持 es6语法
    css/    //存放 sass
    lib/    //存放第三方依赖文件
    html/   //存放 html 页面以及片段
    images/ //存放图片
```
  
  
## 运行目录
部署项目所需的代码部分，由src生成。
```javascript
./dist/
    css/    //编译后的 css
    js/     //编译、压缩后的 js 文件会自动生成在这里
    lib/    //来至src
    html/   //存放编译过的完整 html 页面
    images/ //来至src
```

## js结构说明
所有src下的js为es6语法
在src/js下的一级目录文件为完整js
二级目录以下的都为模块片段，里面的所有js为最终合并为与二级文件夹同名的js，并生成在dist下
  

### 引用 CDN 资源
项目正式上线时请将公共资源改为 CDN 链接
