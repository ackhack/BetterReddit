let activePost = { postIndex: undefined, divIndex: undefined };
let postsBlocked = false;

function loadPostByName(name) {
    api.getSubmission(name.split("_")[1]).fetch().then(post => {
        postsToList([post]);
    }).catch(e => {
        log(e);
        sendNotification(e);
    });
}

function loadFirstPosts() {
    log('Load First Posts', true);
    api.getBest({ limit: 10, after: newest_fullname }).then(posts => {
        postsToList(posts);
        setActivePostByIndex(0);
    }).catch(e => {
        log(e);
        sendNotification(e);
    });
}

function loadMorePosts() {
    if (postsBlocked) return;
    log('Load More Posts', true);
    postsBlocked = true;
    api.getBest({ limit: 50, after: newest_fullname }).then(posts => {
        postsToList(posts);
    }).catch(e => {
        log(e);
        sendNotification(e);
    });
}

function postsToList(posts) {

    let list = document.getElementById("mainList");
    for (post of posts) {
        try {
            list.appendChild(getPostDiv(post));
            postArray.push(post);
            newest_fullname = post.name;
            log('Added ' + post.title, true);
        } catch (ex) {
            log(ex);
            sendNotification(ex);
        }
    }
    startGalleries();
    postsBlocked = false;
}

function getPostDiv(post) {

    if (postArray.filter(x => x.name == post.name).length > 0) throw new Error("Post already exists: " + post.name);

    let div = document.createElement("div");
    div.className = "post post_element";
    div.title = post.name;

    let header = document.createElement("div");
    header.className = "post_header post_element";

    let subreddit = document.createElement("div");
    subreddit.className = "post_subreddit post_element hoverable";
    subreddit.innerText = post.subreddit_name_prefixed;
    subreddit.title = "https://www.reddit.com/" + post.subreddit_name_prefixed;
    subreddit.onclick = (ev) => open(ev.target.title);

    let author = document.createElement("div");
    author.className = "post_author post_element hoverable";
    author.innerText = post.author.name;
    author.title = "https://www.reddit.com/user/" + post.author.name;
    author.onclick = (ev) => open(ev.target.title);

    header.appendChild(subreddit);
    header.appendChild(author);
    div.appendChild(header);

    let title = document.createElement("span");
    title.className = "post_title post_element hoverable";
    title.innerText = post.title;
    title.title = "http://reddit.com" + post.permalink;
    title.onclick = (ev) => open(ev.target.title);

    if (post.spoiler) {
        title.style["border-bottom"] = "1px solid lightblue";
    }
    if (post.over_18) {
        title.style["border-bottom"] = "1px solid orange";
    }

    div.appendChild(title);

    let body = document.createElement("div");
    body.className = "post_body post_element";

    body.appendChild(getVotingDiv(post, false, "post"))

    body.appendChild(getContentDiv(post));
    div.appendChild(body);
    return div;
}

function getContentDiv(post, forMain = false) {

    if (post["crosspost_parent"] !== undefined) {
        post = post.crosspost_parent_list[post.crosspost_parent_list.length - 1];
    }
    let ContentUrl = post.url;
    let text = post.selftext_html;

    let content = document.createElement("div");
    content.className = "post_content post_element hoverable";
    if (!forMain) content.onclick = (ev) => {
        if (!(ev.target.classList.contains("no_click_passthrough")))
            postToMain(content.parentElement.parentElement)
    };

    if (text) {
        let text = document.createElement("p");
        text.className = "post_text post_element";
        text.innerHTML = post.selftext_html;
        content.appendChild(text);
        return content;
    }

    if (ContentUrl.endsWith("gifv")) {
        content.appendChild(createVideoPlayerDiv(ContentUrl.replace("gifv", "mp4")));
        return content;
    }

    if (ContentUrl.startsWith("https://www.reddit.com/gallery/")) {
        content.appendChild(getGalleryDiv(post));
        return content;
    }

    if (ContentUrl.startsWith("https://v.redd.it/")) {
        content.appendChild(createVideoPlayerDiv(post.media.reddit_video.fallback_url, post.media.reddit_video.fallback_url.replace(/DASH_\d+\.mp4.*/, "DASH_audio.mp4")));
        return content;
    }

    if (ContentUrl.startsWith("https://www.redgifs.com/watch/") ||
        ContentUrl.startsWith("https://twitter.com/") ||
        ContentUrl.startsWith("https://gfycat.com/")) {
        content.innerHTML += post.secure_media_embed.content;
        Array.from(content.getElementsByTagName("iframe")).forEach(iframe => { iframe.className += " post_element post_iframe"; if (iframe.style.position == "absolute") { iframe.style.position = "relative" } });
        return content;
    }

    if (ContentUrl.startsWith("https://www.reddit.com/r")) {
        return content;
    }

    if (ContentUrl.match(/^https:\/\/www\.youtube\.com\/watch\?v=/)) {
        let iframe = document.createElement("iframe");
        iframe.className = "post_element post_iframe no_click_passthrough";
        iframe.src = "https://www.youtube.com/embed/" + ContentUrl.split("=")[1];
        content.appendChild(iframe);
        return content;
    }

    if (ContentUrl.match(/.*\/[^\.]+$/g) || ContentUrl.endsWith("html") || ContentUrl.endsWith("htm") || ContentUrl.endsWith("php")) {
        let a = document.createElement("a");
        a.className = "post_text post_element no_click_passthrough";
        a.href = ContentUrl;
        a.innerText = ContentUrl;
        content.appendChild(a);
        return content;
    }

    if (ContentUrl.startsWith("https://img.zettai.moe/")) {
        let img = document.createElement("img");
        img.className = "post_image post_element";
        img.src = post.preview.images[0].resolutions[post.preview.images[0].resolutions.length - 1].url;
        content.appendChild(img);
        return content;
    }

    let img = document.createElement("img");
    img.className = "post_image post_element";
    img.src = ContentUrl;
    content.appendChild(img);
    return content;
}


function updateActivePost() {
    let post = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    if (post.id == "mainList") {
        post = document.elementFromPoint(window.innerWidth / 2, (window.innerHeight / 2) + 11);
    }
    setActivePost(post);
}

function setActivePost(div) {
    while (!div.className.match(/.*post[ $].*/)) {
        div = div.parentElement;
        if (div.parentElement == null) {
            return false;
        }
    }

    setActivePostByIndex(Array.from(document.getElementById("mainList").children).indexOf(div), false);

    return true;
}

function setActivePostByIndex(divIndex, scroll = true) {

    if (divIndex < 0 || divIndex >= document.getElementById("mainList").children.length) return;

    if (divIndex == activePost.divIndex) {
        if (scroll)
            scrollIntoView(newDiv);
        return;
    };

    let oldDiv = document.getElementById("mainList").children[activePost.divIndex];
    if (oldDiv) {
        oldDiv.style.border = "1px solid white";
        let player = oldDiv.getElementsByClassName("post_player")[0];
        if (player) {
            player.setVolume(0);
            player.pause();
        }
    }

    let childs = Array.from(document.getElementById("mainList").children);

    let newDiv = childs[divIndex];

    activePost.divIndex = divIndex;
    activePost.postIndex = postArray.indexOf(postArray.find(x => x.name == newDiv.title));

    if (activePost.divIndex > childs.length - 10) {
        setTimeout(loadMorePosts, 0);
    }

    newDiv.style.border = "1px solid green";
    newDiv.getElementsByClassName("post_player")[0]?.play();
    if (scroll)
        scrollIntoView(newDiv);
}