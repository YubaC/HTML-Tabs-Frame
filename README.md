# HTML Tabs Frame

![Under Construction](assets/images/under-construction.gif)

[简体中文](./README_CN.md)

A web page tab switcher with accessibility.

## Introduce

HTML Tabs Frame is a web page tab switcher with accessibility. It allows you to create multiple tabs in a web page, each of which can contain any content, including images, videos, audios, tables, forms, etc.

HTML Tabs Frame can create a multi-tab switcher in a web page, allowing users to switch between different tabs within the web page without leaving the current web page.

We provide two types of tabs:

1. inner: internal tab, whose content is inside the web page, that is, its content is in the HTML code of the web page;
2. iframe: external tab, whose content is outside the web page, that is, its content is outside the HTML code of the web page.

## Usage

Use `index.html` to start.

### Project Structure

    ```
    ├── index.html
    ├── assets
    │   ├── css // the folder of stylesheets, where the file names match the HTML file names.
    │   │   ├── high-contrast.css // high contrast mode style, currently used for newTab.html night mode.
    │   │   ├── tabnav.css // stylesheet for the tab navigation bar.
    │   │   ├── tabnav-night.css // stylesheet for the night mode of the tab navigation bar.
    │   │   ├── theme.css // theme style, responsible for loading the light theme.
    │   │   ├── theme-night.css // theme style, responsible for loading the night theme.
    │   │   └── ...
    │   │
    │   ├── data // the folder of data files that store page information and settings.
    │   │   ├── pages.json // page information, which will be loaded when the page is loaded.
    │   │   └── settings.json // settings, which will be loaded when the page is loaded.
    │   │
    │   ├── images // the folder of image files.
    │   │   └── ...
    │   │
    │   ├── js // the folder of scripts, where the file names match the HTML file names.
    │   │   ├── accessibility.js // accessibility script, also responsible for keyboard shortcuts.
    │   │   ├── autoload.js // responsible for loading all other files.
    │   │   ├── cookies.js // responsible for reading and writing cookies.
    │   │   ├── languages.js // responsible for loading language packs.
    │   │   ├── load-settings.js // responsible for loading settings and resources.
    │   │   ├── nav.js // script for the tab navigation bar.
    │   │   ├── theme.js // script for loading themes (light/night).
    │   │   └── ...
    │   │
    │   ├── lang // the folder of language pack files.
    │   │   ├── languages.json // stores global language pack information.
    │   │   └── ...
    │   │
    │   ├── lib // the folder of some library files.
    │   │
    │   ├── scss // the folder of SCSS files, where the file names match the HTML file names. These files will be compiled into CSS files, and can be deleted if not used.
    │   │
    │   └── ...
    │
    ├── LICENSE // license
    ├── LICENSE_CN // license
    ├── index.html // homepage
    ├── newTab.html // new tab page
    └── README.md // documentation

    ```

## License

We follow the [Anti-996 License](https://github.com/996icu/996.ICU/blob/master/LICENSE) to open source this project.

[![Anti-996 License](https://img.shields.io/static/v1?label=LICENSE&message=%22Anti%20996%22%20License%20Version%201.0&color=blue&style=for-the-badge)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
