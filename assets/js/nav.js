"use strict";

// The class of each tab.
class Page {
    constructor(options) {
        this.init();
        this.setTitle = this.setTitle.bind(this);
        this.setTitleIcon = this.setTitleIcon.bind(this);

        Object.assign(this, options);

        this.type = options.type || "inner";
        this.keep = options.keep || false;

        openedWindows++;
        this.id = `--page-${openedWindows}`;
        this.selector = `[data-id="${openedWindows}"]`;

        // If the title is not set, use the src as the title.
        this.title = this.title || this.src;
        this.titleIcon = this.titleIcon || "";
        // this.setTitle(this.title);
    }

    init() {
        // 监听 this.title 的变化，并改变标签页的标题
        // Listen to the change of this.title, and change the title of the tab.
        Object.defineProperty(this, "title", {
            get() {
                return this._title;
            },
            set(value) {
                this._title = value;
                this.setTitle(value);
            },
        });

        Object.defineProperty(this, "titleIcon", {
            get() {
                return this._titleIcon;
            },
            set(value) {
                this._titleIcon = value;
                this.setTitleIcon(value);
            },
        });
    }

    setTitle(value) {
        $(`#${this.id}, [original-id="${this.id}"]`)
            .find(".tabstrip-item-text")
            .html(value)
            .attr("title", value);
    }

    setTitleIcon(value) {
        $(`#${this.id}, [original-id="${this.id}"]`)
            .find(".tabstrip-item-icon")
            .html(value);
        if (value) {
            $(`#${this.id}, [original-id="${this.id}"]`).find(
                ".tabstrip-item-icon"
            );
            // .addClass("me-2");
            // $(`#${this.id}, [original-id="${this.id}"]`).addClass("ps-2");
        } else {
            $(`#${this.id}, [original-id="${this.id}"]`).find(
                ".tabstrip-item-icon"
            );
            // .removeClass("me-2");
            // $(`#${this.id}, [original-id="${this.id}"]`).removeClass("ps-2");
        }
    }
}

// !New tab
// ------------------------------
/**
 * Create a new tab.
 * @param {Object} options - Options for the new tab.
 * @param {string} options.title - The title of the new tab.
 * @param {number} options.index - The index of the new tab. 0 for the first tab, -1 for the last tab, and a number for the tab with the index.
 * @param {string} options.src - The src of the new tab.
 * @param {Object} options.data - The data of the new tab.
 * @param {string} options.type - The type of opening thr new tab, "inner" or "iframe".
 * @param {boolean} options.isActive - Whether the new tab is active.
 * @param {boolean} options.keep - Whether the new tab is kept after unfocus.
 * @return {undefined}
 * @example
 * newPage({
 *  title: "New Page",
 *  src: "https://www.google.com",
 *  isActive: true,
 *  type: "inner",
 *  keep: false,
 *  data: {
 *  id: 1,
 *  name: "Google",
 * });
 * // This will create a new tab with title "New Page", src "https://www.google.com", and active.
 * // The data of the new tab is {id: 1, name: "Google"}. The data will be stored in the tab.
 * // The type of the new tab is "inner", which means the content of the new tab is loaded by innerHTML.
 * // The new tab will be closed when it is unfocused.
 */
