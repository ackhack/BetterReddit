fetch(chrome.runtime.getURL('page/betterreddit.html'))
.then((response) => {
    chrome.tabs.create({ url: response.url });
}).catch(err => console.log(err));