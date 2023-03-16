# HTML Tabs Frame

![Under Construction](assets/images/under-construction.gif)

[English](./README.md)

一个无障碍的网页内多标签页切换器。

预览（我们推荐 Chrome 浏览器）：[Github Pages](https://yubac.github.io/HTML-Tabs-Frame)

## Introduce

HTML Tabs Frame 是一个无障碍的网页内多标签页切换器，它可以让你在网页内创建多个标签页，每个标签页都可以包含任意内容，包括图片、视频、音频、表格、表单等等。

这个项目的本意是，为 QT 等桌面应用提供一个无障碍的网页内多标签页切换器，因为 QT 的 QWebEngineView 对无障碍的支持并不好，所以只能通过网页来实现。但是，这个项目也可以用于其他任何需要无障碍的网页内多标签页切换器的场景。

HTML Tabs Frame 可以创建一个网页内的多标签页切换器，它可以让用户在网页内切换不同的标签页，而不需要离开当前网页。

我们提供了两种标签类型：

1. inner：内部标签，它的内容是在网页内部的，也就是说，它的内容是在网页的 HTML 代码中的；
2. iframe：外部标签，它的内容是在网页外部的，也就是说，它的内容是在网页的 HTML 代码之外的。

## Usage

使用`index.html`即可。

### 项目结构

    ```
    ├── index.html
    ├── assets
    │   ├── css // 样式文件夹，其中和HTML文件名称相同的是专门用于该HTML文件的样式文件
    │   │   ├── high-contrast.css // 高对比度模式样式，暂时用于newTab.html的夜间模式
    │   │   ├── tabnav.css // 标签导航栏样式
    │   │   ├── tabnav-night.css // 标签导航栏夜间模式样式
    │   │   ├── theme.css // 主题样式，负责加载light主题
    │   │   ├── theme-night.css // 主题样式，负责加载night主题
    │   │   └── ...
    │   │
    │   ├── data // 数据文件夹，存储页面信息以及设置项
    │   │   ├── pages.json // 页面信息，将会在页面加载时被加载
    │   │   └── settings.json // 设置项，将会在页面加载时被加载
    │   │
    │   ├── images // 图片文件夹
    │   │   └── ...
    │   │
    │   ├── js // 脚本文件夹，其中和HTML文件名称相同的是专门用于该HTML文件的脚本文件
    │   │   ├── accessibility.js // 无障碍脚本，同时负责快捷键
    │   │   ├── autoload.js // 负责加载其它所有文件
    │   │   ├── cookies.js // 负责读写cookie
    │   │   ├── languages.js // 负责加载语言包
    │   │   ├── load-settings.js // 负责加载设置项以及资源
    │   │   ├── nav.js // 标签导航栏脚本
    │   │   ├── reload-settings.js // 当在设置页面中更改设置或添加新的内容div或iframe时重新加载设置项
    │   │   ├── theme.js // 加载主题脚本（light/night）
    │   │   └── ...
    │   │
    │   ├── lang // 语言包文件夹
    │   │   ├── languages.json // 存储全局语言包信息
    │   │   └── ...
    │   │
    │   ├── lib // 一些库文件夹
    │   │
    │   ├── scss // SCSS文件夹，其中和HTML文件名称相同的是专门用于该HTML文件的SCSS文件，这些文件将会被编译成CSS文件，不用的话可以删除
    │   │
    │   └── ...
    │
    ├── LICENSE // 许可证
    ├── LICENSE_CN // 许可证
    ├── index.html // 主页
    ├── newTab.html // 新标签页
    └── README.md // 说明文档

    ```

## License

我们遵循[反 996 许可证](https://github.com/996icu/996.ICU/blob/master/LICENSE_CN)开源。

[![反996许可证](https://img.shields.io/static/v1?label=LICENSE&message=%22Anti%20996%22%20License%20Version%201.0&color=blue&style=for-the-badge)](https://github.com/996icu/996.ICU/blob/master/LICENSE_CN)