function newPage(options) {
    var index = options.index;
    var isActive = options.isActive;

    // 从options内去掉isActive和index，因为这两个参数不需要传给page
    // Delete isActive and index from options, because they are not needed in page.
    delete options.isActive;
    delete options.index;

    const page = new Page(options);
    // 在page内添加新的页面
    pages.opened.push(page);

    // 允许聚焦当前活跃的页面
    const tabindex = isActive ? 0 : -1;
    // Generate tab
    // 使用openedWindows作为id，这样就不会有重复的id了
    const newTab = `<li id="${page.id}" target-src="${page.src}" tabindex="${tabindex}" 
    class="tabstrip-item new-tab" draggable="true" role="tab">
    <span class="tabstrip-item-icon"></span>
    <span class="tabstrip-item-text"></span></li>`;

    // 在insertPlace插入新的Tab，其中新插入的Tab为class=new_tab
    // insertPlace是一个数字，表示在第几个Tab后面插入新的Tab
    // 如果insertPlace是0，表示在第一个Tab前面插入新的Tab
    // 如果insertPlace是-1，表示在最后一个Tab后面插入新的Tab
    // 等这些执行完了后，如果isActive为true，表示新的Tab是活跃的，就点击它

    // 如果insertPlace是0，表示在第一个Tab前面插入新的Tab
    switch (index) {
        case 0:
            // 如果insertPlace是0，表示在第一个Tab前面插入新的Tab
            // 在第一个Tab前面插入新的Tab
            $tabStrip.prepend(newTab);
            break;
        case -1:
            // 如果insertPlace是-1，表示在最后一个Tab后面插入新的Tab
            // 在最后一个Tab后面插入新的Tab
            $tabStrip.append(newTab);
            break;
        default:
            // 如果insertPlace是一个数字，表示在第几个Tab后面插入新的Tab
            // 在第insertPlace个Tab后面插入新的Tab
            $tabStrip.children().eq(index).after(newTab);
            break;
    }

    page.title = options.title;

    // 重新绑定所有Tab的点击事件，因为新插入的Tab的点击事件还没有绑定
    // 这里是为了省事，干脆重新绑定所有Tab的点击事件
    reBlindNavLinkClick();

    // 在$tabStrip里找到class=new_tab的元素
    var $newTab = $tabStrip.children(".new-tab");
    // console.log($newTab);
    // 如果isActive为true，表示新的Tab是活跃的，就点击它
    if (isActive) {
        // 点击新的Tab
        $newTab.click();
    }
    // 移除class=new_tab
    $newTab.removeClass("new-tab");

    // 因为新建了标签页，所以要重新绑定标签页栏的快捷键
    reBlindHotKey();
}

// !这一部分负责左右滑动导航栏
// ------------------------------
// 监听滚动条
// $tabStrip on scroll
var $nav = $tabStrip;
$nav.on("scroll", judgeScrollBtn);
// 监听窗口大小变化
// $(window) on resize
$(window).on("resize", judgeScrollBtn);

$(document).ready(judgeScrollBtn);

// 判断是否需要滚动按钮及决定其显示状态的函数
/**
 * Judge whether to scroll the button and decide its display status.
 */
function judgeScrollBtn() {
    // 如果.nav的宽度大于等于.nav的滚动宽度，就隐藏向左滚动按钮和向右滚动按钮
    if ($nav.outerWidth() >= $nav[0].scrollWidth) {
        $tabLeftBtn.hide();
        $tabRightBtn.hide();
        $tabStrip.addClass("ps-2");
    } else {
        $tabLeftBtn.show();
        $tabRightBtn.show();
        $tabStrip.removeClass("ps-2");

        var $navScrollLeft = $nav.scrollLeft();
        if ($navScrollLeft === 0) {
            $tabLeftBtn
                .attr("disabled", true)
                // Remove the shadow of the left button
                .css({ "box-shadow": "none" });
            $tabRightBtn
                .attr("disabled", false)
                // Add the shadow of the right button
                .css({ "box-shadow": "-4px 0 5px -5px rgba(0, 0, 0, 0.5)" });
        } else if (
            $navScrollLeft + $nav.outerWidth() >=
            $nav[0].scrollWidth - 1
        ) {
            $tabLeftBtn
                .attr("disabled", false)
                .css({ "box-shadow": "4px 0 5px -5px rgba(0, 0, 0, 0.5)" });
            $tabRightBtn.attr("disabled", true).css({ "box-shadow": "none" });
        } else {
            $tabLeftBtn
                .attr("disabled", false)
                .css({ "box-shadow": "4px 0 5px -5px rgba(0, 0, 0, 0.5)" });
            $tabRightBtn
                .attr("disabled", false)
                .css({ "box-shadow": "-4px 0 5px -5px rgba(0, 0, 0, 0.5)" });
        }
    }
}

// 当点击向左滚动按钮的时候，.nav向左滑动一段距离；当这个按钮在短时间内被多次点击时，.nav向左滑动一大段距离
var navLeftBtnClickCount = 0; // 点击次数
var navLeftBtnClickTimer = null; // 定时器

