"use strict";

// !Define variables
// Font size slider
var $fontZizeSlider = $("#font-size-slider");
// Page zoom factor slider
var $pageZoomFactorSlider = $("#page-zoom-factor-slider");
// High DPI type radio buttons
var $highDipTypeRadiobuttons = $("#settings-display-high-dip-type-radiobutton");
// High DPI images switch
var $highDipImagesSwitch = $("#settings-display-high-dip-images-switch");
// Accessibility tips switch
var $accessibilityTipsSwitch = $("#settings-accessibility-tips-switch");
// Languages button
var $languagesButton = $("#languages-button");
// Languages list
var $languagesList = $("#languages-list");

// Message box for saving settings
var $messages = $("#messages");

// !Load values
// 设置值
if ($fontZizeSlider.length) {
    $fontZizeSlider.val(settings["font-size"]);
}

// 设置值
if ($pageZoomFactorSlider.length) {
    $pageZoomFactorSlider.val(settings["page-zoom-factor"]);
}

// 选中其内部对应的value的radio button
if ($highDipTypeRadiobuttons.length) {
    $highDipTypeRadiobuttons
        .find("input[value='" + settings["high-dip-type"] + "']")
        .prop("checked", true);
}

// 设置值
if ($highDipImagesSwitch.length) {
    $highDipImagesSwitch.prop("checked", settings["high-dip-images"]);
}

// 更改按钮上的文字
if ($languagesButton.length) {
    $languagesButton.text(settings.availableLanguages[settings.language]);
}
// 读取对应的language + .json文件和en.json文件，并替换新的语言
// language.json文件的格式为：{"key":"value"}
// 当在language.json文件里查找不到对应的keys时，会自动使用en.json文件里的内容

// 如果存在#languages-list，则生成下拉菜单
if ($languagesList.length) {
    for (var key in settings.availableLanguages) {
        //! 这么写会导致无法用Tab键选择元素，所以废弃
        // $("#languages-list").append('<li class="dropdown-item" onclick="goSwitchLanguage(this.id)" id="' + key + '">' + languages[key] + '</li>');
        $languagesList.append(
            '<li><button class="dropdown-item" onclick="goSwitchLanguage(this.id)" id="' +
                key +
                '">' +
                settings.availableLanguages[key] +
                "</button></li>"
        );
    }
}

// 设置值
if ($accessibilityTipsSwitch.length) {
    $accessibilityTipsSwitch.prop("checked", settings.tips);
}

// ----------------------------------------
// 点击按钮后更改语言
function goSwitchLanguage(lang) {
    // update localStorage key
    if ("localStorage" in window) {
        localStorage.setItem("lang", lang);
        // console.log(localStorage.getItem('lang'));
    }

    switchLanguage(lang);

    // 更改按钮上的文字
    $languagesButton.text(settings.availableLanguages[lang]);
}

//
function updateSaveMessages(state) {
    if (state) {
        // 关闭保存弹窗
        $messages.hide();
        $(".main-display").css("padding-top", "0px");
    } else {
        alert("ERROR!");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // 这里面的channel就是PyQt5传递过来的channel对象，其中包含了可供调用的obj对象（一个Factorial类对象）
    new QWebChannel(qt.webChannelTransport, function (channel) {
        // 从channel中获取到我们注册到channel中的Factorial类对象
        window.pyFunctions = channel.objects.pyFunctions;
    });
});

function updateSettings(JSONText) {
    // 如果获取到了Factorial对象
    if (window.pyFunctions) {
        // 调用Factorial类对象中的槽函数factorial(n),并且指定一个异步调用的callback函数，当factorial返回时
        // 自动调用callback
        window.pyFunctions.updateSettings(JSONText, updateSaveMessages);
    }
}

function changeZoom(zoom) {
    if (window.pyFunctions) {
        // 调用Factorial类对象中的槽函数factorial(n),并且指定一个异步调用的callback函数，当factorial返回时
        // 自动调用callback
        window.pyFunctions.changeZoomFactor(zoom);
    }
}

// 滑回顶部的动画
function scrollToTop() {
    $(`[data-id=${page.current.id}]`).animate(
        {
            scrollTop: 0,
        },
        300
    );
}

// 搜索设置项
function search() {
    // 展示搜索结果文字
    $("#settings-search-result").show();

    // 从搜索框获取搜索内容
    var searchContent = $("#settings-search-input").val();

    $("#settings-search-result-list").empty();

    // 如果搜索内容为空，则不执行搜索
    if (searchContent == "") {
        // 提示用户搜索内容为空
        $("#settings-search-result-list").append(
            "<li class='lang' key='search-result-empty'></li>"
        );
        return;
    }

    // 如果搜索内容不为空，则执行搜索
    // 遍历所有设置项
    // 设置项为class为options的span
    // 搜索时使用模糊搜索，忽略大小写
    $(".options").each(function () {
        console.log($(this).text());
        // 如果搜索内容在设置项中，则在search-result-list中添加对应的#settings-list > li > div > ul > li
        if (
            $(this).text().toLowerCase().indexOf(searchContent.toLowerCase()) !=
            -1
        ) {
            $("#settings-search-result-list").append(
                $(this).parent().parent().clone()
            );
            // 在search-result-list中高亮搜索内容
            // 高亮时忽略大小写
        }
    });

    $("#settings-search-result-list > li > a > span").each(function () {
        $(this).html(
            $(this)
                .text()
                .replace(
                    searchContent,
                    "<span style='color: #ff0000;'>" + searchContent + "</span>"
                )
        );
    });

    // 如果搜索结果为空，则在search-result-list中添加提示
    if ($("#settings-search-result-list").html() == "") {
        $("#settings-search-result-list").append(
            `<li style='color: #ff0000;' class='lang' key='search-result-empty'>${html_lang["search-result-empty"]}</li>`
        );
    }
}

