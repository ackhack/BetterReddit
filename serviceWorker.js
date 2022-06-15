chrome.runtime.onMessage.addListener(
    function (request, sender, onSuccess) {

        switch (request.type) {
            case "GET_SECRETS":
                loadSecrets(onSuccess);
                break;
            default:
                return false;
        }
        return true;
    }
);

function loadSecrets(callb) {
    //Try to get the secret.json
    fetch(chrome.runtime.getURL('secrets.json'))
        .then((response) => {
            response.json().then((json) => {
                client = json;
                if (client.clientId == undefined || client.clientSecret == undefined || client.username == undefined || client.password == undefined) callb(false)
                callb(client);
            })
        }).catch(_ => callb(false));
}