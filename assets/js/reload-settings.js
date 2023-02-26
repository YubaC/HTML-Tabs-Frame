"use strict";
// !Works when settings were changed in the settings page or new content div or iframe was added

/**
 * Reloads the settings, this is called when the settings are changed in the settings page or when a new content div or iframe is added.
 */
function reloadSettings() {
    var $itemsToUpdate = $(
        "." + contentBoxClass + ", ." + contentBoxClass + "Active"
    );

    //   !Settings to be updated
    //   * font-size
    $itemsToUpdate.css(
        "font-size",
        settings["font-size"] * 20 + 100 + "%",
        " !important"
    );
}