$("#settings-search").submit(function () {
    search();
    return false;
});

// 关闭时传回所有更改过的设置
// 设置项的class为setting-items
// 传回所有更改过的设置
function sendSettings() {
    // 传回的设置项
    var settings = {
        language: lang,
    };

    // 遍历所有设置项
    $(".setting-items").each(function () {
        // 如果设置项为checkbox
        if ($(this).attr("type") == "checkbox") {
            // 如果设置项为checked
            if ($(this).prop("checked")) {
                // 将设置项的setting-name作为key，true作为value
                settings[$(this).attr("setting-name")] = true;
            } else {
                // 将设置项的setting-name作为key，false作为value
                settings[$(this).attr("setting-name")] = false;
            }
        } else if ($(this).attr("type") == "text") {
            // 如果设置项为text
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else if ($(this).attr("type") == "number") {
            // 如果设置项为number
            // 将设置项的setting-name作为key，设置项的value转int型后作为value
            settings[$(this).attr("setting-name")] = parseInt($(this).val());
        } else if ($(this).attr("type") == "select-one") {
            // 如果设置项为select-one
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else if ($(this).attr("type") == "radio") {
            // 如果设置项为radio
            // 如果设置项为checked
            if ($(this).prop("checked")) {
                // 将设置项的setting-name作为key，设置项的value作为value
                settings[$(this).attr("setting-name")] = $(this).val();
            }
        } else if ($(this).attr("type") == "color") {
            // 如果设置项为color
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else if ($(this).attr("type") == "range") {
            // 如果设置项为range
            // 将设置项的setting-name作为key，设置项的value转int型后作为value
            settings[$(this).attr("setting-name")] = parseInt($(this).val());
        } else if ($(this).attr("type") == "file") {
            // 如果设置项为file
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else if ($(this).attr("type") == "textarea") {
            // 如果设置项为textarea
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else if ($(this).attr("type") == "password") {
            // 如果设置项为password
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else if ($(this).attr("type") == "date") {
            // 如果设置项为date
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else if ($(this).attr("type") == "datetime-local") {
            // 如果设置项为datetime-local
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        } else {
            // 如果设置项为其他
            // 将设置项的setting-name作为key，设置项的value作为value
            settings[$(this).attr("setting-name")] = $(this).val();
        }
    });

    // 将设置项转换为json字符串
    var settingsJson = JSON.stringify(settings);
    console.log(settingsJson);
    updateSettings(settingsJson);
    // console.log(settingsJson);

    // // 将设置项传回后端
    // $.ajax({
    //     type: "POST",
    //     url: "settings.php",
    //     data: {
    //         settings: settingsJson
    //     },
    //     success: function(data) {
    //         console.log(data);
    //         // // 如果传回成功
    //         // if (data == "success") {
    //         //     // 提示用户设置已保存
    //         //     $("#settings-save-success").show();
    //         //     // 1秒后隐藏提示
    //         //     setTimeout(function() {
    //         //         $("#settings-save-success").hide();
    //         //     }, 1000);
    //         // } else {
    //         //     // 如果传回失败
    //         //     // 提示用户设置保存失败
    //         //     $("#settings-save-fail").show();
    //         //     // 1秒后隐藏提示
    //         //     setTimeout(function() {
    //         //         $("#settings-save-fail").hide();
    //         //     }, 1000);
    //         // }
    //     }
    // });
}

// // 关闭窗口时保存设置
// // 退出提示
// window.onbeforeunload = function() {
//     // 保存设置
//     sendSettings();
//     return "确认离开当前页面吗？未保存的数据将会丢失";
// }

// *为了美观暂时不使用
// need-save被点击后触发提示
// $(".need-save").click(function () {
//     // 留出顶部空间
//     $(".main-display").css("padding-top", "80px");
//     // 提示用户设置未保存
//     $("#messages").show();
// });

var fontSizeSlider = $("#font-size-slider");
// font_list = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
if (fontSizeSlider.length) {
    // 有改变后就设置字体大小并使用!important
    fontSizeSlider.on("change", function () {
        $("main").css(
            "font-size",
            fontSizeSlider.val() * 20 + 100 + "%",
            " !important"
        );
    });
}

var fontSizeRestoreDefaultBtn = $("#font-size-restore-default");
if (fontSizeRestoreDefaultBtn.length) {
    // 点击后就设置字体大小为medium并使用!important
    fontSizeRestoreDefaultBtn.on("click", function () {
        $("main").css("font-size", "120%", " !important");
        // 更改font-size-slider的值为medium
        fontSizeSlider.val(1);
    });
}

var zoomSlider = $("#page-zoom-factor-slider");
var zoomRestoreDefaultBtn = $("#page-zoom-factor-restore-default");

// 有改变后就设置页面缩放比例
zoomSlider.on("change", function () {
    changeZoom(zoomSlider.val());
});

// 点击后就设置页面缩放比例为1
zoomRestoreDefaultBtn.on("click", function () {
    changeZoom(5);
    // 更改page-zoom-factor-slider的值为1
    zoomSlider.val(5);
});

// 为.color-blind-label 移除class visually-hidden
// $(".color-blind-label").removeClass("visually-hidden");
// function leaveTab() {
//     // 获取tabContent的scroll位置
//     var scroll = tabContent.scrollTop();
//     // 将scroll位置存入localStorage
//     localStorage.setItem(page.before.id, scroll);
// }

// function enterTab() {}

// function reenterTab() {
//     console.log("Reenter!");
// }
