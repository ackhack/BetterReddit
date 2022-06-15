document.onkeydown = function (evt) {
    evt = evt || window.event;
    switch (evt.key) {
        case "Escape":
            closeMain();
            break;
        case "Enter":
            enter(evt);
            break;
        case "ArrowUp":
            arrowUp(evt);
            break;
        case "ArrowDown":
            arrowDown(evt);
            break;
        case "ArrowLeft":
            arrowLeft(evt);
            break;
        case "ArrowRight":
            arrowRight(evt);
            break;
        case " ":
            space(evt);
            break;
        case "m":
            m(evt);
            break;
    }

};

function arrowUp(evt) {
    if (document.getElementById("mainPage").style.display == "none") {
        if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
            closeMain();
        }
        return;
    };
    evt.preventDefault();

    if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        if (activePost.divIndex !== undefined && activePost.postIndex !== undefined)
            upvote(postArray[activePost.postIndex], document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_up")[0]);
        return;
    }
    if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        postToMain(document.getElementById("mainList").children[activePost.divIndex]);
    }
}

function arrowDown(evt) {
    if (document.getElementById("mainPage").style.display == "none") return;
    evt.preventDefault();

    if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        if (activePost.divIndex !== undefined && activePost.postIndex !== undefined)
            downvote(postArray[activePost.postIndex], document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_down")[0]);
        return;
    }
}

function arrowLeft(evt) {
    if (document.getElementById("mainPage").style.display == "none") return;
    evt.preventDefault();

    if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        setActivePostByIndex(activePost.divIndex - 1);
        return;
    }
    if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        shiftSlides(-1, document.getElementById("mainList").children[activePost.divIndex].title);
    }
}

function arrowRight(evt) {
    if (document.getElementById("mainPage").style.display == "none") return;
    evt.preventDefault();

    if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        setActivePostByIndex(activePost.divIndex + 1);
        return;
    }
    if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        shiftSlides(1, document.getElementById("mainList").children[activePost.divIndex].title);
    }
}

function space(evt) {
    if (document.getElementById("mainPage").style.display == "none") return;
    evt.preventDefault();

    document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_player")[0]?.togglePause();

}

function m(evt) {
    if (document.getElementById("mainPage").style.display == "none") return;
    evt.preventDefault();

    document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_player")[0]?.toggleMute();

}

function enter(evt) {
    if (document.getElementById("mainPage").style.display == "none") return;
    evt.preventDefault();

    if (activePost.divIndex !== undefined) {
        postToMain(document.getElementById("mainList").children[activePost.divIndex]);
    }
}