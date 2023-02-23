"use strict";
// !Load languages
// available languages list
var languages = settings.availableLanguages;
// Current language
var lang;
// All the text in the website
var html_lang = {};


// Check for localStorage support
if ('localStorage' in window) {
    lang = localStorage.getItem('lang') || navigator.language.slice(0, 2);
    if (!Object.keys(languages).includes(lang)) {
        lang = 'en';
    }
}
switchLanguage(lang);

/**
 * Load the language file 
 * and replace the text of all elements 
 * with class="lang" through the "key" attr.
 */
function loadLanguage() {
    $.each(html_lang, function(key, value) {
        if (value != "") {
            $(".lang[key='" + key + "']").text(value);
        }

        // *Features ：添加popover
        // // 如果启用了提示，并且存在key+"-content"的内容，就添加popover
        // if (settings.tips && html_lang[key + "-content"]) {
        //     $(".lang[key='" + key + "']").attr("data-content", html_lang[key + "-content"]);
        //     $(".lang[key='" + key + "']").attr("data-toggle", "popover");
        //     $(".lang[key='" + key + "']").attr("data-trigger", "hover");
        //     $(".lang[key='" + key + "']").attr("data-placement", "top");
        //     $(".lang[key='" + key + "']").attr("data-container", "body");
        //     $(".lang[key='" + key + "']").attr("data-html", "true");
        //     $(".lang[key='" + key + "']").attr("data-animation", "true");
        // }

        // 如果key以-title结尾，就提取出来，作为新key
        if (key.endsWith("-title")) {
            key = key.slice(0, key.length - 6);

            // 更改提示框文本
            // 如果启用了提示，并且存在key+"-title"的内容，就添加title
            // Add title to those elements that have it
            if (settings.tips) {
                $(".lang[key='" + key + "']").attr("title", html_lang[key + "-title"]);
            }

            // Add alt to images
            if ($(".lang[key='" + key + "']").is("img")) {
                $(".lang[key='" + key + "']").attr("alt", html_lang[key + "-title"]);
            }

            return;
        }
    });
}

/**
 * Switch the language of the website.
 * @param {String} language The language to be shown.
 */
function switchLanguage(language) {
    // 读取对应的language + .json文件和en.json文件，并替换新的语言
    // language.json文件的格式为：{"key":"value"}
    // 当在language.json文件里查找不到对应的keys时，会自动使用en.json文件里的内容

    // 合并两个语言文件
    $.getJSON("assets/lang/" + language + ".json", function(data) {
        $.each(data, function(key, value) {
            html_lang[key] = value;
        })
    }).then(
        $.getJSON("assets/lang/en.json", function(data) {
            $.each(data, function(key, value) {
                // 如果html_lang中不存在这个key，就添加
                if (!html_lang[key]) {
                    html_lang[key] = value;
                }
            });
        })
    )

    // 替换所有的class="lang"的元素的内容
    .then(loadLanguage);

    // $.getJSON("assets/lang/" + language + ".json", function(data) {
    //         $.each(data, function(key, value) {
    //             if (value != "") {
    //                 $(".lang[key='" + key + "']").text(value);
    //                 html_lang[key] = value;
    //             }
    //             // ---------------------更改提示框文本---------------------
    //             // 为所有class="lang"的元素添加title和alt
    //             // title和alt为languages中key+"-title"的内容，content为key+"-title"的content
    //             // 如果这两个中的任意一个不存在，就跳过

    //             // 如果启用了提示，并且存在key+"-title"的内容
    //             if (settings.tips && data[key + "-title"]) {
    //                 $(".lang[key='" + key + "']").attr("title", data[key + "-title"]);
    //                 // 获取这个元素的类型
    //                 var tagName = $(".lang[key='" + key + "']").prop("tagName");
    //                 siitch(tagName) {
    //                     // 如果是图片，就添加alt
    //                     if ($(".lang[key='" + key + "']").is("img")) {
    //                         $(".lang[key='" + key + "']").attr("alt", data[key + "-title"]);
    //                     }
    //                     // 如果是按钮，就添加aria-label
    //                     if ($(".lang[key='" + key + "']").is("button")) {
    //                         $(".lang[key='" + key + "']").attr("aria-label", data[key + "-title"]);
    //                     }
    //                     // 如果是表单元素，就添加for
    //                     if ($(".lang[key='" + key + "']").is("input") || $(".lang[key='" + key + "']").is("select") || $(".lang[key='" + key + "']").is("textarea")) {
    //                         $(".lang[key='" + key + "']").attr("for", data[key + "-title"]);
    //                     }
    //                 }
    //             }
    //         });
    //     })
    //     .then(function() {
    //         // 与上面的相同，但是只会替换没有内容的元素
    //         $.getJSON("assets/lang/en.json", function(data) {
    //             $.each(data, function(key, value) {
    //                 $(".lang[key='" + key + "']").each(function() {
    //                     if ($(this).text() == "" && value != "") {
    //                         $(this).text(value);
    //                         html_lang[key] = value;
    //                     }
    //                 });
    //                 if (settings.tips && data[key + "-title"] && $(this).attr("title") == "") {
    //                     $(".lang[key='" + key + "']").attr("title", data[key + "-title"]);
    //                 }
    //             });
    //         });
    //     })
}