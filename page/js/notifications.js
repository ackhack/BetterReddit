let notifications = [];

function sendNotification(message) {
    document.getElementById("notificationList").appendChild(getNotificationDiv(message));
    notifications.push(message);
}

function getNotificationDiv(message) {
    let div = document.createElement("div");
    div.className = "notification hoverable";
    div.innerText = message.toString();
    div.onclick = () => { div.remove(); };
    return div;
}
