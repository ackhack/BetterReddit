const settings = {
    "scrollMiddle": true,
    "blurNSFW": false,
    "blurSpoiler": false
}

function setSetting(name, value) {
    settings[name] = value;
    saveSetting(name, value);
}

function getSetting(name) {
    return settings[name];
}

function saveSetting(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

function loadSettings() {
    for (let settingName in settings) {
        let setting = localStorage.getItem(settingName);
        if (setting != null) {
            settings[settingName] = JSON.parse(setting);
        }
    }
}