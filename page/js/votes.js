let voteList = {};
let voteKey = 'savedVotes';

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
    if (voteList[object.name]) {
        if (voteList[object.name] == 1) {
            upvotes.style.color = "orange";
            iup.style.border = "solid orange";
            iup.style["border-width"] = "0 5 5 0";
            voteList[object.name] = 1;
        } else if (voteList[object.name] == -1) {
            upvotes.style.color = "lightblue";
            idown.style.border = "solid lightblue";
            idown.style["border-width"] = "0 5 5 0";
            voteList[object.name] = -1;
        }
    }
    return votes;
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