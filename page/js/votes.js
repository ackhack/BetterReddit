let voteList = {};

function getVotingDiv(object, sideways, prefix) {
    let votes = document.createElement("div");
    votes.className = prefix + "_object_votes" + (sideways ? " votes_sideways" : "");
    voteList[object.name] = 0;

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
    return votes;
}

function upvote(object, target) {
    if (voteList[object.name] == 1) {
        object.unvote();
        target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) - 1;
        voteList[object.name] = 0;
        target.parentElement.children[1].style.color = "white";
        return;
    };
    object.upvote();
    target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) + 1 - voteList[object.name];
    voteList[object.name] = 1;
    target.parentElement.children[1].style.color = "orange";
}

function downvote(object, target) {
    if (target.tagName !== "P") return;
    if (voteList[object.name] == -1) {
        object.unvote();
        target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) + 1;
        voteList[object.name] = 0;
        target.parentElement.children[1].style.color = "white";
        return;
    };
    object.downvote();
    target.parentElement.children[1].innerText = parseInt(target.parentElement.children[1].innerText) - 1 - voteList[object.name];
    voteList[object.name] = -1;
    target.parentElement.children[1].style.color = "lightblue";
}