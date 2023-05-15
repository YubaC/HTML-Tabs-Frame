"use strict";

// !Define consts variables

// Buttons navigation
const $tabLeftBtn = $("#tabstrip-left-tabbtn");
const $tabRightBtn = $("#tabstrip-right-tabbtn");
const $tabAddBtn = $("#tabstrip-add-tabbtn");
const $tabViewAllBtn = $("#tabstrip-view-all-tabbtn");
const $tabMenuBtn = $("#tabstrip-menu-tabbtn");

const closeTabBtnSelector = ".close-this-window-tabbtn";
const closeTabBtnTemplate =
    '<button type="button" id="tabstrip-close-tab-btn" class="close-this-window-tabbtn tabbtn-close" onclick="closeWin()"></button>';

// Tab navigation, a <ul> element
const $tabStrip = $("#header-tabstrip");
const tabStrip = document.getElementById("header-tabstrip");
const tabStripItemsSelector = "#header-tabstrip>li";

// View all box, a <ul> element, to show all tabs
const $navViewAllBox = $("#nav-view-all-box");
const $navViewAllBoxTabList = $("#nav-view-all-box-tab-list");
const navViewAllBoxTabListItemsSelector = "#nav-view-all-box-tab-list>li";
const $navViewAllBoxSearchInput = $("#search-input");
// var $navViewAllBoxTabListItems = $("#nav-view-all-box-tab-list>li");

// Menu box
const $MenuBox = $("#nav-menu-box");

// Box musk
const $boxMusk = $("#box-musk");

const activeClass = "active";

// Content box
const contentBoxClass = "tabContent";
const activeContentBoxClass = "tabContentActive";

// Opened windows number, used as id, won't go down when a window is closed.
var openedWindows = 0;

var oldSrc = "";
var pages = {
    before: {},
    current: {},
    opened: [],
};

// If view all box or menu box is opened
var boxOpened = false;

// Inner page's config
var pageConfig = {};

// If prefers reduced motion
const prefersReducedMotion = () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// *Features
// // Number of windows that can remain loaded
// var maxWindows = 5;
// var windowsList = [];