var $rollWidth = 200;
$tabLeftBtn.on("click", function () {
    var $navScrollLeft = $nav.scrollLeft();
    const animateTime = prefersReducedMotion() ? 0 : 300;
    if (navRightBtnClickCount === 0) {
        $nav.animate(
            { scrollLeft: $navScrollLeft - $rollWidth },
            {
                duration: animateTime,
                easing: "easeOutQuad",
            }
        );
        navRightBtnClickCount++;
        navRightBtnClickTimer = setTimeout(function () {
            navRightBtnClickCount = 0;
        }, 500);
    } else {
        $nav.animate(
            { scrollLeft: $navScrollLeft - $rollWidth * 3 },
            {
                duration: animateTime,
                easing: "easeOutQuad",
            }
        );
    }
});

// 当点击向右滚动按钮的时候，.nav向右滑动一小段距离；当这个按钮在短时间内被多次点击时，.nav向右滑动一大段距离
var navRightBtnClickCount = 0; // 点击次数
var navRightBtnClickTimer = null; // 定时器
$tabRightBtn.on("click", function () {
    var $navScrollLeft = $nav.scrollLeft();
    const animateTime = prefersReducedMotion() ? 0 : 300;
    if (navRightBtnClickCount === 0) {
        $nav.animate(
            { scrollLeft: $navScrollLeft + $rollWidth },
            {
                duration: animateTime,
                easing: "easeOutQuad",
            }
        );

        navRightBtnClickCount++;
        navRightBtnClickTimer = setTimeout(function () {
            navRightBtnClickCount = 0;
        }, 500);
    } else {
        $nav.animate(
            { scrollLeft: $navScrollLeft + $rollWidth * 3 },
            {
                duration: animateTime,
                easing: "easeOutQuad",
            }
        );
    }
});

// !Tab oclick
// ------------------------------
/**
 * The y-axis slides to the currently active tab
 * @param {object} $activeTab The object of the currently active tag obtained by JQuery.
 */
function slideXToActiveTab($activeTab) {
    // 当一个.nav-link被点击的时候，如果它不完整在可视区域内，就滚动到它的位置
    var $nav = $tabStrip;
    var $navItem = $activeTab.closest(".tabstrip-item");
    var $navItemWidth = $navItem.outerWidth();
    var $navItemOffsetLeft = $navItem.offset().left;
    var $navWidth = $nav.outerWidth();
    var $navOffsetLeft = $nav.offset().left;
    var $navScrollLeft = $nav.scrollLeft();
    var $navScrollRight = $navScrollLeft + $navWidth;
    var $navItemScrollLeft =
        $navItemOffsetLeft - $navOffsetLeft + $navScrollLeft;
    var $navItemScrollRight = $navItemScrollLeft + $navItemWidth;

    const animateTime = prefersReducedMotion() ? 0 : 200;
    if ($navItemScrollLeft < $navScrollLeft) {
        $nav.animate(
            {
                scrollLeft: $navItemScrollLeft,
            },
            animateTime
        );
    } else if ($navItemScrollRight > $navScrollRight) {
        $nav.animate(
            {
                scrollLeft: $navItemScrollRight - $navWidth,
            },
            animateTime
        );
    }
}

/**
 * Synchronize the sorting from the tabstrip to the view-all-box.
 */
function syncSortToViewAllBox() {
    // 同步排序
    var $headerNavLi = $(tabStripItemsSelector);
    var $tabList = $navViewAllBoxTabList;
    var $tabListLi = $(navViewAllBoxTabListItemsSelector);
    $headerNavLi.each(function (index, element) {
        var $element = $(element);
        var $target = $element.attr("id");
        var $tabListLiTarget = $tabListLi.filter(
            "[original-id='" + $target + "']"
        );
        // console.log($tabListLiTarget);
        $tabListLiTarget.attr("data-index", index);
    });

    // 重新排序
    $tabListLi.sort(function (a, b) {
        var contentA = parseInt($(a).attr("data-index"));
        var contentB = parseInt($(b).attr("data-index"));
        return contentA - contentB;
    });
    $tabListLi.detach().appendTo($tabList);
}

/**
 * Bind click event to all tabs.
 */
