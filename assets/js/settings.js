// 如果存在font-size-slider就设置它的值
if ($("#font-size-slider").length) {
    $("#font-size-slider").val(settings["font-size"]);
}

// 如果存在page-zoom-factor-slider就设置它的值
if ($("#page-zoom-factor-slider").length) {
    $("#page-zoom-factor-slider").val(settings["page-zoom-factor"]);
}

// 如果存在settings-display-high-dip-type-radiobutton就选中其内部对应的value的radio button
if ($("#settings-display-high-dip-type-radiobutton").length) {
    $("#settings-display-high-dip-type-radiobutton").find("input[value='" + settings["high-dip-type"] + "']").prop("checked", true);
}

// 如果存在settings-display-high-dip-images-switch就设置它的值
if ($("#settings-display-high-dip-images-switch").length) {
    $("#settings-display-high-dip-images-switch").prop("checked", settings["high-dip-images"]);
}

// 如果存在按钮就更改按钮上的文字
if ($("#languages-button").length) {
    $("#languages-button").text(settings.availableLanguages[settings.language]);
}
// 读取对应的language + .json文件和en.json文件，并替换新的语言
// language.json文件的格式为：{"key":"value"}
// 当在language.json文件里查找不到对应的keys时，会自动使用en.json文件里的内容

// 如果存在#languages-list，则生成下拉菜单
if ($("#languages-list").length) {
    for (var key in settings.availableLanguages) {
        //! 这么写会导致无法用Tab键选择元素，所以废弃
        // $("#languages-list").append('<li class="dropdown-item" onclick="goSwitchLanguage(this.id)" id="' + key + '">' + languages[key] + '</li>');
        $("#languages-list").append('<li><button class="dropdown-item" onclick="goSwitchLanguage(this.id)" id="' + key + '">' + settings.availableLanguages[key] + '</button></li>');
    }
}

// 如果存在settings-accessibility-tips-switch，就设置它的值
if ($("#settings-accessibility-tips-switch").length) {
    $("#settings-accessibility-tips-switch").prop("checked", settings.tips);
}