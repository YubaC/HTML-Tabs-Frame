function onNightMode() {
    // 为图片添加深色滤镜
    // 写入css代码
    const imgFilter = `
    img:not([src$="#night-mode-only"]) {
        filter: brightness(0.7);
    }
    img[src$="#light-mode-only"] {
        display: none;
    }
    img[src$="#night-mode-only"] {
        display: block;
    }
    `;
    if ($("#img-filter").length == 0) {
        var style = document.createElement("style");
        style.id = "img-filter";
        style.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    $("#img-filter").html(imgFilter);

    $("body").addClass("prefers-dark");
}

function onLightMode() {
    const imgFilter = `
    img:not([src$="#night-mode-only"]) {
        filter: none;
    }
    img[src$="#light-mode-only"] {
        display: block;
    }
    img[src$="#night-mode-only"] {
        display: none;
    }
    `;
    // 为图片移除深色滤镜
    // 写入css代码
    if ($("#img-filter").length == 0) {
        var style = document.createElement("style");
        style.id = "img-filter";
        style.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    $("#img-filter").html(imgFilter);

    $("body").removeClass("prefers-dark");
}

// If `prefers-color-scheme` is not supported, fall back to light mode.
// i.e. In this case, inject the `light` CSS before the others, with
// no media filter so that it will be downloaded with highest priority.
if (window.matchMedia("(prefers-color-scheme: dark)").media === "not all") {
    document.documentElement.style.display = "none";
    document.head.insertAdjacentHTML(
        "beforeend",
        '<link id="css" rel="stylesheet" href="assets/css/theme.css" onload="document.documentElement.style.display = \'\'">'
    );
}

$(document).ready(function () {
    const toggleButton = $("#toggle-btn");
    var isCssInitialized = false;

    function setColorPreference(colorPreference, persist = false) {
        const newColorScheme = colorPreference;
        const oldColorScheme = colorPreference === "light" ? "dark" : "light";
        const body = $("body");
        body.addClass("color-scheme-" + newColorScheme);
        body.removeClass("color-scheme-" + oldColorScheme);
        if (newColorScheme == "dark") {
            $("meta[name='theme-color']").attr("content", "night");
            onNightMode();
        } else {
            $("meta[name='theme-color']").attr("content", "light");
            onLightMode();
        }
        if (persist) {
            localStorage.setItem("preferred-color-scheme", colorPreference);
        }
    }

    function updateUI(colorPreference, id = "css") {
        toggleButton.prop("checked", colorPreference === "dark");
        if (isCssInitialized) {
            const linkElement = $("#" + id);
            const linkData = linkElement.data();
            if (toggleButton.prop("checked")) {
                linkElement.attr("href", linkData.hrefDark);
            } else {
                linkElement.attr("href", linkData.hrefLight);
            }
            linkData.colorScheme = colorPreference;
        }
    }

    function initColorCSS(colorPreference, id = "css") {
        isCssInitialized = true;
        $("#" + id).remove();
        const lightLinkElement = $("#" + id + "-light");
        const darkLinkElement = $("#" + id + "-dark");
        let linkElement, otherLinkElement;
        if (colorPreference === "dark") {
            linkElement = darkLinkElement;
            otherLinkElement = lightLinkElement;
        } else {
            linkElement = lightLinkElement;
            otherLinkElement = darkLinkElement;
        }
        linkElement.attr("data-href-light", lightLinkElement.attr("href"));
        linkElement.attr("data-href-dark", darkLinkElement.attr("href"));
        linkElement.attr("data-color-scheme", colorPreference);
        linkElement.attr("media", "all");
        linkElement.attr("id", id);
        otherLinkElement.remove();
    }

    toggleButton.on("click", function () {
        const colorPreference = toggleButton.prop("checked") ? "dark" : "light";
        if (!isCssInitialized) console.log("initColorCSS");
        setColorPreference(colorPreference, true);
        updateUI(colorPreference);
    });
    const osColorPreference = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    var preferredColorScheme = localStorage.getItem("preferred-color-scheme");
    if (preferredColorScheme !== null) {
        initColorCSS(preferredColorScheme);
    } else {
        preferredColorScheme = osColorPreference;
    }
    setColorPreference(preferredColorScheme, false);
    updateUI(preferredColorScheme);
});
