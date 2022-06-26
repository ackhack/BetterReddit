const keys = {
    "Escape": {
        "last": 0,
        "func": escape
    },
    "Enter": {
        "last": 0,
        "func": enter
    },
    "ArrowUp": {
        "last": 0,
        "func": arrowUp
    },
    "ArrowDown": {
        "last": 0,
        "func": arrowDown
    },
    "ArrowLeft": {
        "last": 0,
        "func": arrowLeft
    },
    "ArrowRight": {
        "last": 0,
        "func": arrowRight
    },
    " ": {
        "last": 0,
        "func": space
    },
    "m": {
        "last": 0,
        "func": m
    }
}


document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (keys[evt.key]) {
        let now = Date.now()
        if (keys[evt.key].last + 500 < now) {
            keys[evt.key].func(evt);
            keys[evt.key].last = now;
        }
    }
};

document.onkeyup = function (evt) {
    evt = evt || window.event;
    if (keys[evt.key]) {
        keys[evt.key].last = 0;
    }
};

function escape(evt) {
    switch (currDisplay) {
        case "mainArticle":
            evt.preventDefault();

            closeMain();
            break;
    }
}

function arrowUp(evt) {
    switch (currDisplay) {
        case "mainArticle":
            if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                closeMain();
            }
            break;
        case "mainPage":
            evt.preventDefault();

            if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                if (activePost.divIndex !== undefined && activePost.postIndex !== undefined)
                    upvote(postArray[activePost.postIndex], document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_up")[0]);
                return;
            }
            if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                postToMain(document.getElementById("mainList").children[activePost.divIndex]);
            }
            break;
    }
}

function arrowDown(evt) {
    switch (currDisplay) {
        case "mainPage":
            evt.preventDefault();

            if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                if (activePost.divIndex !== undefined && activePost.postIndex !== undefined)
                    downvote(postArray[activePost.postIndex], document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_down")[0]);
                return;
            }
            break;
    }
}

function arrowLeft(evt) {
    switch (currDisplay) {
        case "mainArticle":
            if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                shiftSlides(-1, document.getElementById("mainContent").getElementsByClassName("post_gallery")[0].title);
            }
            break;
        case "mainPage":
            evt.preventDefault();

            if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                setActivePostByIndex(activePost.divIndex - 1);
                return;
            }
            if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                shiftSlides(-1, document.getElementById("mainList").children[activePost.divIndex].title);
            }
            break;
    }
}

function arrowRight(evt) {
    switch (currDisplay) {
        case "mainArticle":
            if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                shiftSlides(1, document.getElementById("mainContent").getElementsByClassName("post_gallery")[0].title);
            }
            break;
        case "mainPage":
            evt.preventDefault();

            if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                setActivePostByIndex(activePost.divIndex + 1);
                return;
            }
            if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                shiftSlides(1, document.getElementById("mainList").children[activePost.divIndex].title);
            }
            break;
    }
}

function space(evt) {
    switch (currDisplay) {
        case "mainPage":
            evt.preventDefault();

            document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_player")[0]?.togglePause();
            break;
    }
}

function m(evt) {
    switch (currDisplay) {
        case "mainPage":
            evt.preventDefault();

            document.getElementById("mainList").children[activePost.divIndex].getElementsByClassName("post_player")[0]?.toggleMute();
            break;
    }
}

function enter(evt) {
    switch (currDisplay) {
        case "mainPage":
            evt.preventDefault();

            if (activePost.divIndex !== undefined) {
                postToMain(document.getElementById("mainList").children[activePost.divIndex]);
            }
            break;
    }
}