function reBlindNavLinkClick() {
    // define tabs
    var $navTabs = $(".tabstrip-item");

    // 清除点击事件
    $navTabs.off("click");
    // 添加点击事件
    $navTabs.on("click", function () {
        // 如果点击的是当前tab，就不做任何事
        if ($(this).hasClass(activeClass)) {
            return;
        }

        // 隐藏#view-all-box
        $navViewAllBox.hide();
        $MenuBox.hide();
        $boxMusk.hide();

        var _id = $(tabStripItemsSelector + "." + activeClass).attr("id");
        for (var _page of pages.opened) {
            if (_page.id == _id) {
                pages.before = _page;
                break;
            }
        }
        // 遍历所有tab
        $navTabs.each(function () {
            // 为所有的tab移除close button
            $(this).find(closeTabBtnSelector).remove();
            // 移除class active
            $(this).removeClass(activeClass);
            // tabindex设为-1
            $(this).attr("tabindex", -1);
        });

        // 为当前tab添加close button
        $(this).append(closeTabBtnTemplate);
        // 为当前tab添加class active
        $(this).addClass(activeClass);
        // tabindex设为0
        $(this).attr("tabindex", 0);
        // 跳转到当前tab的src
        // window.location.href = $(tab).attr("target-src");

        // 重新绑定拖动事件
        addDragFunction(tabStrip, syncSortToViewAllBox);

        // Change the content from the tab src
        var $tab = $(this);
        var tabSrc = $tab.attr("target-src");

        var _id = $tab.attr("id");
        for (var _page of pages.opened) {
            if (_page.id == _id) {
                pages.current = _page;
                break;
            }
        }

        changeTabContent();

        // Judge whether to show the scroll button.
        judgeScrollBtn();

        slideXToActiveTab($(this));
    });
}

// !Change content
// ------------------------------

// 为当前页面的id添加前缀
/**
 * Add prefix to the id of all elements in the current page.
 * @param {String | HTMLElement} element The element to be added prefix, usually the active page.
 */
function addPrefixToId(element) {
    // 为了防止页面内的元素id冲突，离开页面时将页面内所有id添加前缀
    // 1. 获取所有id前缀为data-的元素
    const activePage = $(element);
    const dataElements = activePage.find("[id]");
    // 2. 遍历所有元素
    dataElements.each(function (index, element) {
        // 3. 获取元素的id
        var id = $(element).attr("id");
        // 4. 添加id前缀
        var newId = "--data-unfocused-window-id-" + id;
        // 5. 设置元素的id
        $(element).attr("id", newId);
    });
}

// 为当前页面的id删除前缀
/**
 * Remove the prefix from the id of the element.
 * @param {String | HTMLElement} element The element to be removed prefix, usually the active page.
 */
function removePrefixFromId(element) {
    // 1. 获取所有id前缀为data-的元素
    const activePage = $(element);
    const dataElements = activePage.find("[id^='--data-unfocused-window-id-']");
    // 2. 遍历所有元素
    dataElements.each(function (index, element) {
        // 3. 获取元素的id
        var id = $(element).attr("id");
        // 4. 去掉id前缀
        var newId = id.replace("--data-unfocused-window-id-", "");
        // 5. 设置元素的id
        $(element).attr("id", newId);
    });
}

/**
 * Request the src and replace the content.
 */
