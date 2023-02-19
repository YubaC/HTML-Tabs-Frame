"use strict";

var resourcesToLoad = [];

// !settings is a variable that will be used to store the settings globally.
// !You can access it from anywhere in the application.
var settings;
var pagesToBeLoaded;

// Things to do after we get the config file
function loadSettings() {
    // !load font size
    // 设置字体大小
    $("#tabContent").css("font-size", settings["font-size"] * 20 + 100 + "%", " !important");

    var pages = pagesToBeLoaded;
    // !Load saved pages
    var activePage = pages.activePage;
    for (var page = 0; page < pages.pages.length; page++) {
        var thisPage = pages.pages[page];
        var activeThis = false;
        if (page === activePage) {
            activeThis = true;
        }
        newPage(thisPage.title, -1, thisPage.src, activeThis, thisPage.data);
    }
}

// !Get the settings config file
// Get assets/settings/settings.json
$.getJSON("assets/data/settings.json", function(data) {
    // 设置语言
    if ('localStorage' in window) {
        localStorage.setItem('lang', data.language);
        // console.log(localStorage.getItem('lang'));
    }

    settings = data;
})

.then(() => {
    // Get the language list
    $.getJSON("assets/lang/languages.json", (data) => {
        settings.availableLanguages = data;
    });
})

.then(() => {
    // Get the language list
    $.getJSON("assets/data/pages.json", (data) => {
        pagesToBeLoaded = data;
    });
})

// Now we've got the settings, we can load it into the application
.then(() => {
    // !Autoload resources
    // After we load the settings, we can load the rest of the application

    for (var file of cssFiles) {
        resourcesToLoad.push(loadExternalResource(file, "css"));
    }

    for (file of jsFiles) {
        resourcesToLoad.push(loadExternalResource(file, "js"));
    }

    // Load files
    Promise.all(resourcesToLoad).then(() => {
        loadSettings();
    });
});