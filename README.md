# page-refresher

> Auto refresh web page

## 目录

- [技术选型](#技术选型)
- [思路](#思路)
- [配置说明](#配置说明)
- [构建代码](#构建代码)
- [引用说明](#引用说明)
- [在线demo](#在线demo)
- [注意](#注意)
- [隐患](#隐患)

## 技术选型

- url 锚点参数
    - 缺点：需要解析 url，较麻烦

- `sessionStorage`：
    - 优点： 无需解析 url。存储在 `sessionStorage` 里面的数据在页面会话结束时会被清除。页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话。在新标签或窗口打开一个页面会初始化一个新的会话
    - 兼容性：IE8+

故选取 `sessionStorage`。

> 其实 `localStorage` 也行，区别在于无论页面关闭刷新与否，数据都会保存。所以可以设置配置项，配置需要的存储类型。

## 思路

1. 页面初始化的时候，读取本地的 `sessionStorage` 数据 isTurnOn（是否开启自动刷新） 和 interval（刷新时间间隔，单位：秒）
2. 判断 isTurnOn 和 interval是否存在，不存在则设置默认值
3. 根据 isTurnOn 和 interval 生成 html 并注入页面
4. 监听 checkbox 改变
    - 选取，则设置 isTurnOn 为 true，并开启定时器
    - 取消选取，则设置 isTurnOn 为 false，并关闭定时器
5. 监听 input 改变，更新 interval

## 配置说明

#### 文件地址：

```
page-refresher/
├── ...
├── src/
│   └── /js
│      └── main.js
└── ...
```

#### 配置代码：

```js
// ...

// 配置项
const INTERVAL = 10; // 时间间隔，单位：秒
const STORAGE_TYPE = 'sessionStorage'; // 使用的 storage 类型
const CSS_FILE_PATH = 'dist/1.0.0/css/page-refresher.min.css'; // css 文件路径

// ...
```

#### 参数说明

参数|类型|默认值|是否必填|描述
--- | --- | --- | --- | --- |
INTERVAL | Int | 10 | 是 | 刷新时间间隔，单位：秒
STORAGE_TYPE | String | 'sessionStorage' | 是 | 存储类型，只能是 `sessionStorage`、`localStorage`
CSS_FILE_PATH | String | | 是 | css 文件地址

## 构建代码

命令行执行：

```
gulp
```


## 引用说明

在页面中引入对应的 js 文件：

```html
<script src="dist/1.0.0/js/page-refresher.min.js"></script>
```

## 在线demo

请点击: [demo](http://htmlpreview.github.io/?https://github.com/RoamIn/page-refresher/blob/master/demo.html).

## 注意

- IE的 storage 存储不支持本地测试，所以需要启个 server 测试。


## 隐患

样式可能会被原始页面的干扰导致显示异常
