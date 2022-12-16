// ==UserScript==
// @name         Link Saver
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Save my links into proper place
// @author       Anatoliy Bondar
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           GM_openInTab
// @grant           GM_registerMenuCommand
// ==/UserScript==

const TABLES = "<PUT_tables.json_CONTENT_HERE>";
const LOCAL_SERVER_PORT = "<PUT_HERE_VALUE_FROM_.env_FILE>";

(function() {
    TABLES.forEach(table => {
        table.tabs.forEach(tab => {
            GM.registerMenuCommand(`${table.name}:${tab}`, (mouseEvent) => {
                if (!window.rightClickPairs) {
                    alert('For some reason there are no rightClicks yet!');
                    return;
                }
                const { text, href } = window.rightClickPairs[window.rightClickPairs.length - 1];
        
                const xhttp = new XMLHttpRequest();
                xhttp.open('POST', `http://localhost:${LOCAL_SERVER_PORT}/?tableName=${table.name}&tabName=${tab}&href=${encodeURI(href)}`, true);
                xhttp.send();
            });
        })
    });
})();

// Save right click info to use later, when context menu is choosed
document.addEventListener('contextmenu', function(event) {
    if (!window.rightClickPairs) {
        window.rightClickPairs = [];
    }

    let target = event.target;
    let href = target.href;
    const text = target.firstChild;

    // get most deep text and first found href
    while (!href && target.parentNode) {
        target = target.parentNode;
        href = target.href;
    }
    // if clicked not on link, save current page
    if (!href) {
        href = window.location.href;
        text = document.title;
    }
    window.rightClickPairs.push({
        text,
        href,
    });
}, false);