async function changeTabContent() {
    // *Leave tab
    // Save the scroll position of the tabcontent box.
    // 保存tabcontent的滚动位置

    // 如果存在名为leaveTab的函数，就执行它
    // Run leaveTab function, if it exists and the type of the pages is "inner".
    if (
        pages.before.type === "inner" &&
        typeof pages.before.leaveTab === "function"
    ) {
        await pages.before.leaveTab();
    }

    const oldActivePage = $("." + activeContentBoxClass);
    const tabContentScrollTop = oldActivePage.scrollTop();
    // Save to localStorage
    localStorage.setItem(pages.before.id, tabContentScrollTop);

    // *Now we've closed the old, and we need to open the new.
    // *However, the old one vill be invisible later,
    // *until the new one is loaded, so the user won't see a blank page or a flash.
    // TODO: 以下切换页面的方式会造成闪烁，需要加以改进。
    // TODO: The following way to switch pages will cause flashing, which needs to be improved.

    // *---------------Delete the old one---------------*
    oldActivePage.removeClass(activeContentBoxClass).addClass(contentBoxClass);

    // 如果keep==false就删除以节省内存
    // If keep==false, delete the element to save memory.
    if (pages.before.keep === false) {
        $(`[data-id="${pages.before.id}"].${contentBoxClass}`).remove();
    } else {
        addPrefixToId(pages.before.selector);
    }
    // *------------------------------------------------*

    // 1. reenter
    // Sometimes the src is the same as the oldSrc, so we need to check it.
    // If src is the same as oldSrc, we don't need to request the src.
    // Instead, we just need to execute the reenterTab function.

    // TODO: Still have so many bugs. Need to fix it later.
    // if (
    //     pages.before.type === "inner" &&
    //     pages.before.src === src &&
    //     pages.before.keep === false &&
    //     pages.current.keep === false
    // ) {
    //     // 如果存在名为reenterTab的函数，就执行它
    //     if (typeof reenterTab === "function") {
    //         reenterTab();
    //     }
    //     return;
    // }

    // 2. look into the olds
    // 寻找data-id数字那和page.current.id一样的元素并将其class设为activeContentBoxClass
    // 如果找不到，就新建一个div并将其class设为activeContentBoxClass

    // 选中.tabContentBox中data-id属性值和page.current.id一样的元素
    const $contentBox = $(`[data-id="${pages.current.id}"].${contentBoxClass}`);

    if ($contentBox.length !== 0) {
        $contentBox
            .removeClass(contentBoxClass)
            .addClass(activeContentBoxClass);

        if (
            pages.current.type === "inner" &&
            typeof pages.current.enterTab === "function"
        ) {
            await pages.current.enterTab();
        }

        removePrefixFromId(pages.current.selector);

        return;
    }

    // *We have to open a new tab, since we can't find it in the document.
    let newContent;

    if (pages.current.type === "inner") {
        newContent = $(
            `<div class="${activeContentBoxClass}" data-id="${pages.current.id}" tabindex="-1"></div>`
        );
        newContent.load(pages.current.src, async () => {
            // *Finally we can make the old one invisible.
            // *We invisible the old one after the new one is loaded,

            // Process the new page, since it's loaded.
            // 把pageConfig内的键值对赋值给page.current
            Object.assign(pages.current, pageConfig);

            // 从localStorage中加载滚动条位置
            // Load scroll position from localStorage.
            const scrollTop = localStorage.getItem(pages.current.id);
            newContent.scrollTop(scrollTop);

            if (typeof pages.current.enterTab === "function") {
                await pages.current.enterTab();
            }

            // Load language file after the pages is loaded. (inner type only)
            // loadLanguage();
            // 如果pageConfig.language不是undefined，就加载语言文件
            if (pageConfig["language-file"] !== undefined) {
                loadLanguage(pageConfig["language-file"]);
            }
        });
    } else if (pages.current.type === "iframe") {
        newContent = $(
            `<iframe class="${activeContentBoxClass}" src="${pages.current.src}" data-id="$pagese.current.id}" tabindex="-1"></iframe>`
        );
    }

    // 将新创建的元素添加到document中
    $("body").append(newContent);
    // reloadSettings();
}

// !New tab button
// ------------------------------
$tabAddBtn.on("click", function () {
    // 在active的标签页右面插入新标签页并聚焦
    var $activeTab = $(".tabstrip-item.active");
    // 获取当前标签页的index
    var index = $activeTab.index();
    newPage({
        title: "New Tab",
        src: "newTab.html",
        index: index,
        isActive: true,
        keep: false,
    });
});

// !View all
// Show the view all box
// ------------------------------

/**
 * The y-axis slides to the currently active tab
 * @param {object} $activeTab The object of the currently active tag obtained by JQuery.
 */
