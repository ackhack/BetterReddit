let verbose = false;
let postArray = [];
let api = {};
let username = "";
let newest_fullname = "";
let currDisplay = "mainPage";

function log(content, devLevel = false) {
    if (!verbose && devLevel) return;
    console.log(content);
}

function scrollIntoView(div) {
    if (div == undefined || div == null) return;
    updateThisInstance = false;
    div.scrollIntoView();
    updateThisInstance = false;
    window.scrollBy(0, -23);
}