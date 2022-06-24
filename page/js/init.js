init();

async function init() {
    loadSecrets(success => {
        if (!success) {
            sendNotification('Error loading secrets');
            return;
        }
        log('Secrets loaded', true);
        loadSettings();
        log('Settings loaded', true);
        initHeader();
        loadFirstPosts();
        document.getElementById("mainBack").onclick = () => closeMain();
        if (requestAnimationFrame) {
            scrollLoop();
        }
        log("Finished loading");
    });
}

function loadSecrets(callb) {
    chrome.runtime.sendMessage({ type: "GET_SECRETS" }, function (response) {
        if (response) {
            username = response.username;
            api = new snoowrap({
                userAgent: 'private viewer for reddit',
                clientId: response.clientId,
                clientSecret: response.clientSecret,
                username: response.username,
                password: response.password
            });
            callb(true);
            return;
        }
        callb(false)
    })
}

function initHeader() {
    log('Init Header', true);
    let header = document.getElementById("header");

    let link = document.createElement('div');
    link.onclick = () => open("https://www.reddit.com");
    link.innerText = "Reddit";
    link.className = "header_link hoverable";
    link.style = "float:left;"
    header.appendChild(link);

    let user = document.createElement('div');
    user.onclick = (ev) => open("https://www.reddit.com/user/" + ev.target.innerText);
    user.innerText = username;
    user.className = "header_link hoverable";
    user.style = "float:right;"
    header.appendChild(user);
}