function slideYToActiveTab($activeTab) {
    // 竖直方向滑动到当前活跃的标签页
    var $activeTabHeight = $activeTab.outerHeight();
    var $activeTabOffsetTop = $activeTab.offset().top;
    var $viewAllBoxHeight = $navViewAllBox.outerHeight();
    var $viewAllBoxOffsetTop = $navViewAllBox.offset().top;
    var $viewAllBoxScrollTop = $navViewAllBox.scrollTop();
    var $viewAllBoxScrollBottom = $viewAllBoxScrollTop + $viewAllBoxHeight;
    var $activeTabScrollTop =
        $activeTabOffsetTop - $viewAllBoxOffsetTop + $viewAllBoxScrollTop;
    var $activeTabScrollBottom = $activeTabScrollTop + $activeTabHeight;

    const animateTime = prefersReducedMotion() ? 0 : 200;

    if ($activeTabScrollTop < $viewAllBoxScrollTop) {
        $navViewAllBox.animate(
            {
                scrollTop: $activeTabScrollTop,
            },
            animateTime
        );
    } else if ($activeTabScrollBottom > $viewAllBoxScrollBottom) {
        $navViewAllBox.animate(
            {
                scrollTop: $activeTabScrollBottom - $viewAllBoxHeight + 10,
            },
            animateTime
        );
    }
}

/**
 * Synchronize the sorting from the view-all-box to the tabstrip.
 */
function syncSortToTabnav() {
    // 同步排序
    // 将被移动了的li的位置信息更新到#header-nav内的li的data-target相同的li上
    var $headerNav = $tabStrip;
    var $viewAllBoxLi = $(navViewAllBoxTabListItemsSelector);
    var $headerNavLi = $(tabStripItemsSelector);
    $viewAllBoxLi.each(function (index) {
        var $dataTarget = $(this).attr("original-id");
        $headerNavLi.each(function () {
            if ($(this).attr("id") == $dataTarget) {
                $(this).attr("data-index", index);
            }
        });
    });

    // 将#header-nav内的li按照data-index的值从小到大排序
    $headerNavLi.sort(function (a, b) {
        return $(a).attr("data-index") - $(b).attr("data-index");
    });
    // 将#header-nav内的li按照data-index的值从小到大排序后重新插入到#header-nav内
    $headerNavLi.each(function () {
        $headerNav.append($(this));
    });
}

$tabViewAllBtn.on("click", function () {
    boxOpened = true;
    // 将#header-nav的内容复制到#view-all-box内的ul里
    var $headerNav = $tabStrip;
    var $viewAllBox = $navViewAllBox;
    var $viewAllBoxUl = $navViewAllBoxTabList;
    var $viewAllBoxMusk = $boxMusk;

    $MenuBox.hide();
    $viewAllBoxMusk.show();

    // 将#header-nav的内容复制到#view-all-box内的ul里
    // 并以此为模板进行处理
    $viewAllBoxUl.html($headerNav.html());

    // 处理#view-all-box内的ul里的li
    // 移除关闭按钮
    $viewAllBoxUl.find(closeTabBtnSelector).remove();
    // 设置当前活跃的标签页的样式
    // 设置为加粗字体，黑色
    var $activeTab = $viewAllBoxUl.find("." + activeClass);
    $activeTab
        // 最前面插入<i class="far fa-hand-point-right visually-hidden" aria-hidden="true"></i>
        // 用于色盲友好模式，提示用户当前所在的标签页
        .prepend(
            "<span class='color-blind-label me-1'><i class='far fa-hand-point-right fa-fw' aria-hidden='true'></i></span>"
        );

    // 将$viewAllItems内的id改为original-id
    // 避免id冲突
    var $viewAllItems = $(navViewAllBoxTabListItemsSelector);
    $viewAllItems.each(function () {
        var $originalId = $(this).attr("id");
        $(this).attr("original-id", $originalId);
        $(this).removeAttr("id");
    });

    // 为#view-all-box内的ul里的li添加点击事件
    $viewAllItems.on("click", function () {
        // 点击$tabStrip内id为original-id的元素
        // 触发click事件
        var $originalId = $(this).attr("original-id");
        $tabStrip.find("#" + $originalId).click();
    });

    // 将#view-all-box显示出来
    $viewAllBox.show();

    // 竖直方向滑动到当前活跃的标签页
    slideYToActiveTab($activeTab);

    // 添加拖动事件
    var node = document.querySelector("#nav-view-all-box-tab-list");
    addDragFunction(node, syncSortToTabnav);

    // 重新绑定快捷键
    reBlindHotKey();

    // 如果搜索框有内容，则聚焦到搜索框
    if ($navViewAllBoxSearchInput.val()) {
        $navViewAllBoxSearchInput.focus();
        // 光标移至最后
        var len = $navViewAllBoxSearchInput.val().length;
        $navViewAllBoxSearchInput[0].setSelectionRange(len, len);
        // 搜索
        searchTabs();
    } else {
        // 聚焦到当前活跃的标签页
        $activeTab.focus();
    }
});

