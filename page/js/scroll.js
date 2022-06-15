let scroll = function () {
    if (document.getElementById("mainPage").style.display == "none") return;

    if (updateThisInstance) {
        updateActivePost();
    } else {
        updateThisInstance = true;
    }
};
let requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

let lastScrollTop = window.scrollY;
let updateThisInstance = true;

function scrollLoop() {
    var scrollTop = window.scrollY;
    if (lastScrollTop === scrollTop) {
        requestAnimationFrame(scrollLoop);
        return;
    } else {
        lastScrollTop = scrollTop;
        scroll();
        requestAnimationFrame(scrollLoop);
    }
}