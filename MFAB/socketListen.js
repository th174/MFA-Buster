try {
    chrome.storage.local.get(['pushbulletToken'], function (result) {
        const token = result.pushbulletToken;
        const websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + token);
        const passcodeMatcher = /SMS passcodes:(?: ([0-9]+))+/;
        const socketTimeout = 5 * 60 * 1000;
        websocket.onopen = function () {
            //window.alert("Socket opened and listening!");
            setTimeout(function () {
                websocket.close();
            }, socketTimeout);
        };
        websocket.onmessage = function (message) {
            const data = JSON.parse(message.data);
            if (data.hasOwnProperty('type') && data.type === "push" && data.hasOwnProperty('push')) {
                const content = data.push;
                if (content.hasOwnProperty('type') && content.type === "sms_changed" && content.hasOwnProperty('notifications')) {
                    for (let i = 0; i < content.notifications.length; i++) {
                        let passcodes;
                        if (content.notifications[i].hasOwnProperty('body') && (passcodes = passcodeMatcher.exec(content.notifications[i].body))) {
                            const duoPasscodeInputField = document.getElementById('duoPasscodeInput');
                            duoPasscodeInputField.value = passcodes[1];
                            websocket.close();
                        }
                    }
                }
            }
        }
    });
} catch (e) {
    window.alert(e.toString());
}

