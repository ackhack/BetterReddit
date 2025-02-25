function closeMain() {
    let mainArticle = document.getElementById("mainArticle");
    let mainPage = document.getElementById("mainPage");

    mainArticle.style.display = "none";
    mainArticle.children[1].innerHTML = "";
    mainArticle.children[0].children[1].innerHTML = "";
    mainArticle.children[0].children[2].innerHTML = "";
    mainArticle.children[3].innerHTML = "";
    mainArticle.children[4].innerHTML = "";
    mainPage.style.display = "block";
    currDisplay = "mainPage";

    let listDiv = document.getElementById("mainList").children[activePost.divIndex];

    if (listDiv != undefined) {
        let mainContent = document.getElementById("mainContent");
        listDiv.getElementsByClassName("post_body")[0].appendChild(mainContent.children[0]);
        mainContent.innerHTML = "";
    }

    scrollIntoView(listDiv);
    comments = [];
}

function postToMain(div) {

    if (!setActivePost(div)) {
        log('Post not found', true);
        return;
    }

    let content = div.getElementsByClassName("post_content")[0];

    if (content == undefined || content == null) {
        log('Error: Post not found', true);
        sendNotification("Error: Post not found");
        return;
    }

    let post = postArray[activePost.postIndex];

    let mainArticle = document.getElementById("mainArticle");
    let mainContent = document.getElementById("mainContent");
    let mainComments = document.getElementById("mainComments");
    let mainPage = document.getElementById("mainPage");

    mainContent.innerHTML = "";

    let title = document.createElement("span");
    title.className = "main_title hoverable";
    title.innerText = post.title;
    title.title = "http://reddit.com" + post.permalink;
    title.onclick = (ev) => open(ev.target.title);

    let subreddit = document.createElement("div");
    subreddit.className = "main_subreddit hoverable";
    subreddit.innerText = post.subreddit_name_prefixed;
    subreddit.onclick = (ev) => open("https://www.reddit.com/" + ev.target.innerText);

    let author = document.createElement("div");
    author.className = "main_author hoverable";
    author.innerText = post.author.name;
    author.onclick = (ev) => open("https://www.reddit.com/user/" + ev.target.innerText);

    mainArticle.children[1].appendChild(title);
    mainArticle.children[0].children[1].appendChild(subreddit);
    mainArticle.children[0].children[2].appendChild(author);
    mainArticle.children[4].innerText = post.name;
    mainPage.style.display = "none";
    mainArticle.style.display = "block";
    currDisplay = "mainArticle";

    mainContent.appendChild(content);

    updateThisInstance = false;
    window.scroll(0, 0);
    getCommentsDiv(post, div => mainComments.appendChild(div));
}

function getCommentsDiv(post, callb) {
    log('Get Comments', true);
    let postName = post.name;
    let mainDiv = document.createElement("div");
    mainDiv.className = "main_comments";

    function addCommentListToDiv(list, mainDiv) {
        console.log(list);
        if (list.length == 0) {
            let div = document.createElement("div");
            let span = document.createElement("span");

            span.innerText = "No Comments available";

            div.appendChild(span);
            mainDiv.appendChild(div);
            return mainDiv;
        }

        for (let comment of post.comments.list) {
            try {
                let div = getCommentDiv(comment);
                if (postName !== document.getElementById("mainFullname").innerText) break;
                mainDiv.appendChild(div);
                getCommentTreesDivs(comment).forEach(d => div.append(d))
                log('Comment: ' + comment.body, true);
            } catch (ex) {
                log(ex);
                sendNotification(ex);
            }
        }

        return mainDiv;
    }

    if (post.comments.list == undefined) {
        let div = document.createElement("div");
        let span = document.createElement("span");

        div.style = "border-top:1px solid white;";
        span.innerText = "Waiting for Comments";

        div.appendChild(span);
        mainDiv.appendChild(div);

        post.comments.fetch_all().then(res => {
            if (res == undefined) {
                log('Error: Api not responding', true);
                sendNotification("Error: Api not responding");
                return;
            }
            post.comments.list = res;
            mainDiv.removeChild(div);
            callb(addCommentListToDiv(post.comments.list, mainDiv));
        });
    } else {
        callb(addCommentListToDiv(post.comments.list, mainDiv));
    }
}

function getCommentTreesDivs(comment) {

    function getTree(comment) {
        let tree = getCommentDiv(comment);
        tree.className = "main_comment_tree";
        for (let rep of comment.replies) {
            tree.appendChild(getTree(rep));
        }
        return tree;
    }

    let array = [];

    for (let rep of comment.replies) {
        array.push(getTree(rep));
    }

    return array;
}

function getCommentDiv(comment) {
    let div = document.createElement("div");
    div.className = "main_comment";
    div.title = comment.name;

    let header = document.createElement("div");
    header.className = "main_comment_header";

    let author = document.createElement("span");
    author.className = "main_comment_author";
    author.innerText = comment.author.name;
    header.appendChild(author);

    header.appendChild(getVotingDiv(comment, true, "main_comment"));

    div.appendChild(header);

    let span = document.createElement("span");
    span.className = "main_comment_text";
    span.innerHTML = comment.body_html;

    div.appendChild(span);
    return div;
}