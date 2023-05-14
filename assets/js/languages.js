"use strict";
// !Load languages
// available languages list
var languages = settings.availableLanguages;
// All the text in the website
var html_lang = {};

// Current language
// Check for localStorage support
if ("localStorage" in window) {
    settings.lang = localStorage.getItem("lang") || navigator.language;
    if (!Object.keys(languages).includes(settings.lang)) {
        settings.lang = "en-US";
    }
}

loadLanguage("tab-strip");

// Parse the .properties file
function parseProperties(propertiesStr) {
    var propertiesObj = {};
    var lines = propertiesStr.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line && line.indexOf("#") !== 0) {
            // ignore comments and empty lines
            var parts = line.split("=");
            if (parts.length === 2) {
                var key = parts[0].trim();
                var value = parts[1].trim();
                propertiesObj[key] = value;
            }
        }
    }
    return propertiesObj;
}

// /**
//  * JSON to .properties file
//  * @param {String} jsonStr JSON string
//  * @returns {String} .properties string
//  */
// function jsonToProperties(jsonStr) {
//     var propertiesStr = "";
//     var jsonObj = JSON.parse(jsonStr);
//     for (var key in jsonObj) {
//         // 如果是注释，就添加注释
//         if (key === "//") {
//             propertiesStr += "# " + jsonObj[key] + "\n";
//             continue;
//         }
//         propertiesStr += key + "=" + jsonObj[key] + "\n";
//     }
//     return propertiesStr;
// }

async function mergeFetches(fetchList) {
    const responses = await Promise.all(fetchList);
    const mergedObject = {};

    for (let i = 0; i < responses.length; i++) {
        const text = await responses[i].text();
        const object = parseProperties(text);
        mergeObjects(mergedObject, object);
    }

    return mergedObject;
}

function mergeObjects(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === "object" && source[key] !== null) {
                if (!target.hasOwnProperty(key)) {
                    target[key] = {};
                }
                mergeObjects(target[key], source[key]);
            } else {
                if (!target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
    }
}

async function getLanguageFile(file) {
    const languageFile = fetch(
        `assets/locales/${settings.lang}/${file}.properties`
    ).catch(() => {});
    const languageFileEn = fetch(
        `assets/locales/en-US/${file}.properties`
    ).catch(() => {});

    const dataList =
        settings.lang === "en-US"
            ? [languageFileEn]
            : [languageFile, languageFileEn];

    // 合并解析到的数据，优先保留第一个fetch的数据
    // Merge the parsed data, and keep the first fetch data first
    const langObj = await mergeFetches(dataList).then((langObj) => {
        return langObj;
    });
    return langObj;
}

/**
 * Load the language file
 * and replace the text of all elements
 * with class="lang" through the "data-lang-key" attr.
 */
function loadLanguage(languageFile) {
    if (html_lang[languageFile] !== undefined) {
        loadLanguageToScreen(html_lang[languageFile]);
        return;
    }

    getLanguageFile(languageFile).then((lang) => {
        if (lang === undefined) {
            return;
        }

        html_lang[languageFile] = lang;
        loadLanguageToScreen(lang);
    });
}

// 向屏幕上加载语言
// Load the language to the screen
function loadLanguageToScreen(lang) {
    $.each(lang, function (key, value) {
        if (value != "") {
            $(".lang[data-lang-key='" + key + "']").html(value);
        }

        // 如果key以-title结尾，就提取出来，作为新key
        if (key.endsWith("-title")) {
            key = key.slice(0, key.length - 6);

            // 更改提示框文本
            // 如果启用了提示，并且存在key+"-title"的内容，就添加title
            // Add title to those elements that have it
            if (settings.tips) {
                $(".lang[data-lang-key='" + key + "']").attr(
                    "title",
                    lang[key + "-title"]
                );
            }

            // Add alt to images
            if ($(".lang[data-lang-key='" + key + "']").is("img")) {
                $(".lang[data-lang-key='" + key + "']").attr(
                    "alt",
                    lang[key + "-title"]
                );
            }

            return;
        }
    });
}

/**
 * Switch the language of the website.
 * !Only for the preview. When using in the application, please delete this function,
 * !and change the language by directly modifying the assets/data/settings.json file and refreshing the application.
 * @param {String} language The language to be shown.
 */
function switchLanguage(language) {
    localStorage.setItem("lang", language);
    console.log("Language switched to " + language);
    // refresh the page
    location.reload();
}
