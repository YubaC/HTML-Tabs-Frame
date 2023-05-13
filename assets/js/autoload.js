"use strict";
// !Autoload assets for the application.

const assetsToLoad = `
<link rel="stylesheet" href="assets/lib/fontawesome-free-5.15.4-web/css/all.min.css">
<link rel="stylesheet" href="assets/lib/jquery/css/jquery-ui.min.css">
<script src="https://cdn.staticfile.org/twitter-bootstrap/5.1.1/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/defines.js"></script>
<script src="assets/lib/jquery/js/jquery-ui.min.js"></script>
<script src="assets/js/languages.js"></script>
<script src="assets/js/theme.js"></script>
<script src="assets/js/accessibility.js"></script>
<script src="assets/js/nav.js"></script>
<script src="assets/js/cookies.js"></script>
<script src="assets/lib/qt/js/qwebchannel.js"></script>`;

/**
 * Load assets from a string of html. Returns a promise that resolves when all assets are loaded.
 * @param {string} asset The asset to load, usually a script or link tag. Attributes will be copied to the new element.
 * @returns {promise} A promise that resolves when the asset is loaded.
 */
function loadAsset(asset) {
    return new Promise((resolve, reject) => {
        // element.addEventListener("load", () => resolve());
        // element.addEventListener("error", () => reject());
        const isScript = asset.nodeName === "SCRIPT";
        const element = isScript
            ? document.createElement("script")
            : document.createElement("link");

        // 把所有的属性和值都复制到新的元素上
        [...asset.attributes].forEach((attr) => {
            element.setAttribute(attr.name, attr.value);
        });
        // 如果标签内有内容，也复制过去
        if (asset.innerHTML) {
            element.innerHTML = asset.innerHTML;
        }

        // 如果没有src或者href，判定为已经加载完成
        if (!asset.src && !asset.href) {
            document.head.appendChild(element);
            console.warn(`A resource without src or href is loaded.`);
            resolve(element);
            return;
        }

        element.addEventListener("load", () => {
            resolve(element);
            console.info(`Loaded: ${element.src || element.href}`);
        });

        element.addEventListener("error", () => {
            reject(element);
            console.error(`Error loading: ${element.src || element.href}`);
        });

        // console.info(element);
        document.head.appendChild(element);
    });
}

/**
 * Load assets from a string of html.
 * @param {string} html The html string to load, usually script or link tags, or a combination of both. Attributes will be copied to the new element.
 * @param {function} callback The callback function to call when all assets are loaded.
 */
async function loadAssets(html, callback) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const assets = [...doc.querySelectorAll("script, link")];
    const totalAssets = assets.length;

    if (totalAssets === 0) {
        if (callback) {
            callback();
        }
        return;
    }

    const promiseArray = assets.map((asset) => {
        return () => {
            return loadAsset(asset);
        };
    });

    let promiseChain = Promise.resolve();

    promiseArray.forEach((promise) => {
        promiseChain = promiseChain.then(() => {
            return Promise.resolve(promise());
        });
    });

    promiseChain
        .then((result) => {
            console.log("All promises are resolved.");
            if (callback) {
                callback();
            }
        })
        .catch((error) => {
            console.error("An error occurred:", error);
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