// !Menu
// ------------------------------
$tabMenuBtn.on("click", function () {
    boxOpened = true;
    $navViewAllBox.hide();
    $MenuBox.show();
    $boxMusk.show();
    var $menuItems = $MenuBox.find("li");
    // 为#view-all-box内的ul里的li添加点击事件
    $menuItems.on("click", function () {
        // 隐藏#view-all-box
        $navViewAllBox.hide();
        $MenuBox.hide();
        $boxMusk.hide();
    });
});

// !Box musk
// ------------------------------
$boxMusk.on("click", function () {
    $navViewAllBox.hide();
    $MenuBox.hide();
    $boxMusk.hide();
    boxOpened = false;
});

// !Close the window
// ------------------------------
// 以下部分负责关闭窗口
/**
 * Close the active window.
 */
function closeWin() {
    // 寻找data-id数字那和page.current.id一样的元素并删除
    // 为了防止误删，先判断是否有这个元素
    if (
        $(`.${activeContentBoxClass}[data-id="${pages.current.id}"]`).length > 0
    ) {
        // *已弃用，因为会造成闪烁
        // *Deprecated, because it will cause flicker.
        // $(`.${activeContentBoxClass}[data-id="${pages.current.id}"]`).remove();
        pages.current.keep = false;
    }

    // 获取当前active的tab
    var $activeTab = $(".tabstrip-item.active");
    // 为这个tab添加class tab-to-close
    $activeTab.addClass("tab-to-close");
    var windowId = $activeTab.attr("id");
    // 如果这个窗口右边还有窗口，就把这个窗口右边的窗口激活；
    // 否则如果这个窗口左边还有窗口，就把这个窗口左边的窗口激活；
    // 否则新建窗口
    if ($activeTab.next().length > 0) {
        // console.log("右边还有窗口");
        // 点击右边的窗口
        $activeTab.next().click();
    } else if ($activeTab.prev().length > 0) {
        // console.log("左边还有窗口");
        // 点击左边的窗口
        $activeTab.prev().click();
    } else {
        $tabAddBtn.click();
    }

    // 移除.tab-to-close
    $tabStrip.find(".tab-to-close").remove();

    // 从opened中移除这个窗口
    for (var i = 0; i < pages.opened.length; i++) {
        if (pages.opened[i].id == windowId) {
            pages.opened.splice(i, 1);
            break;
        }
    }

    // Judge whether to show the scroll button.
    judgeScrollBtn();
}

// !Drag and drop tabs
// ------------------------------
// 注册拖动事件，func为鼠标抬起时运行的事件，可以为null
// 下面的这些都是为拖动事件服务的
/**
 * Add drag function to the given element's children.
 * @param {object} element The element to add drag function. Usually it's a \<ul> element.
 * @param {Function} func The callback function when the drag event is end.
 */
function addDragFunction(element, func) {
    var draging = null;
    element.ondragstart = function (event) {
        //console.log("start");
        //firefox设置了setData后元素才能拖动！！！！
        event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
        //event.dataTransfer.setData("self", event.target);
        draging = event.target;

        // // 阻止firefox的默认行为，否则firefox会打开新tab
        // event.preventDefault();

        // 鼠标抬起时运行func事件
        element.ondragend = function (event) {
            //console.log("end");
            if (func) {
                func(event);
            }
        };
    };

    element.ondragover = function (event) {
        //console.log("onDrop over");
        event.preventDefault();
        var target = event.target;
        //因为dragover会发生在ul上，所以要判断是不是li
        if (target.nodeName === "LI" && target !== draging) {
            var targetRect = target.getBoundingClientRect();
            var dragingRect = draging.getBoundingClientRect();
            if (target && target.animated) {
                return;
            }
            if (_index(draging) < _index(target)) {
                target.parentNode.insertBefore(draging, target.nextSibling);
            } else {
                target.parentNode.insertBefore(draging, target);
            }
            _animate(dragingRect, draging);
            _animate(targetRect, target);
        }
    };
}

