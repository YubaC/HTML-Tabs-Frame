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
    tabStrip: {
        // 快速聚焦到tabStrip ctrl+1
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
};

// !Define functions
// ------------------------------
function reBlindHotKey() {
    // !document
    // 清除快捷键
    $(document).off("keydown");
    $(document).on("keydown", function (e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
            // ctrl + n
            case hotkey.tabStrip.add:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $tabAddBtn.click();
                break;

            // ctrl + ?
            case hotkey.tabStrip.viewAll:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $tabViewAllBtn.click();
                break;

            // ctrl + m
            case hotkey.tabStrip.menu:
                if (!e.ctrlKey) {
                    break;
                }
                e.preventDefault();
                $tabMenuBtn.click();
                break;

            // 1
            case hotkey.tabStrip.focus:
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
    $tabStrip.children().off("keydown");
    $tabStrip.children().on("keydown", function (e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
            // Left ←
            case hotkey.tabStrip.left:
                // $tabLeftBtn.click();
                // 选中当前选中标签页的前一个标签页
                e.preventDefault();
                $("." + activeClass)
                    .prev()
                    .focus();
                $("." + activeClass)
                    .prev()
                    .click();
                break;
            // Right →
            case hotkey.tabStrip.right:
                e.preventDefault();
                // $tabRightBtn.click();
                // 选中当前active标签页的后一个标签页
                $("." + activeClass)
                    .next()
                    .focus();
                $("." + activeClass)
                    .next()
                    .click();
                break;
        }
    });

    // !View all box
    // 清除快捷键
    $navViewAllBox.off("keydown");
    $navViewAllBox.on("keydown", function (e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
            // up ↑
            case hotkey.navBox.up:
                e.preventDefault();
                // 如果不为空，选中当前focus标签页的前一个标签页
                // 忽略.visually-hidden的标签页
                if (
                    $navViewAllBoxTabList.find(":focus").prev().not(".hide")
                        .length > 0
                ) {
                    $navViewAllBoxTabList
                        .find(":focus")
                        .prev()
                        .not(".hide")
                        .focus();
                }
                // focus标签页前没有标签页了
                // 1. 可能是焦点在搜索框上
                // 如果这时候焦点在搜索框上，选中最后一个标签页
                else if ($navViewAllBoxSearchInput.is(":focus")) {
                    $navViewAllBoxTabList
                        .children()
                        .not(".hide")
                        .last()
                        .focus();
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
                if (
                    $navViewAllBoxTabList.find(":focus").next().not(".hide")
                        .length > 0
                ) {
                    $navViewAllBoxTabList
                        .find(":focus")
                        .next()
                        .not(".hide")
                        .focus();
                }
                // focus标签页后没有标签页了
                // 1. 可能是焦点在搜索框上
                // 如果这时候焦点在搜索框上，选中第一个标签页
                else if ($navViewAllBoxSearchInput.is(":focus")) {
                    $navViewAllBoxTabList
                        .children()
                        .not(".hide")
                        .first()
                        .focus();
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
                $tabViewAllBtn.focus();
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
        }
    });
}

document.addEventListener("keydown", function (e) {
    // console.log(e.keyCode);
    switch (e.keyCode) {
        case hotkey.navBox.esc:
            if (boxOpened) {
                // 如果打开的是view all box
                if ($navViewAllBox.is(":visible")) {
                    // 聚焦到view all按钮
                    $tabViewAllBtn.focus();
                }
                // 如果打开的是menu box
                else if ($MenuBox.is(":visible")) {
                    // 聚焦到menu按钮
                    $tabMenuBtn.focus();
                }
                e.preventDefault();
                $navViewAllBox.hide();
                $MenuBox.hide();
                boxOpened = false;
            }
    }
});
