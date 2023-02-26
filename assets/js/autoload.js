"use strict";
// !Autoload assets for theapplication

// !CSS
// Path: assets\lib\bootstrap\css\bootstrap.min.css
// Path: assets\lib\fontawesome\css\all.min.css
// Path: assets\lib\jquery\jquery-ui.min.css
// // Path: assets\css\index.css

const cssFiles = [
    // "assets/lib/bootstrap-dark-5-main/dist/css/bootstrap.css",
    "assets/lib/fontawesome-free-5.15.4-web/css/all.min.css",
    "assets/lib/jquery/css/jquery-ui.min.css",
    // "assets/css/index.css"
];

// !Javascript
// Path: assets\lib\bootstrap\js\bootstrap.bundle.min.js
// Path: assets\lib\jquery\js\jquery-3.6.3.min.js
// Path: assets\lib\jquery\js\jquery-ui.min.js
// Path: assets\js\load-settings.js
// Path: assets\js\theme.js
// Path: assets\js\accessibility.js
// Path: assets\js\nav.js
// // Path: assets\js\languages.js
// Path: assets\js\cookies.js
// Path: assets\lib\qt\js\qwebchannel.js

const jsFiles = [
    "https://cdn.staticfile.org/twitter-bootstrap/5.1.1/js/bootstrap.bundle.min.js",
    // "assets/lib/jquery/js/jquery-3.6.3.min.js",
    "assets/lib/jquery/js/jquery-ui.min.js",
    "assets/js/reload-settings.js",
    "assets/js/languages.js",
    // "assets/js/load-settings.js",
    "assets/js/theme.js",
    "assets/js/accessibility.js",
    "assets/js/nav.js",
    "assets/js/cookies.js",
    "assets/lib/qt/js/qwebchannel.js",
];

// Functions to load the files
// 封装异步加载资源的方法
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;
        // console.log(url);

        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        } else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}

// Load resources one by one
// and make sure they are loaded in order
// function loadResources() {
//     // return new Promise((resolve, reject) => {
//     //     if (resourcesToLoad.length) {
//     //         const resource = resourcesToLoad.shift();
//     //         resource.then(() => {
//     //             loadResources();
//     //             console.log("Loaded resource: " + resource);
//     //         });
//     //     }
//     // });
// }
