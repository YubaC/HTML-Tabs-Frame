"use strict";

// !Define variables
// ------------------------------

// Buttons navigation
var $tabLeftBtn = $("#tabnav-left-tabbtn");
var $tabRightBtn = $("#tabnav-right-tabbtn");
var $tabAddBtn = $("#tabnav-add-tabbtn");
var $tabViewAllBtn = $("#tabnav-view-all-tabbtn");
var $tabMenuBtn = $("#tabnav-menu-tabbtn");

var closeTabBtnSelector = ".close-this-window-tabbtn";
var closeTabBtnTemplate = '<button type="button" class="close-this-window-tabbtn tabbtn-close" onclick="closeWin()"></button>';

// Tab navigation, a <ul> element
var $tabNav = $("#header-tabnav");
var tabNav = document.getElementById("header-tabnav");
var tabNavItemsSelector = "#header-tabnav>li";

// View all box, a <ul> element, to show all tabs
var $navViewAllBox = $("#nav-view-all-box");
var $navViewAllBoxTabList = $("#nav-view-all-box-tab-list");
var navViewAllBoxTabListItemsSelector = "#nav-view-all-box-tab-list>li";
// var $navViewAllBoxTabListItems = $("#nav-view-all-box-tab-list>li");

// Box musk
var $boxMusk = $("#box-musk");

var activeClass = "active";

// Content box
var $contentBox = $("#tabContent");

// Base path
// var base = "file:///";
var base = "";

// Opened windows number
var openedWindows = 0;

// *Features
// // Number of windows that can remain loaded
// var maxWindows = 5;
// var windowsList = [];

// !New tab
// ------------------------------
/**
 * Create a new tab.
 * @param {String} title Tab title.
 * @param {Number} index Whrer to insert the new tab, after the tab with the index. If 0, insert at the beginning; if -1, insert at the end.
 * @param {String} src the src of the target.
 * @param {Boolean} isActive If true, the new tab will be actived.
 */
function newPage(title, index, src, isActive) {
    if (isActive) {
        var tabindex = 0;
    } else {
        var tabindex = -1;
    }
    // Generate tab
    // 使用openedWindows作为id，这样就不会有重复的id了
    var newTab = '<li id="' +
        openedWindows +
        '" target-src="' +
        src +
        '" tabindex="' +
        tabindex +
        '" class="tabnav-item new-tab" draggable="true">' +
        title +
        '</li>';

    openedWindows++;

    // 在insertPlace插入新的Tab，其中新插入的Tab为class=new_tab
    // insertPlace是一个数字，表示在第几个Tab后面插入新的Tab
    // 如果insertPlace是0，表示在第一个Tab前面插入新的Tab
    // 如果insertPlace是-1，表示在最后一个Tab后面插入新的Tab
    // 等这些执行完了后，如果isActive为true，表示新的Tab是活跃的，就点击它

    // 如果insertPlace是0，表示在第一个Tab前面插入新的Tab
    if (index === 0) {
        // 在第一个Tab前面插入新的Tab
        $tabNav.prepend(newTab);
    } else if (index === -1) {
        // 如果insertPlace是-1，表示在最后一个Tab后面插入新的Tab
        // 在最后一个Tab后面插入新的Tab
        $tabNav.append(newTab);
    } else {
        // 如果insertPlace是一个数字，表示在第几个Tab后面插入新的Tab
        // 在第insertPlace个Tab后面插入新的Tab
        $tabNav.children().eq(index).after(newTab);
    }

    // 重新绑定所有Tab的点击事件，因为新插入的Tab的点击事件还没有绑定
    // 这里是为了省事，干脆重新绑定所有Tab的点击事件
    reBlindNavLinkClick();

    // 在$tabNav里找到class=new_tab的元素
    var $newTab = $tabNav.children(".new-tab");
    // console.log($newTab);
    // 如果isActive为true，表示新的Tab是活跃的，就点击它
    if (isActive) {
        // 点击新的Tab
        $newTab.click();
    }
    // 移除class=new_tab
    $newTab.removeClass("new-tab");
}