//使用事件委托，将li的事件委托给ul
//获取元素在父元素中的index
function _index(el) {
    var index = 0;

    if (!el || !el.parentNode) {
        return -1;
    }

    while (el && (el = el.previousElementSibling)) {
        //console.log(el);
        index++;
    }

    return index;
}

function _animate(prevRect, target) {
    var ms = prefersReducedMotion() ? 0 : 300;

    if (ms) {
        var currentRect = target.getBoundingClientRect();

        if (prevRect.nodeType === 1) {
            prevRect = prevRect.getBoundingClientRect();
        }

        _css(target, "transition", "none");
        _css(
            target,
            "transform",
            "translate3d(" +
                (prevRect.left - currentRect.left) +
                "px," +
                (prevRect.top - currentRect.top) +
                "px,0)"
        );

        target.offsetWidth; // 触发重绘
        //放在timeout里面也可以
        // setTimeout(function() {
        //     _css(target, 'transition', 'all ' + ms + 'ms');
        //     _css(target, 'transform', 'translate3d(0,0,0)');
        // }, 0);
        _css(target, "transition", "all " + ms + "ms");
        _css(target, "transform", "translate3d(0,0,0)");

        clearTimeout(target.animated);
        target.animated = setTimeout(function () {
            _css(target, "transition", "");
            _css(target, "transform", "");
            target.animated = false;
        }, ms);
    } else {
        // 没有动画时，直接将元素放到目标位置
        _css(target, "transform", "");
    }
}

//给元素添加style
function _css(el, prop, val) {
    var style = el && el.style;

    if (style) {
        if (val === void 0) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                val = document.defaultView.getComputedStyle(el, "");
            } else if (el.currentStyle) {
                val = el.currentStyle;
            }

            return prop === void 0 ? val : val[prop];
        } else {
            if (!(prop in style)) {
                prop = "-webkit-" + prop;
            }

            style[prop] = val + (typeof val === "string" ? "" : "px");
        }
    }
}

// !Search tabs
// ------------------------------
// 搜索框，搜索设置项
/**
 * Search tabs and show result.
 */
function searchTabs() {
    var $searchInput = $navViewAllBoxSearchInput;

    // 从搜索框获取搜索内容
    const searchContent = $searchInput.val();

    // 如果搜索内容为空，则不执行搜索
    if (searchContent == "") {
        // Empty.
        $navViewAllBoxTabList.children().removeClass("hide");
        // 清除搜索结果中的高亮
        $navViewAllBoxTabList.children().each(function () {
            $(this).html($(this).text());
            // 如果是active的tab
            if ($(this).hasClass("active")) {
                $(this).prepend(
                    "<span class='color-blind-label me-1'><i class='far fa-hand-point-right fa-fw' aria-hidden='true'></i></span>"
                );
            }
        });
        return;
    }

    $navViewAllBoxTabList.children().addClass("hide");

    // 如果搜索内容不为空，则执行搜索
    // 遍历所有设置项
    // 设置项为class为options的span
    // 搜索时使用模糊搜索，忽略大小写

    const searchRegex = new RegExp(`(${searchContent})`, "i");
    $navViewAllBoxTabList.children().each(function () {
        // console.log($(this).text());
        // 如果搜索内容在设置项中，则在search-result-list中添加对应的#settings-list > li > div > ul > li
        if ($(this).text().search(searchRegex) != -1) {
            $(this).removeClass("hide");
            $(this).html(
                $(this)
                    .text()
                    .replace(
                        searchRegex,
                        "<span style='color: #ff0000; '>$1</span>"
                    )
            );

            // 如果是active的tab
            if ($(this).hasClass("active")) {
                $(this).prepend(
                    "<span class='color-blind-label me-1'><i class='far fa-hand-point-right fa-fw' aria-hidden='true'></i></span>"
                );
            }
        }
    });
}

// Run search when input value changed.
// 搜索框内容改变时执行搜索
$navViewAllBoxSearchInput.on("input", function () {
    searchTabs();
});
