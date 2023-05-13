"use strict";

// !Define consts variables

// Buttons navigation
const $tabLeftBtn = $("#tabnav-left-tabbtn");
const $tabRightBtn = $("#tabnav-right-tabbtn");
const $tabAddBtn = $("#tabnav-add-tabbtn");
const $tabViewAllBtn = $("#tabnav-view-all-tabbtn");
const $tabMenuBtn = $("#tabnav-menu-tabbtn");

const closeTabBtnSelector = ".close-this-window-tabbtn";
const closeTabBtnTemplate =
    '<button type="button" id="tabnav-close-tab-btn" class="close-this-window-tabbtn tabbtn-close" onclick="closeWin()"></button>';

// Tab navigation, a <ul> element
const $tabNav = $("#header-tabnav");
const tabNav = document.getElementById("header-tabnav");
const tabNavItemsSelector = "#header-tabnav>li";

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

// Base path
// var base = "file:///";
const base = "";

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

// *Features
// // Number of windows that can remain loaded
// var maxWindows = 5;
// var windowsList = [];
