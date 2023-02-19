/*
 * 特殊位置的快捷键
 * 1. 顶部导航栏 快速聚焦：按键盘的“”键，可以快速聚焦到顶部导航栏的标签页
 *    在顶部导航栏的标签页被聚焦时，按键盘的“/”键，可以快速跳转到搜索框
 *    按键盘的"←""→"键，可以快速选中标签页，按"enter"键可以跳转到对应的页面
 * 2. 搜索框 在搜索框被聚焦时，按键盘的“/”键，可以快速跳转到顶部导航栏
 * 3. #nav-view-all-box 按键盘的"↑""↓"键，可以快速切换标签页
 * 4. 按Esc可以快速关闭打开的#nav-view-all-box和#nav-menu-box以及#box-musk
 */

// Hot key
var hotkey = {
    // Global
    document: {},

    // Tab navigation
    tabNav: {
        // 快速聚焦到tabNav ctrl+1
        focus: 49,
        // Left ←
        left: 37,
        // Right →
        right: 39,
        // Add ctrl+N
        add: 78,
        // View all box ctrl+?
        viewAll: 191,
        // menu box ctrl+M
        menu: 77,
    },


    // View all box and menu box
    navBox: {
        // up ↑
        up: 38,
        // down ↓
        down: 40,
        // enter
        enter: 13,
        // search ctrl+s
        search: 83,
        // esc
        esc: 27,
    },
}

// !Define functions
// ------------------------------
function reBlindHotKey() {
    // !document
    // 清除快捷键
    $(document).off("keydown");
    $(document).on("keydown", function(e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
            // ctrl + n
            case hotkey.tabNav.add:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $tabAddBtn.click();
                break;

                // ctrl + ?
            case hotkey.tabNav.viewAll:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $tabViewAllBtn.click();
                break;

                // ctrl + m
            case hotkey.tabNav.menu:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $tabMenuBtn.click();
                break;

                // 1
            case hotkey.tabNav.focus:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $("." + activeClass).focus();
                break;

        }
    });

    // !Tabnav
    // 清除快捷键
    $tabNav.children().off("keydown");
    $tabNav.children().on("keydown", function(e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
            // Left ←
            case hotkey.tabNav.left:
                // $tabLeftBtn.click();
                // 选中当前选中标签页的前一个标签页
                e.preventDefault();
                $("." + activeClass).prev().focus();
                $("." + activeClass).prev().click();
                break;
                // Right →
            case hotkey.tabNav.right:
                e.preventDefault();
                // $tabRightBtn.click();
                // 选中当前active标签页的后一个标签页
                $("." + activeClass).next().focus();
                $("." + activeClass).next().click();
                break;
        }
    });

    // !View all box
    // 清除快捷键
    $navViewAllBox.off("keydown");
    $navViewAllBox.on("keydown", function(e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
            // up ↑
            case hotkey.navBox.up:
                e.preventDefault();
                // 如果不为空，选中当前focus标签页的前一个标签页
                // 忽略.visually-hidden的标签页
                if ($navViewAllBoxTabList.find(":focus").prev().not(".visually-hidden").length > 0) {
                    $navViewAllBoxTabList.find(":focus").prev().not(".visually-hidden").focus();
                }
                // focus标签页前没有标签页了
                // 1. 可能是焦点在搜索框上
                // 如果这时候焦点在搜索框上，选中最后一个标签页
                else if ($navViewAllBoxSearchInput.is(":focus")) {
                    $navViewAllBoxTabList.children().not(".visually-hidden").last().focus();
                }
                // 2. 焦点在第一个标签页上
                // 选中搜索框
                else {
                    $navViewAllBoxSearchInput.focus();
                }
                break;
                // down ↓
            case hotkey.navBox.down:
                e.preventDefault();
                // 如果不为空，选中当前focus标签页的后一个标签页
                // 忽略.visually-hidden的标签页
                if ($navViewAllBoxTabList.find(":focus").next().not(".visually-hidden").length > 0) {
                    $navViewAllBoxTabList.find(":focus").next().not(".visually-hidden").focus();
                }
                // focus标签页后没有标签页了
                // 1. 可能是焦点在搜索框上
                // 如果这时候焦点在搜索框上，选中第一个标签页
                else if ($navViewAllBoxSearchInput.is(":focus")) {
                    $navViewAllBoxTabList.children().not(".visually-hidden").first().focus();
                }
                // 2. 焦点在最后一个标签页上
                // 选中搜索框
                else {
                    $navViewAllBoxSearchInput.focus();
                }
                break;
                // enter
            case hotkey.navBox.enter:
                e.preventDefault();
                // 点击当前选中的标签页
                $navViewAllBox.find(":focus").click();
                break;

                // ctrl + s
                // 搜索框
            case hotkey.navBox.search:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $navViewAllBoxSearchInput.focus();
                break;

                // esc
                // close box
            case hotkey.navBox.esc:
                e.preventDefault();
                // hide all
                $navViewAllBox.hide();
                $MenuBox.hide();
                $boxMusk.hide();
                // focus tabNav
                $("." + activeClass).focus();
                break;
        }
    });
}