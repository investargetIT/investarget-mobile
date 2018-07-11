This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You will find some useful information [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Important

为了在收藏的项目中既可以向左滑动移除该项目，又可以上下滑动浏览项目列表，请修改`node_modules/alloytouch/alloy_touch.css.js`文件，在237行左右：

```javascript
if (this.preventDefault && !preventDefaultTest(evt.target, this.preventDefaultException)) {
  evt.preventDefault();
}
```

将以上代码注释掉

## TODO

* iOS分享项目时无法显示缩略图

## 功能

* 记住登录前所在页面并在登录后跳转到该页面，见[#5646098](https://github.com/investargetIT/investarget-mobile/commit/5646098f651162460a27084213cf4865428c38a2)

## 发布

### 测试环境
1. 取消request.js第2行代码的注释，将接口url改为测试接口
2. 命令行运行
```
yarn build
scp -r build/* summer@192.168.1.251:/var/www/investarget-web/investarget-mobile/
```

### 生产环境
```
yarn build
scp -r build/* root@www.investarget.com:/var/www/investarget-web/investarget-mobile/
```