// !这一部分负责左右滑动导航栏
// ------------------------------

// 当点击向左滚动按钮的时候，.nav向左滑动一段距离；当这个按钮在短时间内被多次点击时，.nav向左滑动一大段距离
var navLeftBtnClickCount = 0; // 点击次数
var navLeftBtnClickTimer = null; // 定时器

var $nav = $tabNav;
var $rollWidth = 200;
$tabLeftBtn.on("click", function() {
    if (navLeftBtnClickCount === 0) {
        // console.log(0);
        // .nav向左滑动一段距离
        // var $navWidth = $nav.outerWidth();
        var $navScrollLeft = $nav.scrollLeft();
        $nav.animate({
                scrollLeft: $navScrollLeft - $rollWidth,
            },
            200
        );
        // 点击次数加1
        navLeftBtnClickCount++;
        navLeftBtnClickTimer = setTimeout(function() {
            navLeftBtnClickCount = 0;
        }, 500);
    } else {
        // console.log(1);
        // .nav向左滑动一大段距离
        var $navWidth = $nav.outerWidth();
        var $navScrollLeft = $nav.scrollLeft();
        $nav.animate({
                scrollLeft: $navScrollLeft - $rollWidth * 3,
            },
            200
        );
    }
});

// 当点击向右滚动按钮的时候，.nav向右滑动一小段距离；当这个按钮在短时间内被多次点击时，.nav向右滑动一大段距离
var navRightBtnClickCount = 0; // 点击次数
var navRightBtnClickTimer = null; // 定时器
var $navScrollRight = $nav.scrollLeft();
$tabRightBtn.on("click", function() {
    if (navRightBtnClickCount === 0) {
        // console.log(0);
        // .nav向右滑动一小段距离
        var $navWidth = $nav.outerWidth();
        var $navScrollLeft = $nav.scrollLeft();
        $nav.animate({
                scrollLeft: $navScrollLeft + $rollWidth,
            },
            200
        );
        // 点击次数加1
        navRightBtnClickCount++;
        navRightBtnClickTimer = setTimeout(function() {
            navRightBtnClickCount = 0;
        }, 500);
    } else {
        // console.log(1);
        // .nav向右滑动一大段距离
        var $navWidth = $nav.outerWidth();
        var $navScrollLeft = $nav.scrollLeft();
        $nav.animate({
                scrollLeft: $navScrollLeft + $rollWidth * 3,
            },
            200
        );
    }
});

// !Tab oclick
// ------------------------------
/**
 * Bind click event to all tabs.
 */
