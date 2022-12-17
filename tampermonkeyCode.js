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
const LOCAL_SERVER_URL_PATH = '/write-href-to-google-sheet'; // make sure its same with .env value

(function() {
    TABLES.forEach(table => {
        table.tabs.forEach(tab => {
            GM.registerMenuCommand(`${table.name}:${tab}`, (mouseEvent) => {
                if (!window.rightClickPairs) {
                    alert('For some reason there are no rightClicks yet!');
                    return;
                }
                const { text, href } = window.rightClickPairs[window.rightClickPairs.length - 1];
        
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `http://localhost:${LOCAL_SERVER_PORT}${LOCAL_SERVER_URL_PATH}?tableName=${table.name}&tabName=${tab}&href=${encodeURI(href)}`, true);
                xhr.onload = () => {
                    if (xhr.readyState === xhr.DONE) {
                        if (xhr.status === 200) {
                            alert(`Done. ${xhr.responseText}`);
                        } else {
                            alert(`ERROR! ${xhr.responseText}`);
                        }
                    }
                };
                xhr.send();
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
    let text = '';
    let href = '';

    if (target) {
        text = target.firstChild;
        href = target.href;

        // get most deep text and first found href
        while (!href && target.parentNode) {
            target = target.parentNode;
            href = target.href;
        }
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