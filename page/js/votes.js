let voteList = {};
let voteKey = 'savedVotes';
let voteHistoryLimit = 100;

function loadVotes() {
    try {
        let data = localStorage.getItem(voteKey);
        if (data != null) {
            Object.assign(voteList, JSON.parse(data));
        }
    } catch (e) {
        // ignored
    }
}

function saveVotes() {
    try {
        localStorage.setItem(voteKey, JSON.stringify(voteList));
    } catch (e) {
        // Storage full or unavailable
    }
}

function getVotingDiv(object, sideways, prefix) {
    let votes = document.createElement("div");
    votes.className = prefix + "_object_votes" + (sideways ? " votes_sideways" : "");

    let up = document.createElement("p");
    up.className = prefix + "_up hoverable arrow_up_p";
    up.style = "text-align: center;";
    up.onclick = (ev) => upvote(object, ev.target);
    let iup = document.createElement("i");
    iup.className = prefix + "_up arrow arrow_up" + (sideways ? " arrow_up_sideways" : "");
    up.appendChild(iup);
    votes.appendChild(up);

    let upvotes = document.createElement("span");
    upvotes.className = prefix + "_upvotes" + (sideways ? " upvotes_sideways" : "");
    upvotes.innerText = object.ups;
    votes.appendChild(upvotes);

    let down = document.createElement("p");
    down.className = prefix + "_down hoverable arrow_down_p";
    down.style = "text-align: center;";
    down.onclick = (ev) => downvote(object, ev.target);
    let idown = document.createElement("i");
    idown.className = "arrow arrow_down";
    down.appendChild(idown);
    votes.appendChild(down);

    // Restore previous vote state
    applyVoteStyle(votes, voteList[object.name]);
    return votes;
}

function applyVoteStyle(voteDiv, state) {
    if (voteDiv == null || state === undefined) return;
    let upvotes = voteDiv.children[1];
    let upArrow = voteDiv.children[0].children[0];
    let downArrow = voteDiv.children[2].children[0];
    if (state == 1) {
        upvotes.style.color = "orange";
        upArrow.style.border = "solid orange";
        upArrow.style["border-width"] = "0 5 5 0";
        downArrow.style.border = "solid white";
        downArrow.style["border-width"] = "0 5 5 0";
    } else if (state == -1) {
        upvotes.style.color = "lightblue";
        downArrow.style.border = "solid lightblue";
        downArrow.style["border-width"] = "0 5 5 0";
        upArrow.style.border = "solid white";
        upArrow.style["border-width"] = "0 5 5 0";
    }
}

function refreshRenderedVotes() {
    for (let postDiv of document.querySelectorAll("#mainList .post")) {
        applyVoteStyle(postDiv.querySelector(".post_object_votes"), voteList[postDiv.title]);
    }
}

async function syncVotesFromReddit() {
    try {
        let user = api.getUser(username);
        let upvoted = await user.getUpvotedContent({ limit: voteHistoryLimit });
        let downvoted = await user.getDownvotedContent({ limit: voteHistoryLimit });
        let changed = false;
        for (let post of upvoted) {
            if (voteList[post.name] === undefined) {
                voteList[post.name] = 1;
                changed = true;
            }
        }
        for (let post of downvoted) {
            if (voteList[post.name] === undefined) {
                voteList[post.name] = -1;
                changed = true;
            }
        }
        if (changed) {
            saveVotes();
        }
        refreshRenderedVotes();
        log('Vote history synced from reddit', true);
    } catch (e) {
        log(e);
        sendNotification(e);
    }
}

function upvote(object, target) {
    if (voteList[object.name] == 1) {
        object.unvote();
        target.children[0].style.border = "solid white";
        target.children[0].style["border-width"] = "0 5 5 0";
        target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) - 1;
        delete voteList[object.name];
        saveVotes();
        target.parentElement.children[1].style.color = "white";
        return;
    };
    object.upvote();
    target.children[0].style.border = "solid orange";
    target.children[0].style["border-width"] = "0 5 5 0";
    target.parentElement.children[2].children[0].style.border = "solid white";
    target.parentElement.children[2].children[0].style["border-width"] = "0 5 5 0";
    target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) + 1;
    voteList[object.name] = 1;
    saveVotes();
    target.parentElement.children[1].style.color = "orange";
}

function downvote(object, target) {
    if (target.tagName !== "P") return;
    if (voteList[object.name] == -1) {
        object.unvote();
        target.children[0].style.border = "solid white";
        target.children[0].style["border-width"] = "0 5 5 0";
        target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) + 1;
        delete voteList[object.name];
        saveVotes();
        target.parentElement.children[1].style.color = "white";
        return;
    };
    object.downvote();
    target.children[0].style.border = "solid lightblue";
    target.children[0].style["border-width"] = "0 5 5 0";
    target.parentElement.children[0].children[0].style.border = "solid white";
    target.parentElement.children[0].children[0].style["border-width"] = "0 5 5 0";
    target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) - 1;
    voteList[object.name] = -1;
    saveVotes();
    target.parentElement.children[1].style.color = "lightblue";
}