function reBlindNavLinkClick() {
    // define tabs
    var $navTabs = $(".tabnav-item");

    // 清除点击事件
    $navTabs.off("click");
    // 添加点击事件
    $navTabs.on("click", function() {
        // 遍历所有tab
        $navTabs.each(function() {
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
        addDragFunction(tabNav, function() {
            // 同步排序
            // 将被移动了的li的位置信息更新到viewallbox内的li
            // 同步排序
            // 将被移动了的li的位置信息更新到#tab-list内的li的data-target相同的li上
            var $headerNav = $tabNav;
            var $headerNavLi = $(tabNavItemsSelector);
            var $tabList = $navViewAllBoxTabList;
            var $tabListLi = $(navViewAllBoxTabListItemsSelector);
            $headerNavLi.each(function(index, element) {
                var $element = $(element);
                var $target = $element.attr("id");
                var $tabListLiTarget = $tabListLi.filter("[original-id='" + $target + "']");
                console.log($tabListLiTarget);
                $tabListLiTarget.attr("data-index", index);
            });

            // 重新排序
            $tabListLi.sort(function(a, b) {
                var contentA = parseInt($(a).attr("data-index"));
                var contentB = parseInt($(b).attr("data-index"));
                return contentA - contentB;
            });
            $tabListLi.detach().appendTo($tabList);

        });

        // Change the content from the tab src
        var $tab = $(this);
        var $tabSrc = $tab.attr("target-src");
        changeTabContent($tabSrc);

        // 当一个.nav-link被点击的时候，如果它不完整在可视区域内，就滚动到它的位置
        var $this = $(this);
        var $nav = $tabNav;
        var $navItem = $this.closest(".tabnav-item");
        var $navItemWidth = $navItem.outerWidth();
        var $navItemOffsetLeft = $navItem.offset().left;
        var $navWidth = $nav.outerWidth();
        var $navOffsetLeft = $nav.offset().left;
        var $navScrollLeft = $nav.scrollLeft();
        var $navScrollRight = $navScrollLeft + $navWidth;
        var $navItemScrollLeft =
            $navItemOffsetLeft - $navOffsetLeft + $navScrollLeft;
        var $navItemScrollRight = $navItemScrollLeft + $navItemWidth;
        if ($navItemScrollLeft < $navScrollLeft) {
            $nav.animate({
                    scrollLeft: $navItemScrollLeft,
                },
                200
            );
        } else if ($navItemScrollRight > $navScrollRight) {
            $nav.animate({
                    scrollLeft: $navItemScrollRight - $navWidth,
                },
                200
            );
        }
    });
}

// !Change content
// ------------------------------
/**
 * Request the src and replace the content.
 * @param {String} src The src of the page to be requested.
 */
function changeTabContent(src) {
    // 如果存在名为leaveTab的函数，就执行它
    if (typeof leaveTab === "function") {
        leaveTab();
    }
    // 请求src的内容，然后替换到content中
    // 加载完成后，如果存在名为enterTab的函数，就执行它
    $contentBox.load(src, function() {
        if (typeof enterTab === "function") {
            enterTab();
        }
    });
}

// !New tab button
// ------------------------------
$tabAddBtn.on("click", function() {
    // 在active的标签页右面插入新标签页并聚焦
    var $activeTab = $(".tabnav-item.active");
    // 获取当前标签页的index
    var index = $activeTab.index();
    newPage("baidu", index, "baidu.com", true)
});

// !View all
// Show the view all box
// ------------------------------
$tabViewAllBtn.on("click", function() {
    // 将#header-nav的内容复制到#view-all-box内的ul里
    var $headerNav = $tabNav;
    var $viewAllBox = $navViewAllBox;
    var $viewAllBoxUl = $navViewAllBoxTabList;
    var $viewAllBoxMusk = $boxMusk;

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
    $activeTab.css({
            "font-weight": "bold",
            color: "#000",
        })
        // 最前面插入<i class="far fa-hand-point-right visually-hidden" aria-hidden="true"></i>
        // 用于色盲友好模式，提示用户当前所在的标签页
        .prepend(
            "<span class='visually-hidden'><i class='far fa-hand-point-right fa-fw' aria-hidden='true'></i>&nbsp;</span>"
        )

    // 移除class active
    $activeTab.removeClass(activeClass);

    // 将$viewAllItems内的id改为original-id
    // 避免id冲突
    var $viewAllItems = $(navViewAllBoxTabListItemsSelector);
    $viewAllItems.each(function() {
        var $originalId = $(this).attr("id");
        $(this).attr("original-id", $originalId);
        $(this).removeAttr("id");
    });

    // 为#view-all-box内的ul里的li添加点击事件
    $viewAllItems.on("click", function() {
        // 点击$tabNav内id为original-id的元素
        // 触发click事件
        var $originalId = $(this).attr("original-id");
        $tabNav.find("#" + $originalId).click();
        // 隐藏#view-all-box
        $viewAllBox.hide();
        $viewAllBoxMusk.hide();
    });

    // 将#view-all-box显示出来
    $viewAllBox.show();


    // 竖直方向滑动到当前活跃的标签页
    var $activeTabHeight = $activeTab.outerHeight();
    var $activeTabOffsetTop = $activeTab.offset().top;
    var $viewAllBoxHeight = $viewAllBox.outerHeight();
    var $viewAllBoxOffsetTop = $viewAllBox.offset().top;
    var $viewAllBoxScrollTop = $viewAllBox.scrollTop();
    var $viewAllBoxScrollBottom = $viewAllBoxScrollTop + $viewAllBoxHeight;
    var $activeTabScrollTop =
        $activeTabOffsetTop - $viewAllBoxOffsetTop + $viewAllBoxScrollTop;
    var $activeTabScrollBottom = $activeTabScrollTop + $activeTabHeight;
    if ($activeTabScrollTop < $viewAllBoxScrollTop) {
        $viewAllBox.animate({
                scrollTop: $activeTabScrollTop,
            },
            200
        );
    } else if ($activeTabScrollBottom > $viewAllBoxScrollBottom) {
        $viewAllBox.animate({
                scrollTop: $activeTabScrollBottom - $viewAllBoxHeight + 10,
            },
            200
        );
    }

    viewAllBoxFocusSet();

    var node = document.querySelector("#nav-view-all-box-tab-list");
    addDragFunction(node, function(event) {
        // 同步排序
        // 将被移动了的li的位置信息更新到#header-nav内的li的data-target相同的li上
        var $headerNav = $tabNav;
        var $viewAllBoxLi = $(navViewAllBoxTabListItemsSelector);
        var $headerNavLi = $(tabNavItemsSelector);
        $viewAllBoxLi.each(function(index) {
            var $dataTarget = $(this).attr("original-id");
            $headerNavLi.each(function() {
                if ($(this).attr("id") == $dataTarget) {
                    $(this).attr("data-index", index);
                }
            });
        });

        // 将#header-nav内的li按照data-index的值从小到大排序
        $headerNavLi.sort(function(a, b) {
            return $(a).attr("data-index") - $(b).attr("data-index");
        });
        // 将#header-nav内的li按照data-index的值从小到大排序后重新插入到#header-nav内
        $headerNavLi.each(function() {
            $headerNav.append($(this));
        });
    });
});

// !Close the window
// ------------------------------
// 以下部分负责关闭窗口
/**
 * Close the active window.
 */
function closeWin() {
    // 获取当前active的tab
    var $activeTab = $(".tabnav-item.active");
    // 为这个tab添加class tab-to-close
    $activeTab.addClass("tab-to-close");
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
    $tabNav.find(".tab-to-close").remove();
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
    element.ondragstart = function(event) {
        //console.log("start");
        //firefox设置了setData后元素才能拖动！！！！
        event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
        //event.dataTransfer.setData("self", event.target);
        draging = event.target;

        // // 阻止firefox的默认行为，否则firefox会打开新tab
        // event.preventDefault();

        // 鼠标抬起时运行func事件
        element.ondragend = function(event) {
            //console.log("end");
            if (func) {
                func(event);
            }
        };
    };
    element.ondragover = function(event) {
        //console.log("onDrop over");
        event.preventDefault();
        var target = event.target;
        //因为dragover会发生在ul上，所以要判断是不是li
        if (target.nodeName === "LI") {
            if (target !== draging) {
                var targetRect = target.getBoundingClientRect();
                var dragingRect = draging.getBoundingClientRect();
                if (target) {
                    if (target.animated) {
                        return;
                    }
                }
                if (_index(draging) < _index(target)) {
                    target.parentNode.insertBefore(draging, target.nextSibling);
                } else {
                    target.parentNode.insertBefore(draging, target);
                }
                _animate(dragingRect, draging);
                _animate(targetRect, target);
            }
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
    var ms = 300;

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
        target.animated = setTimeout(function() {
            _css(target, "transition", "");
            _css(target, "transform", "");
            target.animated = false;
        }, ms);
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
// ------------------------------